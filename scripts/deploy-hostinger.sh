#!/bin/bash

# Rigger Platform - Hostinger VPS Deployment Script
# This script automates the deployment process to Hostinger VPS

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/tiaastor/tiation-rigger-platform.git"
DEPLOY_DIR="/opt/rigger-platform"
DOMAIN="your-domain.com"  # Update this with your actual domain
EMAIL="admin@your-domain.com"  # Update this with your email

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root for security reasons"
        log_info "Please run as a regular user with sudo privileges"
        exit 1
    fi
}

# Update system packages
update_system() {
    log_info "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    log_success "System packages updated"
}

# Install required dependencies
install_dependencies() {
    log_info "Installing required dependencies..."
    
    # Install Docker
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        log_success "Docker installed"
    else
        log_info "Docker already installed"
    fi

    # Install Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        log_success "Docker Compose installed"
    else
        log_info "Docker Compose already installed"
    fi

    # Install other utilities
    sudo apt install -y git curl nginx certbot python3-certbot-nginx ufw htop
    log_success "Dependencies installed"
}

# Configure firewall
configure_firewall() {
    log_info "Configuring firewall..."
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw --force enable
    log_success "Firewall configured"
}

# Clone or update repository
setup_repository() {
    log_info "Setting up repository..."
    
    if [ -d "$DEPLOY_DIR" ]; then
        log_info "Repository exists, pulling latest changes..."
        cd $DEPLOY_DIR
        git pull origin main
    else
        log_info "Cloning repository..."
        sudo mkdir -p $DEPLOY_DIR
        sudo chown $USER:$USER $DEPLOY_DIR
        git clone $REPO_URL $DEPLOY_DIR
        cd $DEPLOY_DIR
    fi
    
    log_success "Repository setup complete"
}

# Setup environment configuration
setup_environment() {
    log_info "Setting up environment configuration..."
    cd $DEPLOY_DIR
    
    if [ ! -f ".env" ]; then
        log_info "Creating .env file from template..."
        cp .env.production .env
        
        # Generate random secrets
        JWT_SECRET=$(openssl rand -base64 64)
        JWT_REFRESH_SECRET=$(openssl rand -base64 64)
        POSTGRES_PASSWORD=$(openssl rand -base64 32)
        
        # Update .env file
        sed -i "s/your-domain.com/$DOMAIN/g" .env
        sed -i "s/CHANGE_THIS_TO_LONG_RANDOM_STRING/$JWT_SECRET/g" .env
        sed -i "s/CHANGE_THIS_TO_ANOTHER_LONG_RANDOM_STRING/$JWT_REFRESH_SECRET/g" .env
        sed -i "s/CHANGE_THIS_PASSWORD/$POSTGRES_PASSWORD/g" .env
        
        log_success ".env file created with random secrets"
        log_warning "Please review and update .env file with your specific configuration"
    else
        log_info ".env file already exists"
    fi
}

# Setup SSL certificates
setup_ssl() {
    log_info "Setting up SSL certificates..."
    
    # Create SSL directory
    sudo mkdir -p $DEPLOY_DIR/infrastructure/nginx/ssl
    
    # Get Let's Encrypt certificates
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive --redirect
    
    # Copy certificates to nginx ssl directory
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $DEPLOY_DIR/infrastructure/nginx/ssl/certificate.crt
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $DEPLOY_DIR/infrastructure/nginx/ssl/private.key
    sudo chown $USER:$USER $DEPLOY_DIR/infrastructure/nginx/ssl/*
    
    log_success "SSL certificates configured"
}

# Update nginx configuration
update_nginx_config() {
    log_info "Updating nginx configuration..."
    cd $DEPLOY_DIR
    
    # Update domain in nginx config
    sed -i "s/your-domain.com/$DOMAIN/g" infrastructure/nginx/nginx.prod.conf
    
    log_success "Nginx configuration updated"
}

# Build and start services
deploy_services() {
    log_info "Building and starting services..."
    cd $DEPLOY_DIR
    
    # Create necessary directories
    mkdir -p logs uploads backups
    
    # Build and start services
    docker-compose -f docker-compose.production.yml down
    docker-compose -f docker-compose.production.yml build --no-cache
    docker-compose -f docker-compose.production.yml up -d
    
    log_success "Services deployed"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    cd $DEPLOY_DIR
    
    # Wait for database to be ready
    sleep 30
    
    # Run Prisma migrations
    docker-compose -f docker-compose.production.yml exec -T api npm run db:migrate
    docker-compose -f docker-compose.production.yml exec -T api npm run db:seed
    
    log_success "Database migrations completed"
}

# Setup monitoring and health checks
setup_monitoring() {
    log_info "Setting up monitoring..."
    
    # Create systemd service for health monitoring
    sudo tee /etc/systemd/system/rigger-platform-monitor.service > /dev/null <<EOF
[Unit]
Description=Rigger Platform Health Monitor
After=docker.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$DEPLOY_DIR
ExecStart=$DEPLOY_DIR/scripts/health-monitor.sh
Restart=always
RestartSec=60

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable rigger-platform-monitor.service
    sudo systemctl start rigger-platform-monitor.service
    
    log_success "Monitoring setup complete"
}

# Setup automatic backups
setup_backups() {
    log_info "Setting up automatic backups..."
    
    # Add cron job for daily backups
    (crontab -l 2>/dev/null; echo "0 2 * * * cd $DEPLOY_DIR && docker-compose -f docker-compose.production.yml exec -T postgres pg_dump -U rigger_user rigger_platform > backups/backup_\$(date +\%Y\%m\%d_\%H\%M\%S).sql") | crontab -
    
    # Add cron job for cleanup old backups
    (crontab -l 2>/dev/null; echo "0 3 * * * find $DEPLOY_DIR/backups -name '*.sql' -mtime +30 -delete") | crontab -
    
    log_success "Backup cron jobs configured"
}

# Print deployment summary
print_summary() {
    log_success "🎉 Deployment completed successfully!"
    echo
    echo -e "${GREEN}=== DEPLOYMENT SUMMARY ===${NC}"
    echo -e "Domain: ${BLUE}https://$DOMAIN${NC}"
    echo -e "API URL: ${BLUE}https://api.$DOMAIN${NC}"
    echo -e "Deploy Directory: ${BLUE}$DEPLOY_DIR${NC}"
    echo -e "Services Status: ${BLUE}docker-compose -f $DEPLOY_DIR/docker-compose.production.yml ps${NC}"
    echo
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Update your domain DNS to point to this server's IP"
    echo "2. Review and update .env file configuration"
    echo "3. Test all functionality"
    echo "4. Set up regular monitoring and backups"
    echo
    echo -e "${GREEN}=== USEFUL COMMANDS ===${NC}"
    echo "View logs: docker-compose -f $DEPLOY_DIR/docker-compose.production.yml logs -f"
    echo "Restart services: docker-compose -f $DEPLOY_DIR/docker-compose.production.yml restart"
    echo "Update deployment: cd $DEPLOY_DIR && git pull && docker-compose -f docker-compose.production.yml up -d --build"
    echo
}

# Main deployment flow
main() {
    log_info "🚀 Starting Rigger Platform deployment to Hostinger VPS..."
    
    check_root
    update_system
    install_dependencies
    configure_firewall
    setup_repository
    setup_environment
    update_nginx_config
    setup_ssl
    deploy_services
    run_migrations
    setup_monitoring
    setup_backups
    print_summary
}

# Run main function
main "$@"