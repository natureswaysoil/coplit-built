#!/usr/bin/env python3
"""
Optimize product images - compress and resize for web
"""
import os
import sys
from PIL import Image
import json

def optimize_image(input_path, output_path, max_width=1200, quality=85):
    """Optimize a single image"""
    try:
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Resize if too large
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save optimized version
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            # Get file sizes
            original_size = os.path.getsize(input_path)
            optimized_size = os.path.getsize(output_path)
            reduction = ((original_size - optimized_size) / original_size) * 100
            
            return {
                'success': True,
                'original_size': original_size,
                'optimized_size': optimized_size,
                'reduction_percent': reduction
            }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def find_product_images():
    """Find all product images in the public directory"""
    image_extensions = ('.jpg', '.jpeg', '.png', '.webp')
    images = []
    
    public_dir = '/home/ubuntu/github_repos/natureswaysoil/public'
    
    for root, dirs, files in os.walk(public_dir):
        for file in files:
            if file.lower().endswith(image_extensions) and 'product' in file.lower():
                images.append(os.path.join(root, file))
    
    return images

def main():
    print("Finding product images...", file=sys.stderr)
    images = find_product_images()
    
    if not images:
        print("No product images found. Creating placeholder optimization.", file=sys.stderr)
        # Create a simple report
        report = {
            'total_images': 0,
            'optimized': 0,
            'failed': 0,
            'total_savings_bytes': 0,
            'note': 'No product images found in public directory. Images may need to be added or are stored elsewhere.'
        }
    else:
        print(f"Found {len(images)} product images", file=sys.stderr)
        
        optimized_dir = '/home/ubuntu/github_repos/natureswaysoil/public/optimized'
        os.makedirs(optimized_dir, exist_ok=True)
        
        results = []
        total_savings = 0
        
        for img_path in images:
            filename = os.path.basename(img_path)
            output_path = os.path.join(optimized_dir, filename.replace('.png', '.jpg'))
            
            print(f"Optimizing {filename}...", file=sys.stderr)
            result = optimize_image(img_path, output_path)
            
            if result['success']:
                total_savings += (result['original_size'] - result['optimized_size'])
                print(f"  ✓ Reduced by {result['reduction_percent']:.1f}%", file=sys.stderr)
            else:
                print(f"  ✗ Failed: {result['error']}", file=sys.stderr)
            
            results.append({
                'filename': filename,
                'result': result
            })
        
        report = {
            'total_images': len(images),
            'optimized': sum(1 for r in results if r['result']['success']),
            'failed': sum(1 for r in results if not r['result']['success']),
            'total_savings_bytes': total_savings,
            'total_savings_mb': round(total_savings / (1024 * 1024), 2),
            'results': results
        }
    
    # Save report
    report_path = '/home/ubuntu/github_repos/natureswaysoil/scripts/image_optimization_report.json'
    with open(report_path, 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\nOptimization complete!", file=sys.stderr)
    print(f"Report saved to: {report_path}", file=sys.stderr)
    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    main()
