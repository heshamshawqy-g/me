"""
Batch Media Optimizer - Process multiple files at once
"""

from PIL import Image
import os
import glob

# ============================================
# CONFIGURATION
# ============================================

# Input folder with your media
INPUT_FOLDER = "C:\Users\Hesham.Shawqy\OneDrive - Grimshaw Architects\HS\00_Profile\Work_Data\001_OXA BRIDGES\test"

# Output folder
OUTPUT_FOLDER = "C:\Users\Hesham.Shawqy\OneDrive - Grimshaw Architects\HS\00_Profile\Work_Data\001_OXA BRIDGES\test\resized"

# Settings
MAX_IMAGE_DIMENSION = 1500
MAX_GIF_SIZE_MB = 10
JPEG_QUALITY = 85

# ============================================
# FUNCTIONS
# ============================================

def optimize_image(input_path, output_folder):
    """Resize image to max 1500px"""
    
    img = Image.open(input_path)
    filename = os.path.basename(input_path)
    name, ext = os.path.splitext(filename)
    
    width, height = img.size
    max_dim = max(width, height)
    
    if max_dim > MAX_IMAGE_DIMENSION:
        scale = MAX_IMAGE_DIMENSION / max_dim
        new_width = int(width * scale)
        new_height = int(height * scale)
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    output_path = os.path.join(output_folder, filename)
    
    if ext.lower() in ['.jpg', '.jpeg']:
        img.save(output_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
    elif ext.lower() == '.png':
        img.save(output_path, 'PNG', optimize=True)
    else:
        img.save(output_path)
    
    file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"✓ {filename} → {file_size_mb:.2f}MB")


def optimize_gif(input_path, output_folder):
    """Compress GIF to under 10MB"""
    
    img = Image.open(input_path)
    filename = os.path.basename(input_path)
    
    original_size_mb = os.path.getsize(input_path) / (1024 * 1024)
    
    if original_size_mb <= MAX_GIF_SIZE_MB:
        output_path = os.path.join(output_folder, filename)
        img.save(output_path, save_all=True, optimize=True)
        print(f"✓ {filename} → {original_size_mb:.2f}MB (no resize needed)")
        return
    
    scale = (MAX_GIF_SIZE_MB / original_size_mb) ** 0.5
    
    frames = []
    try:
        while True:
            frame = img.copy()
            width, height = frame.size
            new_width = int(width * scale)
            new_height = int(height * scale)
            frame = frame.resize((new_width, new_height), Image.Resampling.LANCZOS)
            frames.append(frame)
            img.seek(img.tell() + 1)
    except EOFError:
        pass
    
    output_path = os.path.join(output_folder, filename)
    
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        optimize=True,
        duration=img.info.get('duration', 100),
        loop=img.info.get('loop', 0)
    )
    
    final_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"✓ {filename} → {final_size_mb:.2f}MB")


# ============================================
# BATCH PROCESS
# ============================================

if __name__ == "__main__":
    
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    
    print("=" * 60)
    print("Batch Media Optimizer - Images & GIFs Only")
    print("=" * 60)
    
    # Only process images and GIFs (NO videos)
    image_patterns = ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.bmp']
    gif_pattern = '*.gif'
    
    # Video extensions to explicitly skip
    video_extensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv']
    
    all_files = []
    for pattern in image_patterns:
        all_files.extend(glob.glob(os.path.join(INPUT_FOLDER, pattern)))
    
    gifs = glob.glob(os.path.join(INPUT_FOLDER, gif_pattern))
    
    # Check for video files and warn
    video_files = []
    for ext in video_extensions:
        video_files.extend(glob.glob(os.path.join(INPUT_FOLDER, f"*{ext}")))
    
    if video_files:
        print(f"\n⚠ Found {len(video_files)} video file(s) - SKIPPING")
        print("This script only processes images and GIFs, not videos.")
        for vf in video_files[:3]:  # Show first 3
            print(f"  - {os.path.basename(vf)}")
        if len(video_files) > 3:
            print(f"  ... and {len(video_files) - 3} more")
    
    # Process images
    if all_files:
        print(f"\nProcessing {len(all_files)} images...")
        for file_path in all_files:
            optimize_image(file_path, OUTPUT_FOLDER)
    
    # Process GIFs
    if gifs:
        print(f"\nProcessing {len(gifs)} GIFs...")
        for file_path in gifs:
            optimize_gif(file_path, OUTPUT_FOLDER)
    
    if not all_files and not gifs:
        print(f"\nNo images or GIFs found in '{INPUT_FOLDER}' folder")
        print("Supported: .jpg, .jpeg, .png, .webp, .gif")
        print("\nCreate the folder and add your images/gifs there")
    else:
        total = len(all_files) + len(gifs)
        print(f"\n✓ Done! Processed {total} files")
        print(f"Check '{OUTPUT_FOLDER}' folder")

