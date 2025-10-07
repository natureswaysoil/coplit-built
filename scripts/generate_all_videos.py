#!/usr/bin/env python3
"""
Generate all product videos and hero video
"""
import json
import sys
import os
sys.path.insert(0, '/home/ubuntu/github_repos/natureswaysoil/scripts')

from openai_helper import generate_script
from pictory_helper import create_video_from_script

def load_products():
    """Load products from data file"""
    with open('/home/ubuntu/github_repos/natureswaysoil/data/products.json', 'r') as f:
        return json.load(f)

def generate_product_script(product):
    """Generate educational video script for a product"""
    prompt = f"""Create a compelling 45-second product video script for this organic fertilizer:

Product: {product['title']}
Full Title: {product['full_title']}
Description: {product['description']}
Features: {', '.join(product.get('features', []))}
Price: ${product['price']}

Requirements:
1. Start with the problem this product solves
2. Explain the science behind how it works (organic, soil health focus)
3. Highlight key benefits and features
4. Include application tips
5. End with a call to action
6. Use conversational, educational tone
7. Include visual cues for Getty images
8. Keep it under 45 seconds when read aloud

Format as a video script with scene descriptions."""
    
    return generate_script(prompt, max_tokens=1500)

def main():
    products = load_products()
    video_mapping = {}
    
    print("Starting video generation process...", file=sys.stderr)
    print(f"Total products to process: {len(products)}", file=sys.stderr)
    
    # Generate hero video first
    print("\n=== GENERATING HERO VIDEO ===", file=sys.stderr)
    hero_script_path = '/home/ubuntu/github_repos/natureswaysoil/scripts/hero_video_script.txt'
    
    if os.path.exists(hero_script_path):
        with open(hero_script_path, 'r') as f:
            hero_script = f.read()
        
        print("Creating hero video with Pictory API...", file=sys.stderr)
        hero_video_url = create_video_from_script(hero_script, "Soil Symbiosis Hero Video", use_getty=True)
        
        if hero_video_url:
            video_mapping['hero'] = hero_video_url
            print(f"✓ Hero video created: {hero_video_url}", file=sys.stderr)
        else:
            print("✗ Hero video creation failed", file=sys.stderr)
    
    # Generate product videos (limit to first 5 for now to avoid API limits)
    print("\n=== GENERATING PRODUCT VIDEOS ===", file=sys.stderr)
    for i, product in enumerate(products[:5]):
        print(f"\nProcessing product {i+1}/5: {product['title']}", file=sys.stderr)
        
        # Generate script
        print(f"  Generating script...", file=sys.stderr)
        script = generate_product_script(product)
        
        if not script:
            print(f"  ✗ Script generation failed", file=sys.stderr)
            continue
        
        # Save script
        script_path = f"/home/ubuntu/github_repos/natureswaysoil/scripts/product_script_{product['asin']}.txt"
        with open(script_path, 'w') as f:
            f.write(script)
        print(f"  ✓ Script saved to {script_path}", file=sys.stderr)
        
        # Create video
        print(f"  Creating video with Pictory API...", file=sys.stderr)
        video_url = create_video_from_script(script, f"{product['title']} Product Video", use_getty=True)
        
        if video_url:
            video_mapping[product['asin']] = video_url
            print(f"  ✓ Video created: {video_url}", file=sys.stderr)
        else:
            print(f"  ✗ Video creation failed", file=sys.stderr)
    
    # Save video mapping
    output_path = '/home/ubuntu/github_repos/natureswaysoil/config/video_urls.json'
    with open(output_path, 'w') as f:
        json.dump(video_mapping, f, indent=2)
    
    print(f"\n=== VIDEO GENERATION COMPLETE ===", file=sys.stderr)
    print(f"Video mapping saved to: {output_path}", file=sys.stderr)
    print(f"Total videos created: {len(video_mapping)}", file=sys.stderr)
    
    # Output the mapping for use in next steps
    print(json.dumps(video_mapping, indent=2))

if __name__ == "__main__":
    main()
