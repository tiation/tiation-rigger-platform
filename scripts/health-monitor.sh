#!/bin/bash

# Rigger Platform Health Monitor
# Monitors services and automatically restarts if needed

DEPLOY_DIR="/opt/rigger-platform"
LOG_FILE="$DEPLOY_DIR/logs/health-monitor.log"
COMPOSE_FILE="$DEPLOY_DIR/docker-compose.production.yml"

# Create log file if it doesn't exist
mkdir -p "$DEPLOY_DIR/logs"
touch "$LOG_FILE"

log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

check_service() {
    local service_name="$1"
    local health_url="$2"
    
    if curl -f -s "$health_url" > /dev/null; then
        log_message "✅ $service_name is healthy"
        return 0
    else
        log_message "❌ $service_name is unhealthy"
        return 1
    fi
}

restart_service() {
    local service_name="$1"
    log_message "🔄 Restarting $service_name..."
    cd "$DEPLOY_DIR"
    docker-compose -f "$COMPOSE_FILE" restart "$service_name"
    sleep 30
    log_message "✅ $service_name restarted"
}

# Main monitoring loop
while true; do
    log_message "🔍 Starting health check cycle"
    
    # Check API service
    if ! check_service "API" "http://localhost:3001/health"; then
        restart_service "api"
    fi
    
    # Check Web service
    if ! check_service "Web" "http://localhost:3000/"; then
        restart_service "web"
    fi
    
    # Check database connectivity
    if ! docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_isready -U rigger_user > /dev/null 2>&1; then
        log_message "❌ PostgreSQL is not responding"
        restart_service "postgres"
    else
        log_message "✅ PostgreSQL is healthy"
    fi
    
    # Check Redis connectivity
    if ! docker-compose -f "$COMPOSE_FILE" exec -T redis redis-cli ping > /dev/null 2>&1; then
        log_message "❌ Redis is not responding"
        restart_service "redis"
    else
        log_message "✅ Redis is healthy"
    fi
    
    log_message "✅ Health check cycle completed"
    
    # Wait 5 minutes before next check
    sleep 300
done