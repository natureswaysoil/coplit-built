#!/usr/bin/env python3
"""
Pictory Helper - Create videos using Pictory API with Getty images
"""
import os
import json
import sys
import time
import requests

# Load API credentials from auth secrets
AUTH_SECRETS_PATH = "/home/ubuntu/.config/abacusai_auth_secrets.json"
with open(AUTH_SECRETS_PATH, 'r') as f:
    secrets = json.load(f)
    pictory_secrets = secrets['pictory']['secrets']
    API_KEY = pictory_secrets['api_key']['value']
    CLIENT_ID = pictory_secrets['client_id']['value']
    CLIENT_SECRET = pictory_secrets['client_secret']['value']

BASE_URL = "https://api.pictory.ai/pictoryapis/v1"

def get_access_token():
    """Get OAuth access token"""
    url = "https://api.pictory.ai/pictoryapis/v1/oauth2/token"
    headers = {"Content-Type": "application/json"}
    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json().get('access_token')
    except Exception as e:
        print(f"Error getting access token: {e}", file=sys.stderr)
        return None

def create_video_from_script(script_text, video_name, use_getty=True):
    """Create video from script using Pictory API - returns job_id for async processing"""
    access_token = get_access_token()
    if not access_token:
        return None
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "X-Pictory-User-Id": CLIENT_ID
    }
    
    # Step 1: Create storyboard from script
    storyboard_url = f"{BASE_URL}/video/storyboard"
    storyboard_payload = {
        "videoName": video_name,
        "language": "en",
        "scenes": []
    }
    
    # Split script into scenes (by paragraphs or sentences)
    paragraphs = [p.strip() for p in script_text.split('\n\n') if p.strip()]
    
    for i, paragraph in enumerate(paragraphs[:10]):  # Limit to 10 scenes
        scene = {
            "text": paragraph[:500],  # Limit text length
            "voiceOver": True,
            "splitTextOnNewLine": False,
            "splitTextOnPeriod": True
        }
        
        if use_getty:
            scene["imageVideoSearchKeyword"] = extract_keywords(paragraph)
            scene["imageVideoSource"] = "getty"
        
        storyboard_payload["scenes"].append(scene)
    
    try:
        # Create storyboard
        print(f"Creating storyboard for {video_name}...", file=sys.stderr)
        response = requests.post(storyboard_url, json=storyboard_payload, headers=headers)
        response.raise_for_status()
        job_data = response.json()
        job_id = job_data.get('jobId')
        
        if not job_id:
            print(f"No job ID returned: {job_data}", file=sys.stderr)
            return None
        
        print(f"Storyboard job created: {job_id}", file=sys.stderr)
        return job_id
        
    except Exception as e:
        print(f"Error creating video: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return None

def check_job_status(job_id):
    """Check status of a Pictory job"""
    access_token = get_access_token()
    if not access_token:
        return None
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "X-Pictory-User-Id": CLIENT_ID
    }
    
    try:
        status_url = f"{BASE_URL}/jobs/{job_id}"
        response = requests.get(status_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if not data.get('success'):
            return {'status': 'failed', 'error': data.get('data', {}).get('error_message', 'Unknown error')}
        
        job_data = data.get('data', {})
        
        # For render jobs, check the status field
        if 'status' in job_data:
            status = job_data['status']
            if status == 'completed':
                return {
                    'status': 'completed',
                    'videoUrl': job_data.get('videoURL') or job_data.get('shareVideoURL'),
                    'data': job_data
                }
            elif status == 'failed':
                return {'status': 'failed', 'error': job_data.get('error_message', 'Render failed')}
            else:
                return {'status': status}  # in-progress, etc.
        
        # For storyboard jobs, check if renderParams exists
        elif 'renderParams' in job_data:
            return {'status': 'completed', 'data': job_data}
        else:
            # Job is still processing
            return {'status': 'processing'}
        
    except Exception as e:
        print(f"Error checking job status: {e}", file=sys.stderr)
        return None

def render_video(storyboard_job_id):
    """Render video from completed storyboard"""
    access_token = get_access_token()
    if not access_token:
        return None
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "X-Pictory-User-Id": CLIENT_ID
    }
    
    try:
        render_url = f"{BASE_URL}/video/render/{storyboard_job_id}"
        response = requests.put(render_url, headers=headers)
        response.raise_for_status()
        job_data = response.json()
        
        # The API returns job_id in data.job_id
        render_job_id = job_data.get('data', {}).get('job_id') or job_data.get('jobId')
        
        if not render_job_id:
            print(f"No render job ID returned: {job_data}", file=sys.stderr)
            return None
        
        print(f"Render job created: {render_job_id}", file=sys.stderr)
        return render_job_id
        
    except Exception as e:
        print(f"Error rendering video: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return None

def extract_keywords(text):
    """Extract relevant keywords for image search"""
    # Simple keyword extraction - take first few meaningful words
    words = text.split()[:5]
    return " ".join(words)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python pictory_helper.py <script_file> <video_name>")
        sys.exit(1)
    
    script_file = sys.argv[1]
    video_name = sys.argv[2]
    
    with open(script_file, 'r') as f:
        script_text = f.read()
    
    video_url = create_video_from_script(script_text, video_name)
    if video_url:
        print(video_url)
    else:
        sys.exit(1)
