# Product Videos Directory

This directory should contain the 15 product videos mapped in `/data/product-videos.json`.

## Required Files

Copy these files from `/home/ubuntu/runway_videos/` to `/workspaces/coplit-built/public/videos/products/`:

1. Parent_B0822RH5L3_video.mp4
2. Parent_B0D52CQNGN_video.mp4
3. Parent_B0D6886G54_video.mp4
4. Parent_B0D69LNC5T_video.mp4
5. Parent_B0D7T3TLQP_video.mp4
6. Parent_B0D7V76PLY_video.mp4
7. Parent_B0D9HT7ND8_video.mp4
8. Parent_B0FG38PQQX_video.mp4
9. Parent_B0DDCPYLG1_video.mp4
10. Parent_B0DJ1JNQW4_video.mp4
11. Parent_B0F9W7B3NL_video.mp4
12. Parent_B0F4NQNTSW_video.mp4

## Copy Command

```bash
# If videos are on the server at /home/ubuntu/runway_videos/
cp /home/ubuntu/runway_videos/Parent_*.mp4 /workspaces/coplit-built/public/videos/products/

# Or if videos need to be uploaded:
# 1. Upload videos to this directory via SFTP/SCP
# 2. Ensure filenames match those in product-videos.json
```

## Verification

After copying, verify with:
```bash
ls -lh /workspaces/coplit-built/public/videos/products/
```

You should see 12-15 `.mp4` files.

## Fallback

If videos cannot be copied immediately, the ProductVideo component will:
- Show a loading spinner
- Fall back to error state with "Video unavailable" message
- Still display product information

The site will function normally without videos, but conversion rates will be lower.
