# Portfolio Content Management Guide

## 📝 How to Add/Edit Projects Without Coding

All your project content is managed through the **`projects.json`** file. Just edit this JSON file to add, update, or remove projects - no code changes needed!

---

## 🎯 Quick Start: Adding a New Project

1. Open `projects.json`
2. Copy the example project template below
3. Replace with your content
4. Save the file
5. Refresh your browser ✅

---

## 📋 Project Structure

```json
{
    "id": 1,
    "title": "Your Project Title",
    "year": 2024,
    "description": "Short one-line description",
    "timestamp": "Oct '24",
    "previewImage": "path/to/preview-image.jpg",
    "content": {
        "paragraphs": [
            "First paragraph...",
            "Second paragraph...",
            "Third paragraph..."
        ],
        "media": [
            {
                "type": "image",
                "src": "path/to/image.jpg",
                "caption": "Optional caption",
                "position": "after-paragraph-0"
            }
        ]
    }
}
```

---

## 🖼️ Media Types Supported

### 1. **Images** (JPG, PNG, WebP)
```json
{
    "type": "image",
    "src": "images/my-photo.jpg",
    "caption": "Image caption here",
    "position": "after-paragraph-0"
}
```

### 2. **Videos** (MP4, WebM)
```json
{
    "type": "video",
    "src": "videos/demo.mp4",
    "caption": "Video demonstration",
    "position": "after-paragraph-1"
}
```

### 3. **GIFs** (Animated)
```json
{
    "type": "gif",
    "src": "gifs/animation.gif",
    "caption": "Animated process",
    "position": "after-paragraph-2"
}
```

---

## 📍 Media Positioning

Control where media appears in your content:

| Position | Where It Appears |
|----------|-----------------|
| `"after-paragraph-0"` | After first paragraph |
| `"after-paragraph-1"` | After second paragraph |
| `"after-paragraph-2"` | After third paragraph |
| `"end"` | At the end of all text |

**Example:** Show image after first paragraph, then video after second:

```json
"media": [
    {
        "type": "image",
        "src": "concept.jpg",
        "caption": "Initial concept",
        "position": "after-paragraph-0"
    },
    {
        "type": "video",
        "src": "demo.mp4",
        "caption": "Working prototype",
        "position": "after-paragraph-1"
    }
]
```

---

## 🗂️ Organizing Your Files

### Recommended Folder Structure:

```
Web_Portfolio/
├── index.html
├── style.css
├── script.js
├── projects.json       ← Edit this file
└── assets/
    ├── images/
    │   ├── project1-preview.jpg
    │   ├── project1-detail1.jpg
    │   └── project1-detail2.jpg
    ├── videos/
    │   └── project1-demo.mp4
    └── gifs/
        └── project1-animation.gif
```

### File Paths in JSON:

```json
"previewImage": "assets/images/project1-preview.jpg",
"media": [
    {
        "src": "assets/images/project1-detail1.jpg"
    },
    {
        "src": "assets/videos/project1-demo.mp4"
    },
    {
        "src": "assets/gifs/project1-animation.gif"
    }
]
```

---

## ✏️ Full Example Project

```json
{
    "id": 1,
    "title": "Parametric Pavilion Design",
    "year": 2024,
    "description": "Computational design exploration using Grasshopper",
    "timestamp": "Oct '24",
    "previewImage": "assets/images/pavilion-preview.jpg",
    "content": {
        "paragraphs": [
            "This project explores parametric design principles to create an adaptive pavilion structure. Using Grasshopper and Python, we developed algorithms that respond to environmental conditions.",
            "The design process involved iterative simulations testing solar exposure, wind flow, and structural performance. Each iteration refined the geometry based on performance metrics.",
            "The final structure achieves 40% better thermal performance compared to conventional designs while maintaining aesthetic quality and constructability."
        ],
        "media": [
            {
                "type": "image",
                "src": "assets/images/pavilion-concept.jpg",
                "caption": "Early concept sketches and digital models",
                "position": "after-paragraph-0"
            },
            {
                "type": "gif",
                "src": "assets/gifs/pavilion-iterations.gif",
                "caption": "Algorithm generating design iterations",
                "position": "after-paragraph-1"
            },
            {
                "type": "video",
                "src": "assets/videos/pavilion-walkthrough.mp4",
                "caption": "Virtual walkthrough of the final design",
                "position": "after-paragraph-2"
            },
            {
                "type": "image",
                "src": "assets/images/pavilion-render.jpg",
                "caption": "Final rendering with context",
                "position": "end"
            }
        ]
    }
}
```

---

## 🎨 Using External Images (CDNs)

You can use images from URLs:

```json
"previewImage": "https://images.unsplash.com/photo-123456?w=800",
"media": [
    {
        "type": "image",
        "src": "https://your-website.com/images/photo.jpg"
    }
]
```

**Popular Image Hosts:**
- Unsplash: `https://images.unsplash.com/`
- Your own domain: `https://yourdomain.com/images/`
- Cloud storage: Google Drive (public), Dropbox, etc.

---

## ⚡ Tips for Best Performance

### Image Optimization:
- **Format**: Use WebP when possible (smaller file size)
- **Size**: Max width 1920px for desktop
- **Compression**: Use tools like TinyPNG or Squoosh
- **Preview images**: Keep under 200KB

### Video Optimization:
- **Format**: MP4 (H.264 codec)
- **Length**: Keep under 30 seconds for web
- **Resolution**: 1080p max
- **Size**: Compress to under 5MB if possible

### GIFs:
- **Size**: Keep under 2MB
- **Dimensions**: Max 800px wide
- **Alternative**: Consider using video instead (smaller file size)

---

## 🔄 Adding Multiple Projects

Simply add more project objects to the array in `projects.json`:

```json
[
    {
        "id": 1,
        "title": "Project One",
        ...
    },
    {
        "id": 2,
        "title": "Project Two",
        ...
    },
    {
        "id": 3,
        "title": "Project Three",
        ...
    }
]
```

**Important:** 
- Each project must have a unique `id`
- Don't forget commas between projects
- Last project should NOT have a trailing comma

---

## 🐛 Troubleshooting

### Projects not showing?
1. Check JSON syntax with [JSONLint](https://jsonlint.com/)
2. Make sure file is saved as `projects.json`
3. Check browser console for errors (F12)

### Images not loading?
1. Verify file paths are correct
2. Check file names match exactly (case-sensitive)
3. Ensure images are in the right folder

### Page is blank?
1. Open browser console (F12)
2. Look for error messages
3. Verify JSON file is valid

---

## 📱 Content Will Be Responsive

Your content automatically adapts to different screen sizes:
- **Desktop**: Full-width images and videos
- **Tablet**: Optimized spacing
- **Mobile**: Stacked layout, adjusted font sizes

No additional work needed! ✨

---

## 🚀 Quick Checklist

Before publishing your project:
- [ ] All images optimized and compressed
- [ ] Videos under 5MB
- [ ] All file paths correct
- [ ] JSON file validates
- [ ] Tested on mobile and desktop
- [ ] Captions added where helpful
- [ ] Preview image looks good

---

## 💡 Pro Tips

1. **Consistent Naming**: Use lowercase, hyphens (e.g., `my-project-1.jpg`)
2. **Backup**: Keep a copy of `projects.json` before major changes
3. **Version Control**: Use Git to track changes
4. **Test Locally**: Always preview before deploying
5. **Alt Text**: Captions help with accessibility

---

**Need help?** All changes are just in `projects.json` - no coding required! 🎉

