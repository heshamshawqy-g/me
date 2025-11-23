// ============================================
// WORKSHOPS VIEW - Grid Display for All Workshops
// ============================================

// Theme configuration (matching gallery theme)
const workshopsTheme = {
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

// Initialize workshops view
async function initWorkshops() {
    try {
        // Load workshops index
        const response = await fetch('workshops/index.json');
        if (!response.ok) {
            throw new Error('Failed to load workshops');
        }
        const workshopFiles = await response.json();
        
        // Load all workshop data
        const workshopPromises = workshopFiles.map(async (filePath) => {
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
        
        const workshops = (await Promise.all(workshopPromises)).filter(w => w !== null);
        renderWorkshops(workshops);
    } catch (error) {
        console.error('Error loading workshops:', error);
        showWorkshopsError();
    }
}

// Render workshops grid
function renderWorkshops(workshops) {
    const contentView = document.getElementById('contentView');
    
    let workshopsHTML = `
        <div class="content-article">
            <div class="content-header">
                <h1 class="content-title">Workshops</h1>
                <div class="content-meta">
                    <span>A collection of workshops and teaching experiences</span>
                </div>
            </div>
            <div class="workshops-grid">
    `;
    
    if (workshops.length === 0) {
        workshopsHTML += `
            <div class="workshops-empty">
                <p>No workshops available yet. Check back soon!</p>
            </div>
        `;
    } else {
        workshops.forEach(workshop => {
            // Determine if preview is a video based on file extension
            const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(workshop.previewImage);
            
            workshopsHTML += `
                <div class="workshops-card" data-workshop-id="${workshop.id}">
                    <div class="workshops-card-image">
                        ${isVideo ? 
                            `<video autoplay loop muted playsinline>
                                <source src="${workshop.previewImage}" type="video/mp4">
                            </video>` :
                            `<img src="${workshop.previewImage}" alt="${workshop.title}" loading="lazy">`
                        }
                    </div>
                    <div class="workshops-card-content">
                        <h3 class="workshops-card-title">${workshop.title}</h3>
                        <div class="workshops-card-meta">
                            <span class="workshops-card-year">${workshop.year}</span>
                            ${workshop.timestamp ? `<span class="workshops-card-timestamp">${workshop.timestamp}</span>` : ''}
                        </div>
                        <p class="workshops-card-description">${workshop.description}</p>
                    </div>
                </div>
            `;
        });
    }
    
    workshopsHTML += `
            </div>
        </div>
    `;
    
    contentView.innerHTML = workshopsHTML;
    
    // Add click handlers to workshops cards
    const workshopsCards = document.querySelectorAll('.workshops-card');
    workshopsCards.forEach(card => {
        card.addEventListener('click', async () => {
            const workshopId = parseInt(card.dataset.workshopId);
            const workshop = workshops.find(w => w.id === workshopId);
            if (workshop) {
                await showWorkshopDetail(workshop);
            }
        });
    });
    
    // Add workshops styles dynamically
    injectWorkshopsStyles();
}

// Show workshop detail view
async function showWorkshopDetail(workshop) {
    const contentView = document.getElementById('contentView');
    const rightPanel = document.querySelector('.right-panel');
    
    // Fade out
    contentView.style.opacity = '0';
    
    setTimeout(() => {
        // Build content HTML (similar to project detail view)
        let contentHTML = `
            <div class="content-article">
                <!-- Back to Workshops Button -->
                <button class="back-to-gallery-btn" onclick="document.querySelector('.nav-link[href=\\'#workshops\\']').click();" title="Back to Workshops">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                </button>
                
                <div class="content-header">
                    <h1 class="content-title">${workshop.title}</h1>
                    <div class="content-meta">
                        <span>${workshop.description}</span>
                        <span>${workshop.timestamp}</span>
                    </div>
                </div>
                
                <div class="content-body">
        `;
        
        // Process paragraphs and intersperse media based on position
        if (workshop.content && workshop.content.paragraphs) {
            workshop.content.paragraphs.forEach((paragraph, index) => {
                contentHTML += `<p>${paragraph}</p>`;
                
                // Add media that should appear after this paragraph
                if (workshop.content.media) {
                    const mediaAfterThis = workshop.content.media.filter(m => 
                        m.position === `after-paragraph-${index}`
                    );
                    
                    mediaAfterThis.forEach(media => {
                        contentHTML += renderWorkshopMedia(media, workshop.title);
                    });
                }
            });
            
            // Add media marked for "end"
            if (workshop.content.media) {
                const endMedia = workshop.content.media.filter(m => 
                    m.position === 'end' || !m.position
                );
                
                endMedia.forEach(media => {
                    contentHTML += renderWorkshopMedia(media, workshop.title);
                });
            }
        }
        
        contentHTML += `
                </div>
            </div>
        `;
        
        // Set content
        contentView.innerHTML = contentHTML;
        
        // Scroll to top
        if (rightPanel) {
            rightPanel.scrollTop = 0;
        }
        
        // Fade in
        setTimeout(() => {
            contentView.style.opacity = '1';
        }, 50);
    }, 300);
}

// Helper function to render different media types for workshops
function renderWorkshopMedia(media, workshopTitle) {
    let html = '<div class="content-image">';
    
    switch(media.type) {
        case 'video':
            html += `
                <video autoplay loop muted playsinline loading="lazy">
                    <source src="${media.src}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
            break;
        case 'gif':
        case 'image':
        default:
            html += `<img src="${media.src}" alt="${media.caption || workshopTitle}" loading="lazy">`;
            break;
    }
    
    html += '</div>';
    
    if (media.caption) {
        html += `<p class="content-caption">${media.caption}</p>`;
    }
    
    return html;
}

// Show error message
function showWorkshopsError() {
    const contentView = document.getElementById('contentView');
    contentView.innerHTML = `
        <div class="content-article">
            <div class="content-header">
                <h1 class="content-title">Workshops</h1>
                <div class="content-meta">
                    <span style="color: #E63946;">Failed to load workshops. Please try again.</span>
                </div>
            </div>
        </div>
    `;
    injectWorkshopsStyles();
}

// Inject workshops-specific CSS
function injectWorkshopsStyles() {
    // Check if styles already exist
    if (document.getElementById('workshops-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'workshops-styles';
    style.textContent = `
        .workshops-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: ${workshopsTheme.spacing.margin};
            padding-bottom: 60px;
            margin-top: 40px;
        }
        
        .workshops-empty {
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
            color: ${workshopsTheme.secondaryTextColor};
            font-size: 16px;
        }
        
        @media (max-width: 1024px) {
            .workshops-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .workshops-grid {
                grid-template-columns: 1fr;
                gap: ${workshopsTheme.spacing.margin};
            }
        }
        
        .workshops-card {
            background: ${workshopsTheme.cardBackground};
            border-radius: ${workshopsTheme.cardBorderRadius};
            box-shadow: ${workshopsTheme.cardShadow};
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
        }
        
        .workshops-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
        
        .workshops-card-image {
            width: 100%;
            height: 280px;
            overflow: hidden;
            background: #f5f5f5;
        }
        
        .workshops-card-image img,
        .workshops-card-image video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .workshops-card:hover .workshops-card-image img,
        .workshops-card:hover .workshops-card-image video {
            transform: scale(1.05);
        }
        
        .workshops-card-content {
            padding: ${workshopsTheme.spacing.padding};
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .workshops-card-title {
            font-size: 22px;
            font-weight: ${workshopsTheme.headingFontWeight};
            color: ${workshopsTheme.textColor};
            margin-bottom: 8px;
            font-family: ${workshopsTheme.fontFamily};
        }
        
        .workshops-card-meta {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
            font-size: 14px;
            color: ${workshopsTheme.secondaryTextColor};
            font-family: ${workshopsTheme.fontFamily};
        }
        
        .workshops-card-year {
            font-weight: 500;
        }
        
        .workshops-card-timestamp {
            opacity: 0.7;
        }
        
        .workshops-card-description {
            font-size: 15px;
            font-weight: ${workshopsTheme.bodyFontWeight};
            color: ${workshopsTheme.secondaryTextColor};
            line-height: 1.6;
            font-family: ${workshopsTheme.fontFamily};
            flex: 1;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .workshops-grid {
                margin-top: 30px;
            }
            
            .workshops-card-image {
                height: 240px;
            }
            
            .workshops-card-title {
                font-size: 20px;
            }
            
            .workshops-card-description {
                font-size: 14px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Show workshops function (called from main script)
function showWorkshops() {
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
        
        // Initialize workshops
        initWorkshops();
        
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

