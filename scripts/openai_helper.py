#!/usr/bin/env python3
"""
OpenAI Helper - Generate scripts and content using OpenAI API
"""
import os
import json
import sys
from openai import OpenAI

# Load API key from auth secrets
AUTH_SECRETS_PATH = "/home/ubuntu/.config/abacusai_auth_secrets.json"
with open(AUTH_SECRETS_PATH, 'r') as f:
    secrets = json.load(f)
    api_key = secrets['openai']['secrets']['api_key']['value']

client = OpenAI(api_key=api_key)

def generate_script(prompt, max_tokens=2000, temperature=0.7):
    """Generate content using OpenAI API"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert science communicator and video scriptwriter specializing in soil science, agriculture, and environmental education. Create engaging, accurate, and educational content."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,
            temperature=temperature
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating script: {e}", file=sys.stderr)
        return None

def generate_chat_response(message, context="", max_tokens=500):
    """Generate intelligent chat responses"""
    try:
        system_prompt = """You are a knowledgeable and friendly customer service representative for Nature's Way Soil, 
        an organic fertilizer company. You help customers understand:
        - The benefits of organic fertilizers vs synthetic ones
        - How soil microbiomes and mycorrhizal fungi work
        - Product recommendations based on their needs
        - Application instructions and best practices
        
        Be helpful, educational, and guide customers toward making informed decisions. 
        Always emphasize the science-backed benefits of organic soil health."""
        
        messages = [{"role": "system", "content": system_prompt}]
        
        if context:
            messages.append({"role": "assistant", "content": f"Context: {context}"})
        
        messages.append({"role": "user", "content": message})
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=max_tokens,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating chat response: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python openai_helper.py <prompt>")
        sys.exit(1)
    
    prompt = " ".join(sys.argv[1:])
    result = generate_script(prompt)
    if result:
        print(result)
    else:
        sys.exit(1)
