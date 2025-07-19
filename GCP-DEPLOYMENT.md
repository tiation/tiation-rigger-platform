# Rigger Platform - Google Cloud Platform Deployment Guide

## 🚀 Quick GCP Deployment

### Prerequisites
- Google Cloud Platform account with billing enabled
- Google Cloud SDK (gcloud CLI) installed
- Terraform >= 1.0 installed
- Docker installed
- Domain name (optional but recommended)

### One-Command Deployment

```bash
# Clone the repository
git clone https://github.com/tiaastor/tiation-rigger-platform.git
cd tiation-rigger-platform

# Run the automated GCP deployment script
chmod +x scripts/deploy-gcp.sh
./scripts/deploy-gcp.sh --project your-gcp-project-id --domain your-domain.com
```

## 🔧 Manual GCP Deployment Steps

### 1. Set Up Google Cloud Platform

#### Install Google Cloud SDK
```bash
# macOS
brew install google-cloud-sdk

# Ubuntu/Debian
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Initialize gcloud
gcloud init
```

#### Set Up Project
```bash
# Create new project (optional)
gcloud projects create your-project-id --name="Rigger Platform"

# Set project
gcloud config set project your-project-id

# Enable billing (do this in Google Cloud Console)
```

### 2. Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  sql.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  compute.googleapis.com \
  vpcaccess.googleapis.com \
  redis.googleapis.com \
  storage.googleapis.com \
  monitoring.googleapis.com \
  logging.googleapis.com
```

### 3. Set Up Terraform

#### Install Terraform
```bash
# macOS
brew install terraform

# Ubuntu/Debian
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform
```

#### Configure Terraform Backend
```bash
# Create bucket for Terraform state
gsutil mb -p your-project-id gs://your-project-id-terraform-state
gsutil versioning set on gs://your-project-id-terraform-state
```

### 4. Deploy Infrastructure

```bash
cd infrastructure/gcp/terraform

# Initialize Terraform
terraform init

# Create terraform.tfvars
cat > terraform.tfvars <<EOF
project_id = "your-project-id"
region = "us-central1"
zone = "us-central1-a"
domain = "your-domain.com"
environment = "production"
EOF

# Plan deployment
terraform plan

# Apply configuration
terraform apply
```

### 5. Build and Deploy Applications

```bash
# Configure Docker for GCP
gcloud auth configure-docker

# Build and deploy using Cloud Build
gcloud builds submit --config=infrastructure/gcp/cloudbuild.yaml
```

## 🏗️ GCP Architecture

### Services Overview

```
┌─────────────────┐    ┌─────────────────┐
│   Cloud DNS     │    │  Load Balancer  │
│                 │    │     (HTTPS)     │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                     │
         ┌─────────────────────────┐
         │     Cloud Run           │
         │  ┌─────────────────────┐│
         │  │   Web App (Next.js) ││
         │  └─────────────────────┘│
         │  ┌─────────────────────┐│
         │  │   API (Node.js)     ││
         │  └─────────────────────┘│
         └─────────────────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼────┐    ┌─────▼─────┐    ┌─────▼─────┐
│Cloud SQL│    │ Cloud     │    │  Cloud    │
│PostgreSQL│   │ Memorystore│   │  Storage  │
│         │    │ (Redis)   │    │           │
└─────────┘    └───────────┘    └───────────┘
```

### Components

#### **Cloud Run Services**
- **API Service**: Node.js/TypeScript backend
- **Web Service**: Next.js frontend
- Auto-scaling from 0 to 10 instances
- Private networking via VPC Connector

#### **Database & Storage**
- **Cloud SQL**: PostgreSQL 15 with automatic backups
- **Cloud Memorystore**: Redis 7 for caching
- **Cloud Storage**: File uploads and static assets

#### **Security & Networking**
- **VPC Network**: Private connectivity between services
- **Secret Manager**: Secure storage of sensitive data
- **SSL/TLS**: Automatic HTTPS certificates
- **IAM**: Role-based access control

#### **Monitoring & Logging**
- **Cloud Monitoring**: Performance metrics and alerts
- **Cloud Logging**: Centralized log management
- **Error Reporting**: Automatic error tracking

## 🔐 Security Configuration

### Secret Management
All sensitive data is stored in Google Secret Manager:
- JWT secrets
- Database passwords
- API keys
- SSL certificates

### Network Security
- Private VPC with restricted egress
- Cloud SQL with private IP only
- VPC Connector for secure communication
- SSL/TLS encryption for all traffic

### Access Control
- Service accounts with minimal permissions
- Cloud IAM for resource access
- Authenticated container registry

## 🚀 Deployment Features

### Automated CI/CD
- **Cloud Build**: Automatic builds on git push
- **Container Registry**: Secure image storage
- **Cloud Deploy**: Blue-green deployments
- **Rollback**: One-click rollback capability

### Scalability
- **Auto-scaling**: 0 to 10 instances based on traffic
- **Load balancing**: Global HTTP(S) load balancer
- **CDN**: Cloud CDN for static assets
- **Multi-region**: Deploy to multiple regions

### Cost Optimization
- **Pay-per-use**: Only pay for actual usage
- **Cold starts**: Scale to zero when idle
- **Resource limits**: Prevent runaway costs
- **Budget alerts**: Monitor spending

## 📊 Monitoring & Observability

### Built-in Monitoring
```bash
# View Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision"

# View SQL logs
gcloud logging read "resource.type=cloudsql_database"

# Monitor performance
gcloud monitoring metrics list
```

### Custom Dashboards
- Application performance metrics
- Database connection pools
- Error rates and response times
- User activity and engagement

### Alerting
- High error rates
- Database connection issues
- Resource utilization
- Budget thresholds

## 🔄 Updates & Maintenance

### Application Updates
```bash
# Build and deploy latest code
gcloud builds submit --config=infrastructure/gcp/cloudbuild.yaml

# Deploy specific image
gcloud run deploy rigger-platform-api \
  --image gcr.io/PROJECT_ID/rigger-platform-api:TAG \
  --region us-central1
```

### Database Maintenance
```bash
# Create manual backup
gcloud sql backups create \
  --instance=rigger-platform-db \
  --project=your-project-id

# List backups
gcloud sql backups list --instance=rigger-platform-db
```

### Infrastructure Updates
```bash
cd infrastructure/gcp/terraform

# Update infrastructure
terraform plan
terraform apply
```

## 💰 Cost Estimation

### Monthly Costs (Approximate)
- **Cloud Run**: $20-50/month (depending on traffic)
- **Cloud SQL**: $25-50/month (db-f1-micro)
- **Cloud Memorystore**: $35/month (1GB)
- **Cloud Storage**: $5-20/month (depending on usage)
- **Load Balancer**: $18/month
- **Total**: ~$100-150/month for moderate usage

### Cost Optimization Tips
1. Use Cloud Run's scale-to-zero feature
2. Set appropriate resource limits
3. Enable automatic backups cleanup
4. Use budget alerts
5. Monitor usage with Cloud Billing

## 🌐 Custom Domain Setup

### DNS Configuration
1. **Create DNS Zone in Cloud DNS**:
```bash
gcloud dns managed-zones create rigger-platform \
  --description="Rigger Platform DNS zone" \
  --dns-name=your-domain.com
```

2. **Add DNS Records**:
```bash
# A record for main domain
gcloud dns record-sets transaction start --zone=rigger-platform
gcloud dns record-sets transaction add LOAD_BALANCER_IP \
  --name=your-domain.com. --ttl=300 --type=A --zone=rigger-platform

# CNAME for API subdomain
gcloud dns record-sets transaction add your-domain.com. \
  --name=api.your-domain.com. --ttl=300 --type=CNAME --zone=rigger-platform

gcloud dns record-sets transaction execute --zone=rigger-platform
```

3. **Configure Load Balancer**:
- Create SSL certificates
- Map domains to Cloud Run services
- Set up URL routing

## 🆘 Troubleshooting

### Common Issues

#### **Cloud Run Service Won't Start**
```bash
# Check logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50

# Check service status
gcloud run services describe rigger-platform-api --region=us-central1
```

#### **Database Connection Issues**
```bash
# Check VPC connector
gcloud compute networks vpc-access connectors describe rigger-platform-connector --region=us-central1

# Test database connection
gcloud sql connect rigger-platform-db --user=rigger_user
```

#### **Build Failures**
```bash
# Check build logs
gcloud builds log BUILD_ID

# List recent builds
gcloud builds list --limit=10
```

### Performance Issues
- Check Cloud Monitoring dashboards
- Analyze Cloud Trace for request latency
- Review Cloud Profiler for CPU/memory usage
- Scale up Cloud Run instances if needed

### Security Issues
- Review IAM permissions
- Check VPC firewall rules
- Verify SSL certificate status
- Monitor Cloud Security Command Center

## 📞 Support & Resources

### Google Cloud Documentation
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Terraform Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

### Monitoring & Logging
- [Cloud Monitoring](https://cloud.google.com/monitoring)
- [Cloud Logging](https://cloud.google.com/logging)
- [Error Reporting](https://cloud.google.com/error-reporting)

### Support Channels
- Google Cloud Support Console
- Stack Overflow (google-cloud-platform tag)
- Google Cloud Community Slack

---

## 🎉 Success!

Your Rigger Platform is now running on Google Cloud Platform with:

✅ **Scalable Architecture** - Auto-scaling Cloud Run services  
✅ **Secure Infrastructure** - VPC, SSL, Secret Manager  
✅ **Managed Database** - Cloud SQL PostgreSQL with backups  
✅ **Global CDN** - Fast content delivery worldwide  
✅ **Monitoring** - Real-time metrics and alerting  
✅ **CI/CD Pipeline** - Automated deployments  

**Access your application**:
- **Web App**: `https://your-domain.com`
- **API**: `https://api.your-domain.com`
- **Admin Panel**: `https://your-domain.com/admin`

**Default Login**:
- Email: `admin@riggerplatform.com`
- Password: `admin123!`

**🚨 Remember to change the default admin password!**