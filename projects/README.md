# Projects Directory

This directory contains all project data files for the portfolio.

## File Structure

```
projects/
├── index.json              # Main index with all project summaries
├── project-1.json          # Full content for project 1
├── project-2.json          # Full content for project 2
├── project-N.json          # Full content for project N
└── project-template.json   # Template for new projects
```

## Adding a New Project

### Step 1: Create the project file

1. Copy `project-template.json`
2. Rename it to `project-N.json` (where N is your next project ID)
3. Fill in all the details:
   - `id`: Unique number (should match the filename number)
   - `title`: Project name
   - `year`: Year completed
   - `description`: Brief description (shown in sidebar)
   - `timestamp`: Display date (e.g., "Oct '23")
   - `previewImage`: URL to preview image (optional, shown in sidebar)
   - `content.paragraphs`: Array of text paragraphs
   - `content.media`: Array of images/videos/gifs

### Step 2: Add to index.json

Simply add the path to your new file in the desired order:

```json
[
    "projects/project-1.json",
    "projects/project-3.json",  ← You can reorder projects
    "projects/project-2.json",  ← by changing their position
    "projects/project-N.json"   ← New project added
]
```

**That's it!** Projects will appear in the order listed in `index.json`, not by ID number.
No need to duplicate any data. Everything is in one file per project.

### Media Positions

You can position media relative to paragraphs:
- `"after-paragraph-0"` - After first paragraph
- `"after-paragraph-1"` - After second paragraph
- `"after-paragraph-2"` - After third paragraph
- `"end"` - At the end of all content

### Media Types

Supported media types:
- `"image"` - Static images (.jpg, .png, .webp)
- `"video"` - Videos (.mp4) - will autoplay and loop
- `"gif"` - Animated GIFs

## Example

See `project-1.json` and `project-2.json` for working examples.

## Performance Notes

- Only `index.json` loads on page load (fast!)
- Individual project files load on-demand when clicked
- Content is cached after first load
- Videos use lazy loading and autoplay

