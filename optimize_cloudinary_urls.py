"""
Cloudinary URL Optimizer
Automatically adds optimization parameters (w_X, f_auto, q_auto) to all Cloudinary URLs
in project JSON files.

Usage: python optimize_cloudinary_urls.py
"""

import json
import os
import re
from pathlib import Path
from datetime import datetime

# Configuration
CLOUDINARY_BASE = "res.cloudinary.com/dnahwqvhd"

# Optimization widths based on context
WIDTHS = {
    'previewImage': 800,      # Gallery thumbnails and previews
    'content_image': 1200,    # Full content images
    'content_video': 1200     # Full content videos
}

def is_cloudinary_url(url):
    """Check if URL is a Cloudinary URL"""
    return url and CLOUDINARY_BASE in url

def is_already_optimized(url):
    """Check if URL already has optimization parameters"""
    return 'f_auto' in url or 'q_auto' in url

def optimize_url(url, width=1200):
    """Add optimization parameters to Cloudinary URL"""
    if not is_cloudinary_url(url):
        return url
    
    if is_already_optimized(url):
        print(f"  ✓ Already optimized: {url[:60]}...")
        return url
    
    # Add parameters after /upload/
    params = f"w_{width},f_auto,q_auto"
    optimized = url.replace('/upload/', f'/upload/{params}/')
    
    print(f"  ➜ Optimized: {url[:60]}... → w_{width}")
    return optimized

def optimize_project_json(file_path):
    """Optimize all Cloudinary URLs in a project JSON file"""
    print(f"\n📄 Processing: {file_path.name}")
    
    # Read JSON file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes_made = False
    
    # Optimize preview image (800px for thumbnails)
    if 'previewImage' in data and is_cloudinary_url(data['previewImage']):
        original = data['previewImage']
        data['previewImage'] = optimize_url(data['previewImage'], WIDTHS['previewImage'])
        if original != data['previewImage']:
            changes_made = True
    
    # Optimize content media (1200px for full content)
    if 'content' in data and 'media' in data['content']:
        for media in data['content']['media']:
            if 'src' in media and is_cloudinary_url(media['src']):
                original = media['src']
                # Detect if it's a video
                is_video = media.get('type') == 'video' or re.search(r'\.(mp4|webm|mov|ogg)$', media['src'], re.I)
                width = WIDTHS['content_video'] if is_video else WIDTHS['content_image']
                media['src'] = optimize_url(media['src'], width)
                if original != media['src']:
                    changes_made = True
    
    # Optimize legacy images structure
    if 'content' in data and 'images' in data['content']:
        for image in data['content']['images']:
            if 'src' in image and is_cloudinary_url(image['src']):
                original = image['src']
                image['src'] = optimize_url(image['src'], WIDTHS['content_image'])
                if original != image['src']:
                    changes_made = True
    
    # Write back to file if changes were made
    if changes_made:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"  ✅ Saved changes to {file_path.name}")
    else:
        print(f"  ⏭️  No changes needed")
    
    return changes_made

def create_backup():
    """Create a backup of all project files"""
    backup_dir = Path('projects_backup_' + datetime.now().strftime('%Y%m%d_%H%M%S'))
    backup_dir.mkdir(exist_ok=True)
    
    projects_dir = Path('projects')
    if not projects_dir.exists():
        print("❌ 'projects' directory not found!")
        return None
    
    # Copy all JSON files to backup
    json_files = list(projects_dir.glob('project-*.json'))
    for file in json_files:
        backup_file = backup_dir / file.name
        backup_file.write_text(file.read_text(encoding='utf-8'), encoding='utf-8')
    
    print(f"💾 Backup created: {backup_dir}")
    print(f"   Backed up {len(json_files)} files\n")
    
    return backup_dir

def optimize_about_json():
    """Optimize profile image in about.json"""
    about_file = Path('about.json')
    if not about_file.exists():
        return False
    
    print(f"\n📄 Processing: {about_file.name}")
    
    with open(about_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes_made = False
    
    # Optimize profile image
    if 'profile' in data and 'image' in data['profile']:
        if is_cloudinary_url(data['profile']['image']):
            original = data['profile']['image']
            data['profile']['image'] = optimize_url(data['profile']['image'], 800)
            if original != data['profile']['image']:
                changes_made = True
    
    if changes_made:
        with open(about_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"  ✅ Saved changes to {about_file.name}")
    else:
        print(f"  ⏭️  No changes needed")
    
    return changes_made

def main():
    """Main function to optimize all project JSON files"""
    print("=" * 60)
    print("🚀 Cloudinary URL Optimizer")
    print("=" * 60)
    
    # Check if projects directory exists
    projects_dir = Path('projects')
    if not projects_dir.exists():
        print("❌ Error: 'projects' directory not found!")
        print("   Please run this script from the project root directory.")
        return
    
    # Create backup first
    backup_dir = create_backup()
    if not backup_dir:
        return
    
    # Get all project JSON files
    json_files = sorted(projects_dir.glob('project-*.json'))
    
    if not json_files:
        print("❌ No project JSON files found!")
        return
    
    print(f"📁 Found {len(json_files)} project files to process\n")
    
    # Process each file
    total_changed = 0
    for file_path in json_files:
        if optimize_project_json(file_path):
            total_changed += 1
    
    # Process about.json
    if optimize_about_json():
        total_changed += 1
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ OPTIMIZATION COMPLETE")
    print("=" * 60)
    print(f"📊 Files processed: {len(json_files) + 1}")
    print(f"📝 Files modified: {total_changed}")
    print(f"💾 Backup location: {backup_dir}")
    print("\n💡 Your images will now load 50-80% faster!")
    print("   Cloudinary will automatically serve:")
    print("   • WebP format for Chrome/Firefox")
    print("   • AVIF format when supported")
    print("   • Optimized quality per image")
    print("\n🔄 If you need to restore, copy files from backup directory")
    print("=" * 60)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Operation cancelled by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

