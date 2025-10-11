#!/usr/bin/env python3
"""
Update website components with generated video URLs
"""
import json
import re

def update_hero_section():
    """Update hero section with hero video URL"""
    video_urls_path = '/home/ubuntu/github_repos/natureswaysoil/config/video_urls.json'
    hero_path = '/home/ubuntu/github_repos/natureswaysoil/components/HeroVideoSection.tsx'
    
    with open(video_urls_path, 'r') as f:
        video_urls = json.load(f)
    
    hero_video_url = video_urls.get('hero')
    if not hero_video_url:
        print("No hero video URL found")
        return False
    
    with open(hero_path, 'r') as f:
        content = f.read()
    
    # Replace the default video URL
    # Look for: videoUrl = '/videos/hero-video.mp4'
    pattern = r"videoUrl = '[^']*'"
    replacement = f"videoUrl = '{hero_video_url}'"
    
    if pattern in content or "videoUrl = " in content:
        content = re.sub(pattern, replacement, content)
    else:
        print("Warning: Could not find videoUrl pattern in HeroVideoSection.tsx")
        return False
    
    with open(hero_path, 'w') as f:
        f.write(content)
    
    print(f"✓ Updated hero section with video: {hero_video_url}")
    return True

def update_product_pages():
    """Update product pages with product video URLs"""
    video_urls_path = '/home/ubuntu/github_repos/natureswaysoil/config/video_urls.json'
    products_path = '/home/ubuntu/github_repos/natureswaysoil/data/products.json'
    
    with open(video_urls_path, 'r') as f:
        video_urls = json.load(f)
    
    with open(products_path, 'r') as f:
        products = json.load(f)
    
    updated_count = 0
    for product in products:
        asin = product['asin']
        if asin in video_urls:
            product['video_url'] = video_urls[asin]
            updated_count += 1
            print(f"✓ Updated product {product['title']} with video URL")
    
    with open(products_path, 'w') as f:
        json.dump(products, f, indent=2)
    
    print(f"\n✓ Updated {updated_count} products with video URLs")
    return updated_count > 0

def create_video_config():
    """Create a video configuration file for easy reference"""
    video_urls_path = '/home/ubuntu/github_repos/natureswaysoil/config/video_urls.json'
    config_path = '/home/ubuntu/github_repos/natureswaysoil/config/video_config.ts'
    
    with open(video_urls_path, 'r') as f:
        video_urls = json.load(f)
    
    config_content = f"""// Auto-generated video configuration
// Generated from Pictory API video generation

export const videoConfig = {{
  hero: {{
    url: "{video_urls.get('hero', '')}",
    title: "Soil Symbiosis and Organic Farming"
  }},
  products: {{
"""
    
    for asin, url in video_urls.items():
        if asin != 'hero':
            config_content += f'    "{asin}": "{url}",\n'
    
    config_content += """  }
};

export default videoConfig;
"""
    
    with open(config_path, 'w') as f:
        f.write(config_content)
    
    print(f"✓ Created video configuration file: {config_path}")
    return True

def main():
    print("=== UPDATING WEBSITE WITH VIDEO URLS ===\n")
    
    success = True
    
    # Update hero section
    if not update_hero_section():
        print("⚠ Failed to update hero section")
        success = False
    
    print()
    
    # Update product pages
    if not update_product_pages():
        print("⚠ Failed to update product pages")
        success = False
    
    print()
    
    # Create video config
    if not create_video_config():
        print("⚠ Failed to create video config")
        success = False
    
    if success:
        print("\n✅ Website successfully updated with all video URLs!")
    else:
        print("\n⚠ Some updates failed. Please check the logs.")
    
    return success

if __name__ == "__main__":
    import sys
    sys.exit(0 if main() else 1)
