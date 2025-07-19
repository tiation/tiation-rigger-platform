import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { connectDatabase } from './database/connection';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error-handler';
import { authMiddleware } from './middleware/auth';
import { validateRequest } from './middleware/validation';
import { setupRoutes } from './routes';
import { initializeServices } from './services';
import { HealthCheckService } from './services/health-check';
import { MetricsService } from './services/metrics';
import { setupSocketHandlers } from './socket/handlers';

// Load environment variables
config();

interface ServerConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  corsOrigin: string;
  redisUrl: string;
  rateLimitWindow: number;
  rateLimitMax: number;
}

class RiggerPlatformServer {
  private app: Application;
  private server: any;
  private io: SocketServer;
  private config: ServerConfig;
  private healthCheckService: HealthCheckService;
  private metricsService: MetricsService;

  constructor() {
    this.app = express();
    this.config = this.loadConfig();
    this.healthCheckService = new HealthCheckService();
    this.metricsService = new MetricsService();
    
    this.initializeMiddleware();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocket();
  }

  private loadConfig(): ServerConfig {
    return {
      port: parseInt(process.env.PORT || '3001', 10),
      nodeEnv: process.env.NODE_ENV || 'development',
      databaseUrl: process.env.DATABASE_URL || 'postgresql://rigger_user:rigger_password@localhost:5432/rigger_platform',
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
      rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
      rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    };
  }

  private initializeMiddleware(): void {
    // Trust proxy for rate limiting and security
    this.app.set('trust proxy', 1);

    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          fontSrc: ["'self'", "https:", "data:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    this.app.use(cors({
      origin: this.config.corsOrigin.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: this.config.rateLimitWindow,
      max: this.config.rateLimitMax,
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(this.config.rateLimitWindow / 1000),
      },
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => req.path === '/health' || req.path === '/metrics',
    });
    this.app.use('/api', limiter);

    // Body parsing and compression
    this.app.use(compression());
    this.app.use(express.json({ 
      limit: '10mb',
      verify: (req, res, buf) => {
        try {
          JSON.parse(buf.toString());
        } catch (e) {
          throw new Error('Invalid JSON');
        }
      }
    }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging and ID
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      // Add request ID for tracing
      req.id = require('uuid').v4();
      
      logger.info(`${req.method} ${req.url}`, {
        requestId: req.id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
      });
      
      next();
    });

    // Metrics collection
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - startTime;
        this.metricsService.recordRequestMetrics(
          req.method, 
          req.route?.path || req.url, 
          res.statusCode, 
          duration
        );
      });
      
      next();
    });
  }

  private initializeSwagger(): void {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Rigger Platform API',
          version: '1.0.0',
          description: 'Enterprise-grade API for workforce management and job marketplace for riggers and construction workers',
          contact: {
            name: 'Tiation API Support',
            email: 'api-support@tiation.com',
            url: 'https://tiation.com/support',
          },
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
          },
        },
        servers: [
          {
            url: `http://localhost:${this.config.port}`,
            description: 'Development server',
          },
          {
            url: 'https://api.rigger-platform.tiation.com',
            description: 'Production server',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              description: 'JWT authorization header using the Bearer scheme',
            },
          },
          schemas: {
            Error: {
              type: 'object',
              required: ['success', 'message'],
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'An error occurred' },
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                details: { type: 'object' },
              },
            },
            Success: {
              type: 'object',
              required: ['success'],
              properties: {
                success: { type: 'boolean', example: true },
                data: { type: 'object' },
                message: { type: 'string', example: 'Operation successful' },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      apis: [
        './src/routes/*.ts', 
        './src/controllers/*.ts',
        './src/models/*.ts',
      ],
    };

    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    
    // Serve swagger UI
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Rigger Platform API Documentation',
    }));

    // Serve swagger JSON
    this.app.get('/api-docs.json', (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }

  private initializeRoutes(): void {
    // Health check endpoints (no auth required)
    this.app.get('/health', (req: Request, res: Response) => {
      const healthStatus = this.healthCheckService.getHealthStatus();
      res.status(healthStatus.status === 'healthy' ? 200 : 503).json(healthStatus);
    });

    this.app.get('/metrics', (req: Request, res: Response) => {
      res.status(200).json(this.metricsService.getMetrics());
    });

    // API version endpoint
    this.app.get('/api/version', (req: Request, res: Response) => {
      res.json({
        success: true,
        data: {
          version: '1.0.0',
          name: 'Rigger Platform API',
          environment: this.config.nodeEnv,
          timestamp: new Date().toISOString(),
        },
      });
    });

    // Main API routes
    setupRoutes(this.app);

    // Handle 404 for all other routes
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private initializeSocket(): void {
    this.server = createServer(this.app);
    this.io = new SocketServer(this.server, {
      cors: {
        origin: this.config.corsOrigin.split(','),
        methods: ['GET', 'POST'],
        credentials: true,
      },
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
        skipMiddlewares: true,
      },
    });

    setupSocketHandlers(this.io);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();
      logger.info('Database connected successfully');

      // Initialize services (Redis, external APIs, etc.)
      await initializeServices(this.config);
      logger.info('Services initialized successfully');

      // Start server
      this.server.listen(this.config.port, () => {
        logger.info(`🚀 Rigger Platform API Server running on port ${this.config.port} in ${this.config.nodeEnv} mode`);
        logger.info(`📚 API Documentation: http://localhost:${this.config.port}/api-docs`);
        logger.info(`🏥 Health Check: http://localhost:${this.config.port}/health`);
        logger.info(`📊 Metrics: http://localhost:${this.config.port}/metrics`);
      });

      // Start health monitoring
      this.healthCheckService.startMonitoring();
      
      // Start metrics collection
      this.metricsService.startCollection();

      // Handle uncaught exceptions gracefully
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    try {
      logger.info('Shutting down Rigger Platform API Server...');
      
      // Stop monitoring services
      this.healthCheckService.stopMonitoring();
      this.metricsService.stopCollection();
      
      // Close socket connections
      if (this.io) {
        this.io.close();
      }
      
      // Close HTTP server
      if (this.server) {
        await new Promise<void>((resolve) => {
          this.server.close(() => resolve());
        });
      }
      
      logger.info('Server stopped successfully');
    } catch (error) {
      logger.error('Error stopping server:', error);
    }
  }

  private setupGracefulShutdown(): void {
    // Graceful shutdown handling
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      await this.stop();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      await this.stop();
      process.exit(0);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit immediately, let the app handle it gracefully
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      // Exit after logging
      setTimeout(() => process.exit(1), 1000);
    });
  }
}

// Start the server
const server = new RiggerPlatformServer();

// Only start if this file is run directly (not imported)
if (require.main === module) {
  server.start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export { RiggerPlatformServer };
export default server;