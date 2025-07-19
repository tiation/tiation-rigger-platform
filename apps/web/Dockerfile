# Multi-stage build for Next.js web application
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/shared/package*.json ./packages/shared/
COPY packages/ui/package*.json ./packages/ui/

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
RUN npm run build --workspace=packages/ui

# Build the web application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build --workspace=apps/web

# Production image
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 rigger-web

# Copy built application
COPY --from=builder --chown=rigger-web:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=rigger-web:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=rigger-web:nodejs /app/apps/web/public ./apps/web/public

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT=3000

# Switch to non-root user
USER rigger-web

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["node", "apps/web/server.js"]