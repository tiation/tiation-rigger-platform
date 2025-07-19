# Multi-stage build for Node.js API
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Build the source code
FROM base AS builder
WORKDIR /app

# Copy all files
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build shared packages first
RUN npm run build --workspace=packages/shared

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build the API
RUN npm run build --workspace=apps/api

# Production image
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 rigger-api

# Copy built application
COPY --from=builder --chown=rigger-api:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=rigger-api:nodejs /app/apps/api/prisma ./prisma
COPY --from=builder --chown=rigger-api:nodejs /app/apps/api/package*.json ./
COPY --from=deps --chown=rigger-api:nodejs /app/node_modules ./node_modules

# Create logs directory
RUN mkdir -p logs && chown rigger-api:nodejs logs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Switch to non-root user
USER rigger-api

# Expose the port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/server.js"]