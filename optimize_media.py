"""
Simple Media Optimizer for Web Portfolio
- Resizes images to max 1500px on longest side
- Compresses GIFs to under 10MB
- Saves to 'optimized' folder
"""

from PIL import Image
import os

# ============================================
# CONFIGURATION - Edit these paths
# ============================================

# Hardcode your file path here
INPUT_FILE = "path/to/your/image.jpg"  # Change this to your file

# Output folder (will be created if doesn't exist)
OUTPUT_FOLDER = "optimized"

# ============================================
# SETTINGS
# ============================================

MAX_IMAGE_DIMENSION = 1500  # Max width or height for images
MAX_GIF_SIZE_MB = 10  # Maximum GIF size in MB
JPEG_QUALITY = 85  # JPEG quality (1-100, higher = better quality)

# ============================================
# SCRIPT
# ============================================

def optimize_image(input_path, output_folder):
    """Resize image to max 1500px on longest side"""
    
    # Create output folder
    os.makedirs(output_folder, exist_ok=True)
    
    # Open image
    img = Image.open(input_path)
    
    # Get filename
    filename = os.path.basename(input_path)
    name, ext = os.path.splitext(filename)
    
    # Calculate new size
    width, height = img.size
    max_dim = max(width, height)
    
    if max_dim > MAX_IMAGE_DIMENSION:
        scale = MAX_IMAGE_DIMENSION / max_dim
        new_width = int(width * scale)
        new_height = int(height * scale)
        
        print(f"Resizing from {width}x{height} to {new_width}x{new_height}")
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    else:
        print(f"Image already smaller than {MAX_IMAGE_DIMENSION}px")
    
    # Save
    output_path = os.path.join(output_folder, f"{name}_optimized{ext}")
    
    if ext.lower() in ['.jpg', '.jpeg']:
        img.save(output_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
    elif ext.lower() == '.png':
        img.save(output_path, 'PNG', optimize=True)
    else:
        img.save(output_path)
    
    file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Saved: {output_path}")
    print(f"Size: {file_size_mb:.2f}MB")


def optimize_gif(input_path, output_folder, target_size_mb=10):
    """Compress GIF to under target size"""
    
    # Create output folder
    os.makedirs(output_folder, exist_ok=True)
    
    # Open GIF
    img = Image.open(input_path)
    
    # Get filename
    filename = os.path.basename(input_path)
    name, ext = os.path.splitext(filename)
    
    # Get original size
    original_size_mb = os.path.getsize(input_path) / (1024 * 1024)
    print(f"Original GIF size: {original_size_mb:.2f}MB")
    
    if original_size_mb <= target_size_mb:
        print(f"GIF already under {target_size_mb}MB")
        output_path = os.path.join(output_folder, f"{name}_optimized{ext}")
        img.save(output_path, save_all=True, optimize=True)
        print(f"Saved: {output_path}")
        return
    
    # Calculate scale factor needed
    scale = (target_size_mb / original_size_mb) ** 0.5
    
    # Get all frames
    frames = []
    try:
        while True:
            frame = img.copy()
            
            # Resize frame
            width, height = frame.size
            new_width = int(width * scale)
            new_height = int(height * scale)
            frame = frame.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            frames.append(frame)
            img.seek(img.tell() + 1)
    except EOFError:
        pass
    
    # Save optimized GIF
    output_path = os.path.join(output_folder, f"{name}_optimized{ext}")
    
    print(f"Resizing GIF to approximately {new_width}x{new_height}")
    
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        optimize=True,
        duration=img.info.get('duration', 100),
        loop=img.info.get('loop', 0)
    )
    
    final_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Saved: {output_path}")
    print(f"Final size: {final_size_mb:.2f}MB")


# ============================================
# RUN
# ============================================

if __name__ == "__main__":
    
    print("=" * 50)
    print("Media Optimizer for Web Portfolio")
    print("=" * 50)
    
    # Check if file exists
    if not os.path.exists(INPUT_FILE):
        print(f"\nError: File not found: {INPUT_FILE}")
        exit(1)
    
    # Get file extension
    file_ext = os.path.splitext(INPUT_FILE)[1].lower()
    
    # Valid extensions (images and GIFs only, NO videos)
    valid_image_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp']
    valid_gif_extensions = ['.gif']
    
    # Skip video files
    video_extensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv']
    
    if file_ext in video_extensions:
        print(f"\n⚠ Skipping video file: {INPUT_FILE}")
        print("This script only processes images and GIFs, not videos.")
        exit(0)
    
    if file_ext == '.gif':
        print(f"\nProcessing GIF: {INPUT_FILE}")
        optimize_gif(INPUT_FILE, OUTPUT_FOLDER, MAX_GIF_SIZE_MB)
    elif file_ext in valid_image_extensions:
        print(f"\nProcessing Image: {INPUT_FILE}")
        optimize_image(INPUT_FILE, OUTPUT_FOLDER)
    else:
        print(f"\n⚠ Unsupported file type: {file_ext}")
        print(f"Supported: Images (.jpg, .png, .webp) and GIFs (.gif)")
        exit(1)
    
    print("\n✓ Done!")

