#!/bin/bash
# Simple GCP deployment without SQL dependencies

set -e
PROJECT_ID="tiation-enterprise"
REGION="us-central1"

echo "🚀 Starting simple GCP deployment..."

# Build and push API image
echo "📦 Building API image..."
docker build -t gcr.io/$PROJECT_ID/rigger-platform-api:latest -f apps/api/Dockerfile.gcp .
docker push gcr.io/$PROJECT_ID/rigger-platform-api:latest

# Build and push Web image  
echo "📦 Building Web image..."
docker build -t gcr.io/$PROJECT_ID/rigger-platform-web:latest -f apps/web/Dockerfile.gcp .
docker push gcr.io/$PROJECT_ID/rigger-platform-web:latest

# Deploy API to Cloud Run
echo "🚀 Deploying API..."
gcloud run deploy rigger-platform-api \
  --image gcr.io/$PROJECT_ID/rigger-platform-api:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 1 \
  --port 3001 \
  --set-env-vars NODE_ENV=production

# Deploy Web to Cloud Run
echo "🚀 Deploying Web..."
gcloud run deploy rigger-platform-web \
  --image gcr.io/$PROJECT_ID/rigger-platform-web:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 5 \
  --min-instances 0 \
  --port 3000

echo "✅ Deployment completed!"

# Get service URLs
API_URL=$(gcloud run services describe rigger-platform-api --region=$REGION --format='value(status.url)')
WEB_URL=$(gcloud run services describe rigger-platform-web --region=$REGION --format='value(status.url)')

echo "🌐 Service URLs:"
echo "  API: $API_URL"
echo "  Web: $WEB_URL"