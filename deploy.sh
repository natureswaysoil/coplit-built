#!/bin/bash

echo "🚀 Deploying Nature's Way Soil to Google Cloud Run..."

# Configuration
PROJECT_ID="natureswaysoil"
SERVICE_NAME="natureswaysoil-app"
REGION="us-central1"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}📦 Setting up project...${NC}"
gcloud config set project $PROJECT_ID

echo "${BLUE}🔨 Building and deploying to Cloud Run...${NC}"
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --platform managed \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --port 3000 \
  --timeout 300

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Deployment successful!${NC}"
    echo "${GREEN}🌐 Getting your app URL...${NC}"
    gcloud run services describe $SERVICE_NAME \
      --region $REGION \
      --format 'value(status.url)'
else
    echo "❌ Deployment failed"
    exit 1
fi
