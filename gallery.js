// ============================================
// GALLERY VIEW - Grid Display for All Projects
// ============================================

// Theme configuration
const galleryTheme = {
    background: "#FFFFFF",
    textColor: "#000000",
    secondaryTextColor: "#666666",
    accentColor: "#E63946",
    cardBackground: "#FFFFFF",
    cardBorderRadius: "12px",
    cardShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    headingFontWeight: 600,
    bodyFontWeight: 400,
    spacing: {
        padding: "24px",
        margin: "16px"
    },
    button: {
        background: "#000000",
        color: "#FFFFFF",
        borderRadius: "9999px",
        padding: "8px 16px"
    },
    link: {
        color: "#000000",
        hoverColor: "#E63946",
        textDecoration: "none"
    }
};

// Filter state
const CATEGORIES = ['Form Finding', 'Machine Learning', 'Tessellation Systems', 'Web Applications', 'Design Development'];
let selectedCategory = null;
let allProjects = [];

// Initialize gallery view
async function initGallery() {
    try {
        // Load projects index
        const response = await fetch('projects/index.json');
        if (!response.ok) {
            throw new Error('Failed to load projects');
        }
        const projectFiles = await response.json();
        
        // Load all project data
        const projectPromises = projectFiles.map(async (filePath) => {
            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`Failed to load ${filePath}`);
                }
                return await response.json();
            } catch (error) {
                console.error(`Error loading ${filePath}:`, error);
                return null;
            }
        });
        
        allProjects = (await Promise.all(projectPromises)).filter(p => p !== null);
        renderGallery(allProjects);
    } catch (error) {
        console.error('Error loading gallery:', error);
        showGalleryError();
    }
}

// Render gallery grid
function renderGallery(projects) {
    const contentView = document.getElementById('contentView');
    
    let galleryHTML = `
        <div class="content-article">
            <div class="content-header">
                <h1 class="content-title">Gallery</h1>
                <div class="content-meta">
                    <span>A visual collection of all projects</span>
                </div>
            </div>
            <div class="gallery-filters">
                <button class="filter-btn ${selectedCategory === null ? 'active' : ''}" data-category="all">All</button>
                ${CATEGORIES.map(cat => 
                    `<button class="filter-btn ${selectedCategory === cat ? 'active' : ''}" data-category="${cat}">${cat}</button>`
                ).join('')}
            </div>
            <div class="gallery-grid">
    `;
    
    projects.forEach(project => {
        const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(project.previewImage);
        const categories = project.categories || [];
        const isVisible = selectedCategory === null || categories.includes(selectedCategory);
        
        galleryHTML += `
            <div class="gallery-card ${isVisible ? '' : 'hidden'}" data-project-id="${project.id}" data-categories="${categories.join(',')}">
                <div class="gallery-card-image">
                    ${isVideo ? 
                        `<video autoplay loop muted playsinline>
                            <source src="${project.previewImage}" type="video/mp4">
                        </video>` :
                        `<img src="${project.previewImage}" alt="${project.title}" loading="lazy">`
                    }
                </div>
                <div class="gallery-card-content">
                    <h3 class="gallery-card-title">${project.title}</h3>
                    <div class="gallery-card-meta">
                        <span class="gallery-card-year">${project.year}</span>
                        ${project.timestamp ? `<span class="gallery-card-timestamp">${project.timestamp}</span>` : ''}
                    </div>
                    <p class="gallery-card-description">${project.description}</p>
                </div>
            </div>
        `;
    });
    
    galleryHTML += `
            </div>
        </div>
    `;
    
    contentView.innerHTML = galleryHTML;
    
    // Add click handlers to gallery cards
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = parseInt(card.dataset.projectId);
            const project = projects.find(p => p.id === projectId);
            if (project) {
                const projectItem = document.querySelector(`.project-item[data-project-id="${projectId}"]`);
                if (projectItem) {
                    projectItem.click();
                }
            }
        });
    });
    
    // Add filter button handlers
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            selectedCategory = category === 'all' ? null : category;
            filterGallery();
        });
    });
    
    injectGalleryStyles();
}

// Filter gallery cards
function filterGallery() {
    const cards = document.querySelectorAll('.gallery-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update button states
    filterBtns.forEach(btn => {
        if (btn.dataset.category === 'all') {
            btn.classList.toggle('active', selectedCategory === null);
        } else {
            btn.classList.toggle('active', selectedCategory === btn.dataset.category);
        }
    });
    
    // Filter cards
    cards.forEach(card => {
        const categories = card.dataset.categories.split(',').filter(c => c);
        const isVisible = selectedCategory === null || categories.includes(selectedCategory);
        card.classList.toggle('hidden', !isVisible);
    });
}

// Show error message
function showGalleryError() {
    const contentView = document.getElementById('contentView');
    contentView.innerHTML = `
        <div class="content-article">
            <div class="content-header">
                <h1 class="content-title">Gallery</h1>
                <div class="content-meta">
                    <span style="color: #E63946;">Failed to load projects. Please try again.</span>
                </div>
            </div>
        </div>
    `;
    injectGalleryStyles();
}

// Inject gallery-specific CSS
function injectGalleryStyles() {
    // Check if styles already exist
    if (document.getElementById('gallery-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'gallery-styles';
    style.textContent = `
        .gallery-filters {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 24px;
        }
        
        .filter-btn {
            padding: 8px 16px;
            border: 1px solid #ddd;
            border-radius: 20px;
            background: #fff;
            color: #666;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: ${galleryTheme.fontFamily};
        }
        
        .filter-btn:hover {
            border-color: #000;
            color: #000;
        }
        
        .filter-btn.active {
            background: #000;
            color: #fff;
            border-color: #000;
        }
        
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: ${galleryTheme.spacing.margin};
            padding-bottom: 60px;
            margin-top: 24px;
        }
        
        .gallery-card.hidden {
            display: none;
        }
        
        @media (max-width: 1024px) {
            .gallery-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .gallery-grid {
                grid-template-columns: 1fr;
                gap: ${galleryTheme.spacing.margin};
            }
        }
        
        .gallery-card {
            background: ${galleryTheme.cardBackground};
            border-radius: ${galleryTheme.cardBorderRadius};
            box-shadow: ${galleryTheme.cardShadow};
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        
        .gallery-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
        
        .gallery-card-image {
            width: 100%;
            height: 280px;
            overflow: hidden;
            background: #f5f5f5;
        }
        
        .gallery-card-image img,
        .gallery-card-image video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .gallery-card:hover .gallery-card-image img,
        .gallery-card:hover .gallery-card-image video {
            transform: scale(1.05);
        }
        
        .gallery-card-content {
            padding: ${galleryTheme.spacing.padding};
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .gallery-card-title {
            font-size: 22px;
            font-weight: ${galleryTheme.headingFontWeight};
            color: ${galleryTheme.textColor};
            margin-bottom: 8px;
            font-family: ${galleryTheme.fontFamily};
        }
        
        .gallery-card-meta {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
            font-size: 14px;
            color: ${galleryTheme.secondaryTextColor};
            font-family: ${galleryTheme.fontFamily};
        }
        
        .gallery-card-year {
            font-weight: 500;
        }
        
        .gallery-card-timestamp {
            opacity: 0.7;
        }
        
        .gallery-card-description {
            font-size: 15px;
            font-weight: ${galleryTheme.bodyFontWeight};
            color: ${galleryTheme.secondaryTextColor};
            line-height: 1.6;
            font-family: ${galleryTheme.fontFamily};
            flex: 1;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .gallery-grid {
                margin-top: 30px;
            }
            
            .gallery-card-image {
                height: 240px;
            }
            
            .gallery-card-title {
                font-size: 20px;
            }
            
            .gallery-card-description {
                font-size: 14px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Show gallery function (called from main script)
function showGallery() {
    // Keep animation visible, hide landing text
    hideLandingAnimation();
    
    // Hide placeholder
    const contentPlaceholder = document.getElementById('contentPlaceholder');
    if (contentPlaceholder) {
        contentPlaceholder.classList.add('hidden');
        contentPlaceholder.classList.remove('visible');
    }
    
    // Show content view with fade transition
    const contentView = document.getElementById('contentView');
    if (contentView) {
        contentView.style.opacity = '0';
        contentView.classList.add('active');
        
        // Initialize gallery
        initGallery();
        
        // Fade in
        setTimeout(() => {
            contentView.style.opacity = '1';
        }, 50);
    }
    
    // Scroll to top
    const rightPanel = document.querySelector('.right-panel');
    if (rightPanel) {
        rightPanel.scrollTop = 0;
        rightPanel.classList.remove('no-scroll');
    }
    
    // Clear active project
    document.querySelectorAll('.project-item').forEach(item => item.classList.remove('active'));
}

