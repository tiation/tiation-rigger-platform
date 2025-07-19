import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Declare global variable for Prisma client (helps with hot reload in development)
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create Prisma client instance
const prisma = globalThis.__prisma ?? new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Set up event listeners for Prisma logs
prisma.$on('query', (e) => {
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Prisma Query', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
      timestamp: e.timestamp,
    });
  }
});

prisma.$on('error', (e) => {
  logger.error('Prisma Error', {
    message: e.message,
    target: e.target,
    timestamp: e.timestamp,
  });
});

prisma.$on('info', (e) => {
  logger.info('Prisma Info', {
    message: e.message,
    target: e.target,
    timestamp: e.timestamp,
  });
});

prisma.$on('warn', (e) => {
  logger.warn('Prisma Warning', {
    message: e.message,
    target: e.target,
    timestamp: e.timestamp,
  });
});

// Store the instance globally in development to prevent multiple instances
if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

/**
 * Connect to the database and run initial checks
 */
export async function connectDatabase(): Promise<void> {
  try {
    // Test the connection
    await prisma.$connect();
    
    // Run a simple query to verify the connection
    await prisma.$queryRaw`SELECT 1`;
    
    logger.info('Database connection established successfully');
    
    // Log database info
    const result = await prisma.$queryRaw`SELECT version()` as any[];
    if (result.length > 0) {
      logger.info(`Connected to database: ${result[0].version}`);
    }
    
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
}

/**
 * Disconnect from the database
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
    throw error;
  }
}

/**
 * Get database health status
 */
export async function getDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  message: string;
  responseTime?: number;
}> {
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      message: 'Database connection is healthy',
      responseTime,
    };
  } catch (error) {
    logger.error('Database health check failed:', error);
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Database connection failed',
    };
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<{
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  activeConnections: number;
}> {
  try {
    const [users, jobs, applications] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.jobApplication.count(),
    ]);

    // Get active connections (PostgreSQL specific)
    const connections = await prisma.$queryRaw`
      SELECT count(*) as count 
      FROM pg_stat_activity 
      WHERE state = 'active'
    ` as any[];

    return {
      totalUsers: users,
      totalJobs: jobs,
      totalApplications: applications,
      activeConnections: connections[0]?.count || 0,
    };
  } catch (error) {
    logger.error('Failed to get database stats:', error);
    return {
      totalUsers: 0,
      totalJobs: 0,
      totalApplications: 0,
      activeConnections: 0,
    };
  }
}

/**
 * Clean up database connections on app shutdown
 */
process.on('SIGINT', async () => {
  await disconnectDatabase();
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
});

export { prisma };
export default prisma;