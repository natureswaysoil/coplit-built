#!/bin/bash
# Deployment Script for Homepage Improvements

echo "🚀 Deploying Homepage Improvements to GitHub..."
echo ""
echo "📋 Changes to deploy:"
echo "  ✨ Professional website redesign with light overlays"
echo "  📱 Improved readability and mobile responsiveness"  
echo "  🎨 Clean, modern design without dark backgrounds"
echo ""

# Show what will be pushed
echo "📦 Commits to push:"
git log origin/main..HEAD --oneline
echo ""

# Force push with lease (safer than force)
echo "⬆️  Pushing to GitHub..."
git push --force-with-lease origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🔄 Vercel will automatically deploy in 2-5 minutes"
    echo "📊 Check deployment status at: https://vercel.com/dashboard"
    echo ""
    echo "🌐 Your site will be live at your production URL"
else
    echo ""
    echo "❌ Push failed. Please check GitHub permissions."
    echo ""
    echo "Alternative: Use GitHub Web Interface"
    echo "1. Go to https://github.com/natureswaysoil/coplit-built"
    echo "2. Click 'Add file' → 'Upload files'"
    echo "3. Drag and drop: pages/index.tsx"
    echo "4. Commit directly to main"
    echo "5. Vercel will auto-deploy"
fi
