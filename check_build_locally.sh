#!/bin/bash
cd /home/ubuntu/coplit-built
echo "Testing local build to identify issues..."
echo "================================"
npm install 2>&1 | tail -20
echo ""
echo "================================"
echo "Attempting build..."
npm run build 2>&1 | tail -50
