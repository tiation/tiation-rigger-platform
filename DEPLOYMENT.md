# Rigger Platform - Hostinger VPS Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- Hostinger VPS with Ubuntu 20.04+ or CentOS 8+
- Domain name pointed to your VPS IP
- SSH access to your VPS
- Minimum 2GB RAM, 2 CPU cores, 20GB storage

### One-Command Deployment

```bash
# Connect to your VPS
ssh root@your-vps-ip

# Create deployment user (recommended for security)
adduser deployer
usermod -aG sudo deployer
su - deployer

# Run the automated deployment script
curl -fsSL https://raw.githubusercontent.com/tiaastor/tiation-rigger-platform/main/scripts/deploy-hostinger.sh -o deploy.sh
chmod +x deploy.sh
./deploy.sh
```

## 🔧 Manual Deployment Steps

### 1. System Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install additional tools
sudo apt install -y git curl nginx certbot python3-certbot-nginx ufw
```

### 2. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

### 3. Clone Repository

```bash
# Create deployment directory
sudo mkdir -p /opt/rigger-platform
sudo chown $USER:$USER /opt/rigger-platform

# Clone repository
git clone https://github.com/tiaastor/tiation-rigger-platform.git /opt/rigger-platform
cd /opt/rigger-platform
```

### 4. Environment Configuration

```bash
# Copy and configure environment file
cp .env.production .env

# Edit environment variables
nano .env
```

**Important Environment Variables:**
```bash
# Update these with your actual values
DOMAIN=your-domain.com
API_URL=https://api.your-domain.com
WEB_URL=https://your-domain.com

# Generate secure random secrets
JWT_SECRET=your-64-character-random-string
JWT_REFRESH_SECRET=your-64-character-random-string
POSTGRES_PASSWORD=your-secure-database-password

# Email configuration (optional)
SMTP_HOST=smtp.hostinger.com
SMTP_USER=noreply@your-domain.com
SMTP_PASS=your-email-password
```

### 5. SSL Certificate Setup

```bash
# Get Let's Encrypt SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Copy certificates to Docker volume
sudo mkdir -p /opt/rigger-platform/infrastructure/nginx/ssl
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/rigger-platform/infrastructure/nginx/ssl/certificate.crt
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /opt/rigger-platform/infrastructure/nginx/ssl/private.key
sudo chown $USER:$USER /opt/rigger-platform/infrastructure/nginx/ssl/*
```

### 6. Update Configuration Files

```bash
# Update domain in nginx configuration
sed -i 's/your-domain.com/yourdomain.com/g' infrastructure/nginx/nginx.prod.conf

# Update deployment script domain
sed -i 's/your-domain.com/yourdomain.com/g' scripts/deploy-hostinger.sh
```

### 7. Deploy Services

```bash
# Create necessary directories
mkdir -p logs uploads backups

# Build and start services
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d

# Check services status
docker-compose -f docker-compose.production.yml ps
```

### 8. Database Setup

```bash
# Wait for database to start (30 seconds)
sleep 30

# Run database migrations
docker-compose -f docker-compose.production.yml exec api npm run db:migrate

# Seed initial data
docker-compose -f docker-compose.production.yml exec api npm run db:seed
```

## 🔍 Verification

### Check Services Health

```bash
# Check all services
docker-compose -f docker-compose.production.yml ps

# Check logs
docker-compose -f docker-compose.production.yml logs -f

# Test API health
curl http://localhost:3001/health

# Test web application
curl http://localhost:3000/
```

### Access Your Application

- **Web Dashboard**: `https://your-domain.com`
- **API Documentation**: `https://your-domain.com/api-docs`
- **Health Check**: `https://your-domain.com/health`

### Default Login Credentials

**Administrator Account:**
- Email: `admin@riggerplatform.com`
- Password: `admin123!`

**Sample Worker Account:**
- Email: `worker@riggerplatform.com`
- Password: `worker123!`

**Sample Employer Account:**
- Email: `employer@riggerplatform.com`
- Password: `employer123!`

**⚠️ IMPORTANT: Change these default passwords immediately in production!**

## 🔧 Post-Deployment Configuration

### 1. Update Admin Password

```bash
# Access the web dashboard at https://your-domain.com
# Login with admin@riggerplatform.com / admin123!
# Go to Settings > Security > Change Password
```

### 2. Configure Email Settings

```bash
# Update SMTP settings in .env file
nano .env

# Restart services to apply changes
docker-compose -f docker-compose.production.yml restart api
```

### 3. Set Up Monitoring

```bash
# Enable health monitoring service
sudo systemctl enable rigger-platform-monitor.service
sudo systemctl start rigger-platform-monitor.service

# Check monitoring status
sudo systemctl status rigger-platform-monitor.service
```

### 4. Configure Backups

```bash
# Set up automated daily backups (already configured in deployment script)
crontab -l

# Manual backup
docker-compose -f docker-compose.production.yml exec postgres pg_dump -U rigger_user rigger_platform > backup_$(date +%Y%m%d).sql
```

## 📱 Mobile App Configuration

### Update API Endpoints

The mobile app needs to be configured to point to your production API:

1. Update `apps/mobile/src/config/api.ts`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'https://api.your-domain.com',
  WS_URL: 'wss://api.your-domain.com',
};
```

2. Rebuild and redistribute the mobile app

## 🔄 Updates and Maintenance

### Application Updates

```bash
cd /opt/rigger-platform

# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose -f docker-compose.production.yml up -d --build

# Run any new migrations
docker-compose -f docker-compose.production.yml exec api npm run db:migrate
```

### System Maintenance

```bash
# View application logs
docker-compose -f docker-compose.production.yml logs -f

# Monitor system resources
htop

# Check disk space
df -h

# Clean up old Docker images
docker system prune -a
```

### SSL Certificate Renewal

```bash
# Certbot auto-renewal (should be automatic)
sudo certbot renew --dry-run

# Manual certificate renewal
sudo certbot renew
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /opt/rigger-platform/infrastructure/nginx/ssl/certificate.crt
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /opt/rigger-platform/infrastructure/nginx/ssl/private.key
docker-compose -f docker-compose.production.yml restart nginx
```

## 🆘 Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check Docker daemon
sudo systemctl status docker

# Check logs for errors
docker-compose -f docker-compose.production.yml logs

# Restart all services
docker-compose -f docker-compose.production.yml restart
```

**Database connection issues:**
```bash
# Check PostgreSQL logs
docker-compose -f docker-compose.production.yml logs postgres

# Connect to database manually
docker-compose -f docker-compose.production.yml exec postgres psql -U rigger_user -d rigger_platform
```

**SSL/HTTPS issues:**
```bash
# Check nginx configuration
docker-compose -f docker-compose.production.yml exec nginx nginx -t

# Check certificate files
ls -la infrastructure/nginx/ssl/

# Restart nginx
docker-compose -f docker-compose.production.yml restart nginx
```

### Log Locations

- Application logs: `/opt/rigger-platform/logs/`
- Nginx logs: `/var/log/nginx/`
- System logs: `/var/log/syslog`
- Docker logs: `docker-compose logs`

### Performance Optimization

```bash
# Monitor resource usage
docker stats

# Optimize PostgreSQL (edit .env)
POSTGRES_SHARED_BUFFERS=256MB
POSTGRES_EFFECTIVE_CACHE_SIZE=1GB

# Enable Redis persistence
REDIS_APPENDONLY=yes
```

## 📞 Support

For deployment issues or questions:

- **Documentation**: Check this deployment guide
- **Logs**: Review application and system logs
- **GitHub Issues**: Report bugs at repository issues page
- **Email**: Contact support team

## 🔐 Security Best Practices

1. **Change Default Passwords**: Update all default admin passwords
2. **Firewall**: Keep UFW enabled with minimal open ports
3. **Updates**: Regularly update system and application
4. **Backups**: Verify backup systems are working
5. **Monitoring**: Check logs regularly for suspicious activity
6. **SSL**: Ensure SSL certificates are valid and auto-renewing

---

**🎉 Congratulations! Your Rigger Platform is now deployed and running on Hostinger VPS!**