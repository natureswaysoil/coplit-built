# Video Integration Guide for Nature's Way Soil Blog

## Overview

The blog now supports automatic video display for social media promotion across TikTok, Instagram, and YouTube. Videos are displayed prominently at the top of blog articles when configured.

## Video Fields in blog_articles.json

Each article in `public/blog_articles.json` now includes the following video-related fields:

```json
{
  "videos": {
    "tiktok": null,
    "instagram": null,
    "youtube": null
  },
  "videoDescription": null,
  "socialMediaPromoted": false
}
```

### Field Descriptions

- **videos.tiktok**: TikTok video URL or embed code
- **videos.instagram**: Instagram video URL or embed code  
- **videos.youtube**: YouTube video URL or embed code
- **videoDescription**: Optional description text displayed above the videos
- **socialMediaPromoted**: Boolean flag - set to `true` to display videos on the article page

## How to Add Videos to an Article

### Step 1: Get Your Video Embed Code or URL

#### YouTube
1. Go to your YouTube video
2. Click "Share" → "Embed"
3. Copy either:
   - The full embed code: `<iframe src="https://www.youtube.com/embed/VIDEO_ID"...></iframe>`
   - Or just the URL: `https://www.youtube.com/embed/VIDEO_ID`

**Example:**
```json
"youtube": "https://www.youtube.com/embed/dQw4w9WgXcQ"
```

#### TikTok
1. Go to your TikTok video
2. Click "Share" → "Embed"
3. Copy the embed code (includes `<blockquote>` tag)

**Example:**
```json
"tiktok": "<blockquote class=\"tiktok-embed\" cite=\"https://www.tiktok.com/@username/video/1234567890\" data-video-id=\"1234567890\"><section></section></blockquote><script async src=\"https://www.tiktok.com/embed.js\"></script>"
```

#### Instagram
1. Go to your Instagram video post
2. Click "..." → "Embed"
3. Copy the embed code (includes `<blockquote>` tag)

**Example:**
```json
"instagram": "<blockquote class=\"instagram-media\" data-instgrm-permalink=\"https://i.ytimg.com/vi/wk-ODKgFavM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB4x2ZMXAPZHLnxnfkIHrFywika6Q"><a href=\"https://i.ytimg.com/vi/bqIBZjHRBL4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAdjN0Nw7Umw_JNlY0p4f6RpOmGkw"></a></blockquote><script async src=\"//www.instagram.com/embed.js\"></script>"
```

### Step 2: Update the Article in blog_articles.json

Edit `public/blog_articles.json` and update the article:

```json
{
  "id": "article_20251001_123456",
  "slug": "pruning-techniques-healthier-plants",
  "title": "Pruning Techniques for Healthier Plants",
  "excerpt": "...",
  "content": "...",
  "publishDate": "2025-10-01T12:00:00.000Z",
  "category": "Plant Care",
  "featuredImage": "...",
  "author": "Nature's Way Team",
  "featuredPost": false,
  "videos": {
    "tiktok": "<blockquote class=\"tiktok-embed\"...></blockquote>",
    "instagram": "<blockquote class=\"instagram-media\"...></blockquote>",
    "youtube": "https://www.youtube.com/embed/VIDEO_ID"
  },
  "videoDescription": "Watch our expert demonstrate these pruning techniques in action! Available on YouTube, TikTok, and Instagram.",
  "socialMediaPromoted": true
}
```

### Step 3: Commit and Push Changes

```bash
cd /home/ubuntu/github_repos/coplit-built
git add public/blog_articles.json
git commit -m "Add video integration for [article name]"
git push origin main
```

The website will automatically rebuild and display the videos on the article page.

## Video Display Behavior

### When Videos Are Shown
Videos are displayed when:
- `socialMediaPromoted` is set to `true`
- At least one video URL/embed code is provided (tiktok, instagram, or youtube)

### Video Section Layout
- Videos appear at the top of the article, below the featured image and metadata
- Videos are displayed in a responsive grid layout
- Each platform has its own labeled container with platform icon
- On desktop: videos display side-by-side (up to 3 columns)
- On mobile: videos stack vertically

### Styling Features
- Gradient background with green border matching brand colors
- Platform-specific icons (YouTube, TikTok, Instagram)
- Hover effects on video containers
- Responsive 16:9 aspect ratio for all videos
- Smooth animations and transitions

## Example: Complete Article with Videos

```json
{
  "id": "article_20251001_pruning",
  "slug": "pruning-techniques-healthier-plants",
  "title": "Pruning Techniques for Healthier Plants",
  "excerpt": "Master the art of pruning to promote healthier growth and abundant harvests in your garden.",
  "content": "# Pruning Techniques for Healthier Plants\n\n...",
  "publishDate": "2025-10-01T12:00:00.000Z",
  "category": "Plant Care",
  "featuredImage": "//images.unsplash.com/photo-1...",
  "author": "Nature's Way Team",
  "featuredPost": false,
  "videos": {
    "tiktok": "<blockquote class=\"tiktok-embed\" cite=\"https://www.tiktok.com/@natureswaysoil/video/1234567890\" data-video-id=\"1234567890\"><section></section></blockquote><script async src=\"https://www.tiktok.com/embed.js\"></script>",
    "instagram": "<blockquote class=\"instagram-media\" data-instgrm-permalink=\"https://i.ytimg.com/vi/DoxmmipH6Rc/maxresdefault.jpg"><a href=\"https://i.ytimg.com/vi/PzQcyT7M0uo/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCHNW1PzwMinN5uRLiN01A0XF92-A"></a></blockquote><script async src=\"//www.instagram.com/embed.js\"></script>",
    "youtube": "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  "videoDescription": "Watch our gardening expert demonstrate proper pruning techniques for different types of plants. Follow along on your favorite platform!",
  "socialMediaPromoted": true
}
```

## Best Practices

### Video Content
1. **Keep videos short and engaging** (30-90 seconds ideal for TikTok/Instagram)
2. **Create platform-specific versions** optimized for each platform's audience
3. **Include captions** for accessibility and silent viewing
4. **Match video content to article topic** for consistency

### Video Description
1. **Be concise** - 1-2 sentences maximum
2. **Add value** - explain what viewers will learn
3. **Include call-to-action** - encourage engagement across platforms

### Technical Considerations
1. **Test embed codes** before committing to ensure they work
2. **Use HTTPS URLs** for security
3. **Keep embed codes up-to-date** if platforms change their format
4. **Monitor video availability** - remove broken videos promptly

## Troubleshooting

### Videos Not Displaying
- Check that `socialMediaPromoted` is set to `true`
- Verify at least one video URL/embed code is provided
- Ensure embed codes are properly escaped in JSON
- Check browser console for JavaScript errors

### Video Embed Issues
- **TikTok/Instagram**: Make sure to include the full embed code with `<script>` tag
- **YouTube**: Use the `/embed/` URL format, not the regular watch URL
- **Mixed Content**: Ensure all URLs use HTTPS (or protocol-relative `//`)

### Styling Issues
- Clear browser cache if styles don't update
- Check that the blog template file was properly updated
- Verify CSS is not being overridden by other styles

## Future Enhancements

Potential improvements for the video integration:

1. **Video thumbnails** - Display custom thumbnails before video loads
2. **Lazy loading** - Load videos only when scrolled into view
3. **Analytics tracking** - Track video views and engagement
4. **Playlist support** - Multiple videos per platform
5. **Auto-play options** - Configurable auto-play behavior
6. **Video transcripts** - Accessibility and SEO benefits

## Support

For questions or issues with video integration:
- Check this guide first
- Review the blog template code in `pages/blog/[slug].js`
- Test changes locally before pushing to production
- Contact the development team for technical support

---

**Last Updated:** October 1, 2025  
**Version:** 1.0
