#!/usr/bin/env python3
"""
Generate all videos asynchronously - submit jobs and poll for completion
"""
import json
import sys
import os
import time
sys.path.insert(0, '/home/ubuntu/github_repos/natureswaysoil/scripts')

from openai_helper import generate_script
from pictory_helper import create_video_from_script, check_job_status, render_video

def load_products():
    """Load products from data file"""
    with open('/home/ubuntu/github_repos/natureswaysoil/data/products.json', 'r') as f:
        return json.load(f)

def generate_product_script(product):
    """Generate educational video script for a product"""
    prompt = f"""Create a compelling 30-second product video script for this organic fertilizer:

Product: {product['title']}
Description: {product['description']}
Features: {', '.join(product.get('features', [])[:3])}

Requirements:
1. Start with the problem this product solves
2. Explain the key benefit (organic, soil health focus)
3. Highlight 1-2 main features
4. End with a call to action
5. Use conversational, educational tone
6. Keep it under 30 seconds when read aloud
7. Write in short, punchy paragraphs (2-3 sentences each)

Format as 3-4 short paragraphs."""
    
    return generate_script(prompt, max_tokens=800)

def main():
    products = load_products()
    jobs_file = '/home/ubuntu/github_repos/natureswaysoil/config/video_jobs.json'
    
    print("=== PHASE 1: SUBMITTING VIDEO JOBS ===", file=sys.stderr)
    
    jobs = {}
    
    # Generate hero video first
    print("\nSubmitting hero video job...", file=sys.stderr)
    hero_script_path = '/home/ubuntu/github_repos/natureswaysoil/scripts/hero_video_script.txt'
    
    if os.path.exists(hero_script_path):
        with open(hero_script_path, 'r') as f:
            hero_script = f.read()
        
        job_id = create_video_from_script(hero_script, "Soil Symbiosis Hero Video", use_getty=True)
        
        if job_id:
            jobs['hero'] = {
                'storyboard_job_id': job_id,
                'render_job_id': None,
                'video_url': None,
                'status': 'storyboard_pending',
                'name': 'Hero Video'
            }
            print(f"✓ Hero video job submitted: {job_id}", file=sys.stderr)
        else:
            print("✗ Hero video job submission failed", file=sys.stderr)
    
    # Generate product videos (limit to first 5 for now)
    print("\nSubmitting product video jobs...", file=sys.stderr)
    for i, product in enumerate(products[:5]):
        print(f"\nProduct {i+1}/5: {product['title']}", file=sys.stderr)
        
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
        print(f"  ✓ Script saved", file=sys.stderr)
        
        # Submit video job
        job_id = create_video_from_script(script, f"{product['title']} Product Video", use_getty=True)
        
        if job_id:
            jobs[product['asin']] = {
                'storyboard_job_id': job_id,
                'render_job_id': None,
                'video_url': None,
                'status': 'storyboard_pending',
                'name': product['title']
            }
            print(f"  ✓ Job submitted: {job_id}", file=sys.stderr)
        else:
            print(f"  ✗ Job submission failed", file=sys.stderr)
    
    # Save jobs file
    with open(jobs_file, 'w') as f:
        json.dump(jobs, f, indent=2)
    
    print(f"\n=== PHASE 2: POLLING FOR COMPLETION ===", file=sys.stderr)
    print(f"Total jobs submitted: {len(jobs)}", file=sys.stderr)
    
    # Poll for storyboard completion
    max_storyboard_attempts = 60  # 5 minutes
    storyboard_attempt = 0
    
    while storyboard_attempt < max_storyboard_attempts:
        storyboard_attempt += 1
        print(f"\n--- Storyboard Poll Attempt {storyboard_attempt} ---", file=sys.stderr)
        
        all_storyboards_done = True
        
        for key, job_info in jobs.items():
            if job_info['status'] == 'storyboard_pending':
                status_data = check_job_status(job_info['storyboard_job_id'])
                
                if status_data:
                    status = status_data.get('status')
                    print(f"{job_info['name']}: {status}", file=sys.stderr)
                    
                    if status == 'completed':
                        # Start render job
                        render_job_id = render_video(job_info['storyboard_job_id'])
                        if render_job_id:
                            job_info['render_job_id'] = render_job_id
                            job_info['status'] = 'render_pending'
                            print(f"  → Render job started: {render_job_id}", file=sys.stderr)
                        else:
                            job_info['status'] = 'failed'
                    elif status == 'failed':
                        job_info['status'] = 'failed'
                        print(f"  → Storyboard failed", file=sys.stderr)
                    else:
                        all_storyboards_done = False
        
        # Save progress
        with open(jobs_file, 'w') as f:
            json.dump(jobs, f, indent=2)
        
        if all_storyboards_done:
            print("\n✓ All storyboards completed!", file=sys.stderr)
            break
        
        time.sleep(5)
    
    # Poll for render completion
    max_render_attempts = 120  # 20 minutes
    render_attempt = 0
    
    while render_attempt < max_render_attempts:
        render_attempt += 1
        print(f"\n--- Render Poll Attempt {render_attempt} ---", file=sys.stderr)
        
        all_renders_done = True
        
        for key, job_info in jobs.items():
            if job_info['status'] == 'render_pending':
                status_data = check_job_status(job_info['render_job_id'])
                
                if status_data:
                    status = status_data.get('status')
                    print(f"{job_info['name']}: {status}", file=sys.stderr)
                    
                    if status == 'completed':
                        video_url = status_data.get('videoUrl') or status_data.get('data', {}).get('videoUrl')
                        if video_url:
                            job_info['video_url'] = video_url
                            job_info['status'] = 'completed'
                            print(f"  → Video URL: {video_url}", file=sys.stderr)
                        else:
                            job_info['status'] = 'failed'
                            print(f"  → No video URL found", file=sys.stderr)
                    elif status == 'failed':
                        job_info['status'] = 'failed'
                        print(f"  → Render failed", file=sys.stderr)
                    else:
                        all_renders_done = False
        
        # Save progress
        with open(jobs_file, 'w') as f:
            json.dump(jobs, f, indent=2)
        
        if all_renders_done:
            print("\n✓ All videos completed!", file=sys.stderr)
            break
        
        time.sleep(10)
    
    # Generate final video mapping
    video_mapping = {}
    for key, job_info in jobs.items():
        if job_info['status'] == 'completed' and job_info['video_url']:
            video_mapping[key] = job_info['video_url']
    
    output_path = '/home/ubuntu/github_repos/natureswaysoil/config/video_urls.json'
    with open(output_path, 'w') as f:
        json.dump(video_mapping, f, indent=2)
    
    print(f"\n=== VIDEO GENERATION COMPLETE ===", file=sys.stderr)
    print(f"Video mapping saved to: {output_path}", file=sys.stderr)
    print(f"Total videos created: {len(video_mapping)}/{len(jobs)}", file=sys.stderr)
    
    # Output the mapping
    print(json.dumps(video_mapping, indent=2))

if __name__ == "__main__":
    main()
