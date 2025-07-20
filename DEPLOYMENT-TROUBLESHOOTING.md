# Rigger Platform - GCP Deployment Troubleshooting Guide

## Current Status ✅

### ✅ Successfully Completed:
- **Prerequisites verified**: gcloud SDK, Docker, Terraform installed
- **GCP project configured**: `tiation-enterprise` 
- **Authentication set up**: Service account authenticated
- **APIs enabled**: Most required APIs activated (Cloud Run, Storage, Build, etc.)
- **Basic infrastructure ready**: Terraform configurations prepared

### ⚠️ Current Challenges:

1. **Cloud Build Permission Issues**: 
   - Build service account lacks Container Registry push permissions
   - SQL API still has permission restrictions

2. **Buildpack Failures**: 
   - Cloud Run buildpack deployments failing consistently
   - May be related to project-level settings

## Alternative Deployment Methods

### Method 1: Google Cloud Console Deployment (Recommended)

1. **Enable Cloud SQL API manually**:
   - Go to [Google Cloud Console > APIs & Services](https://console.cloud.google.com/apis/library)
   - Search for "Cloud SQL Admin API"
   - Click "Enable"

2. **Deploy via Cloud Run Console**:
   - Navigate to [Cloud Run Console](https://console.cloud.google.com/run)
   - Click "Create Service"
   - Choose "Deploy one revision from an existing container image"
   - Use: `gcr.io/cloudrun/hello` (test) or build locally and push

3. **Upload source code**:
   - Use Cloud Shell to upload and build the application
   - Run deployment commands from Cloud Shell environment

### Method 2: Local Docker Build + Push

```bash
# Authenticate Docker with Container Registry
gcloud auth configure-docker

# Build locally
docker build -t gcr.io/tiation-enterprise/rigger-platform-api:latest ./simple-api

# Push to registry
docker push gcr.io/tiation-enterprise/rigger-platform-api:latest

# Deploy to Cloud Run
gcloud run deploy rigger-platform-api \
  --image gcr.io/tiation-enterprise/rigger-platform-api:latest \
  --region us-central1 \
  --allow-unauthenticated \
  --project tiation-enterprise
```

### Method 3: Cloud Shell Deployment

1. Open [Cloud Shell](https://shell.cloud.google.com)
2. Clone the repository:
   ```bash
   git clone https://github.com/tiaastor/tiation-rigger-platform.git
   cd tiation-rigger-platform
   ```
3. Run deployment from Cloud Shell (has better permissions)

## Infrastructure Setup

### Basic Cloud Run Services (No Database)

The following services can be deployed immediately:

```bash
# API Service
gcloud run deploy rigger-platform-api \
  --source ./simple-api \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10

# Web Service (when ready)
gcloud run deploy rigger-platform-web \
  --source ./apps/web \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 5
```

### Terraform Infrastructure (After SQL API enabled)

1. Enable Cloud SQL API in Console
2. Run Terraform deployment:
   ```bash
   cd infrastructure/gcp/terraform
   terraform init
   terraform plan
   terraform apply
   ```

## Next Steps Priority

1. **🔥 High Priority**: Enable Cloud SQL API in Google Cloud Console
2. **🔥 High Priority**: Try Cloud Shell deployment 
3. **📖 Medium**: Set up custom domain mapping
4. **🧪 Medium**: Deploy web application
5. **📊 Low**: Set up monitoring and alerts

## Service Account Permissions Issue

The build failures suggest the Cloud Build service account needs additional permissions:

```bash
# Grant Container Registry permissions to Cloud Build service account
gcloud projects add-iam-policy-binding tiation-enterprise \
  --member="serviceAccount:601212518400-compute@developer.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding tiation-enterprise \
  --member="serviceAccount:601212518400-compute@developer.gserviceaccount.com" \
  --role="roles/logging.logWriter"
```

## Application URLs (Once Deployed)

- **Test Service**: https://hello-world-601212518400.us-central1.run.app
- **API Service**: Will be `https://rigger-platform-api-[hash].us-central1.run.app`
- **Web Service**: Will be `https://rigger-platform-web-[hash].us-central1.run.app`

## Working Files Ready for Deployment

### Simple API Application
- `simple-api/package.json` - Working Node.js API
- `simple-api/index.js` - Express server with workforce endpoints
- `simple-api/Dockerfile` - Container configuration

### Infrastructure
- `infrastructure/gcp/terraform/main.tf` - Complete GCP infrastructure
- `cloudbuild-simple.yaml` - Build configuration
- `.env.gcp` - Environment variables template

The platform is **ready for deployment** - we just need to work around the CLI build permission issues using one of the alternative methods above.