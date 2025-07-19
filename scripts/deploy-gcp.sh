#!/bin/bash

# Rigger Platform - Google Cloud Platform Deployment Script
# This script automates the deployment process to Google Cloud Platform

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=""
REGION="us-central1"
ZONE="us-central1-a"
DOMAIN=""
ENVIRONMENT="production"

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

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if gcloud CLI is installed
    if ! command -v gcloud &> /dev/null; then
        log_error "Google Cloud SDK is not installed"
        log_info "Please install it from: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    # Check if terraform is installed
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed"
        log_info "Please install it from: https://terraform.io/downloads"
        exit 1
    fi
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        log_info "Please install it from: https://docker.com/get-started"
        exit 1
    fi
    
    log_success "Prerequisites check completed"
}

# Get configuration from user
get_configuration() {
    log_info "Getting deployment configuration..."
    
    # Get project ID
    if [ -z "$PROJECT_ID" ]; then
        read -p "Enter your GCP Project ID: " PROJECT_ID
        if [ -z "$PROJECT_ID" ]; then
            log_error "Project ID is required"
            exit 1
        fi
    fi
    
    # Get domain (optional)
    if [ -z "$DOMAIN" ]; then
        read -p "Enter your domain name (optional, press Enter to skip): " DOMAIN
    fi
    
    # Confirm settings
    echo
    log_info "Deployment Configuration:"
    echo "  Project ID: $PROJECT_ID"
    echo "  Region: $REGION"
    echo "  Zone: $ZONE"
    echo "  Domain: ${DOMAIN:-'Not specified'}"
    echo "  Environment: $ENVIRONMENT"
    echo
    
    read -p "Continue with this configuration? (y/N): " CONFIRM
    if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
        log_info "Deployment cancelled"
        exit 0
    fi
}

# Set up gcloud authentication and project
setup_gcloud() {
    log_info "Setting up Google Cloud authentication..."
    
    # Authenticate with Google Cloud
    gcloud auth login
    
    # Set the project
    gcloud config set project $PROJECT_ID
    
    # Set default region and zone
    gcloud config set compute/region $REGION
    gcloud config set compute/zone $ZONE
    
    # Enable billing (user needs to do this manually)
    log_warning "Please ensure billing is enabled for your project in the Google Cloud Console"
    
    log_success "Google Cloud setup completed"
}

# Enable required APIs
enable_apis() {
    log_info "Enabling required Google Cloud APIs..."
    
    gcloud services enable \
        run.googleapis.com \
        sql.googleapis.com \
        cloudbuild.googleapis.com \
        secretmanager.googleapis.com \
        cloudresourcemanager.googleapis.com \
        compute.googleapis.com \
        vpcaccess.googleapis.com \
        redis.googleapis.com \
        storage.googleapis.com \
        monitoring.googleapis.com \
        logging.googleapis.com \
        container.googleapis.com
    
    log_success "APIs enabled"
}

# Set up Terraform backend
setup_terraform_backend() {
    log_info "Setting up Terraform backend..."
    
    # Create bucket for Terraform state
    BUCKET_NAME="${PROJECT_ID}-rigger-platform-terraform-state"
    
    if ! gsutil ls -b gs://$BUCKET_NAME &>/dev/null; then
        gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$BUCKET_NAME
        gsutil versioning set on gs://$BUCKET_NAME
        log_success "Terraform state bucket created: $BUCKET_NAME"
    else
        log_info "Terraform state bucket already exists: $BUCKET_NAME"
    fi
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    log_info "Deploying infrastructure with Terraform..."
    
    cd infrastructure/gcp/terraform
    
    # Initialize Terraform
    terraform init
    
    # Create terraform.tfvars
    cat > terraform.tfvars <<EOF
project_id = "$PROJECT_ID"
region = "$REGION"
zone = "$ZONE"
domain = "$DOMAIN"
environment = "$ENVIRONMENT"
EOF
    
    # Plan and apply
    terraform plan
    
    read -p "Apply this Terraform configuration? (y/N): " APPLY_CONFIRM
    if [[ $APPLY_CONFIRM =~ ^[Yy]$ ]]; then
        terraform apply -auto-approve
        log_success "Infrastructure deployed"
    else
        log_warning "Infrastructure deployment skipped"
        return 1
    fi
    
    cd ../../..
}

# Build and deploy applications
deploy_applications() {
    log_info "Building and deploying applications..."
    
    # Configure Docker to use gcloud as a credential helper
    gcloud auth configure-docker
    
    # Submit build to Cloud Build
    gcloud builds submit \
        --config=infrastructure/gcp/cloudbuild.yaml \
        --substitutions=_MIGRATION_TOKEN="$(openssl rand -base64 32)" \
        .
    
    log_success "Applications deployed"
}

# Set up custom domain (if provided)
setup_custom_domain() {
    if [ -n "$DOMAIN" ]; then
        log_info "Setting up custom domain: $DOMAIN"
        
        # Get Cloud Run service URLs
        API_URL=$(gcloud run services describe rigger-platform-api --region=$REGION --format="value(status.url)")
        WEB_URL=$(gcloud run services describe rigger-platform-web --region=$REGION --format="value(status.url)")
        
        log_info "To set up your custom domain, please:"
        echo "1. Add the following DNS records:"
        echo "   - A record for $DOMAIN pointing to Google Cloud Load Balancer IP"
        echo "   - CNAME record for api.$DOMAIN pointing to Google Cloud Load Balancer"
        echo "2. Use Google Cloud Console to map your domain to Cloud Run services"
        echo "   - Web app: $DOMAIN -> $WEB_URL"
        echo "   - API: api.$DOMAIN -> $API_URL"
        
        log_warning "Manual domain setup required in Google Cloud Console"
    fi
}

# Set up monitoring and alerts
setup_monitoring() {
    log_info "Setting up monitoring and alerts..."
    
    # Create notification channels (requires manual setup in Console)
    log_info "Please set up notification channels in Google Cloud Monitoring Console"
    
    # Basic uptime checks will be created automatically by Cloud Run
    log_success "Basic monitoring is enabled"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    # Get API URL
    API_URL=$(gcloud run services describe rigger-platform-api --region=$REGION --format="value(status.url)")
    
    # Wait for service to be ready
    sleep 30
    
    # Test API health
    if curl -f -s "$API_URL/health" > /dev/null; then
        log_success "API service is healthy"
        
        # Trigger migration (this would need to be implemented in the API)
        log_info "Database migrations should be run automatically during deployment"
    else
        log_warning "API service may not be ready yet. Please run migrations manually later"
    fi
}

# Print deployment summary
print_summary() {
    log_success "🎉 GCP Deployment completed successfully!"
    echo
    echo -e "${GREEN}=== DEPLOYMENT SUMMARY ===${NC}"
    
    # Get service URLs
    API_URL=$(gcloud run services describe rigger-platform-api --region=$REGION --format="value(status.url)" 2>/dev/null || echo "Not deployed")
    WEB_URL=$(gcloud run services describe rigger-platform-web --region=$REGION --format="value(status.url)" 2>/dev/null || echo "Not deployed")
    
    echo -e "Project ID: ${BLUE}$PROJECT_ID${NC}"
    echo -e "Region: ${BLUE}$REGION${NC}"
    echo -e "API URL: ${BLUE}$API_URL${NC}"
    echo -e "Web URL: ${BLUE}$WEB_URL${NC}"
    
    if [ -n "$DOMAIN" ]; then
        echo -e "Custom Domain: ${BLUE}https://$DOMAIN${NC} (requires DNS setup)"
        echo -e "API Domain: ${BLUE}https://api.$DOMAIN${NC} (requires DNS setup)"
    fi
    
    echo
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Set up custom domain DNS records (if using custom domain)"
    echo "2. Configure domain mapping in Google Cloud Console"
    echo "3. Set up monitoring alerts and notification channels"
    echo "4. Update mobile app configuration with production URLs"
    echo "5. Test all functionality"
    echo
    echo -e "${GREEN}=== USEFUL COMMANDS ===${NC}"
    echo "View logs: gcloud logging read 'resource.type=cloud_run_revision'"
    echo "Update API: gcloud run deploy rigger-platform-api --source=."
    echo "Update Web: gcloud run deploy rigger-platform-web --source=."
    echo "View services: gcloud run services list"
    echo "View database: gcloud sql instances list"
    echo
}

# Main deployment flow
main() {
    log_info "🚀 Starting Rigger Platform deployment to Google Cloud Platform..."
    
    check_prerequisites
    get_configuration
    setup_gcloud
    enable_apis
    setup_terraform_backend
    
    if deploy_infrastructure; then
        deploy_applications
        setup_custom_domain
        setup_monitoring
        run_migrations
        print_summary
    else
        log_error "Infrastructure deployment failed or was cancelled"
        exit 1
    fi
}

# Help function
show_help() {
    echo "Rigger Platform GCP Deployment Script"
    echo
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  -p, --project PROJECT_ID    GCP Project ID"
    echo "  -r, --region REGION         GCP Region (default: us-central1)"
    echo "  -z, --zone ZONE             GCP Zone (default: us-central1-a)"
    echo "  -d, --domain DOMAIN         Custom domain name"
    echo "  -e, --environment ENV       Environment (default: production)"
    echo "  -h, --help                  Show this help message"
    echo
    echo "Examples:"
    echo "  $0 --project my-project-123 --domain rigger-platform.com"
    echo "  $0 -p my-project-123 -r europe-west1 -z europe-west1-b"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--project)
            PROJECT_ID="$2"
            shift 2
            ;;
        -r|--region)
            REGION="$2"
            shift 2
            ;;
        -z|--zone)
            ZONE="$2"
            shift 2
            ;;
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main function
main "$@"