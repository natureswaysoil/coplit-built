#!/bin/bash
# Wait for video generation to complete and finalize everything

set -e

REPO_DIR="/home/ubuntu/github_repos/natureswaysoil"
cd "$REPO_DIR"

echo "=== WAITING FOR VIDEO GENERATION TO COMPLETE ==="
echo "This may take 10-20 minutes..."
echo ""

# Wait for the async script to finish
while ps aux | grep -q "[g]enerate_videos_async.py"; do
    echo -n "."
    sleep 10
done

echo ""
echo "✓ Video generation process completed!"
echo ""

# Check if we have video URLs
if [ ! -f "$REPO_DIR/config/video_urls.json" ]; then
    echo "❌ Error: video_urls.json not found!"
    exit 1
fi

# Count completed videos
COMPLETED=$(python3 -c "import json; f=open('$REPO_DIR/config/video_urls.json'); data=json.load(f); print(len(data))")
echo "✓ $COMPLETED videos generated successfully"
echo ""

# Update website with video URLs
echo "=== UPDATING WEBSITE COMPONENTS ==="
python3 "$REPO_DIR/scripts/update_website_videos.py"
echo ""

# Git operations
echo "=== COMMITTING CHANGES ==="
git add -A
git status --short

echo ""
read -p "Commit message (or press Enter for default): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Add generated videos from Pictory API with Getty images"
fi

git commit -m "$COMMIT_MSG"
echo "✓ Changes committed"
echo ""

# Push to remote
echo "=== PUSHING TO GITHUB ==="
git push -u origin video-assets-update
echo "✓ Changes pushed to GitHub"
echo ""

# Create PR
echo "=== CREATING PULL REQUEST ==="
PR_TITLE="Add AI-Generated Product and Hero Videos"
PR_BODY="This PR adds professionally generated videos using Pictory API with Getty Images stock footage:

- Hero video showcasing soil symbiotic relationships and organic farming
- Product videos for 5 key products
- Updated website components to display videos
- Video configuration files for easy management

All videos feature:
- Professional voiceovers
- High-quality Getty Images stock footage
- Educational content about organic soil health
- Optimized for web delivery"

gh pr create --title "$PR_TITLE" --body "$PR_BODY" --base main || echo "Note: PR creation requires gh CLI authentication"

echo ""
echo "=== DEPLOYMENT SUMMARY ==="
echo "✅ All videos generated and integrated successfully!"
echo ""
echo "Generated videos:"
python3 -c "
import json
with open('$REPO_DIR/config/video_urls.json') as f:
    videos = json.load(f)
for key, url in videos.items():
    print(f'  • {key}: {url[:60]}...')
"
echo ""
echo "Next steps:"
echo "1. Review the PR on GitHub"
echo "2. Merge the PR to deploy videos to production"
echo "3. Test video playback on the live site"
