// ============================================
// LANDING ANIMATION - Three.js Shader
// ============================================

let animationRenderer = null;
let animationScene = null;
let animationMaterial = null;

function initLandingAnimation() {
    const container = document.getElementById('landingAnimation');
    if (!container || !window.THREE) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    animationRenderer = renderer;

    // Scene, camera, clock
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();
    animationScene = scene;

    // GLSL shaders
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        precision mediump float;
        uniform vec2 iResolution;
        uniform float iTime;
        varying vec2 vUv;

        // Simple hash-based noise
        float hash(float n) {
            return fract(sin(n) * 43758.5453);
        }
        
        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f*f*(3.0-2.0*f);
            float a = hash(i.x + i.y*57.0);
            float b = hash(i.x+1.0 + i.y*57.0);
            float c = hash(i.x + (i.y+1.0)*57.0);
            float d = hash(i.x+1.0 + (i.y+1.0)*57.0);
            return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
        }

        // Fractal Brownian Motion
        float fbm(vec2 p) {
            float sum = 0.0, amp = 0.5, freq = 1.0;
            for(int i=0;i<6;i++){
                sum += amp * noise(p*freq);
                amp *= 0.5;
                freq *= 2.0;
            }
            return sum;
        }

        // Generate wavy lines pattern
        float lines(vec2 uv, float thickness, float distortion) {
            float y = uv.y + distortion * fbm(uv*2.0 + iTime*0.1);
            float pattern = fract(y * 40.0);  // Doubled from 20.0 to 40.0
            return smoothstep(0.5-thickness, 0.5, pattern)
                 - smoothstep(0.5, 0.5+thickness, pattern);
        }

        void mainImage(out vec4 O, in vec2 fragCoord) {
            vec2 uv = fragCoord.xy / iResolution;
            uv.x *= iResolution.x / iResolution.y;

            // Base parameters - thickness increased 1.5x (from 0.02 to 0.03)
            float thickness = 0.03;
            float distortion = 0.1;
            float wave = lines(uv, thickness, distortion);

            // Matching website background - subtle gradient from white to light gray
            vec3 bgGradient = mix(vec3(1.0, 1.0, 1.0), vec3(0.973, 0.976, 0.980), uv.y);
            vec3 lineColor = vec3(0.85, 0.85, 0.85);
            vec3 col = mix(bgGradient, lineColor, wave);

            // Center LIGHTENING for focus - radius increased 1.5x, visibility 1.2x
            float dist = distance(fragCoord, iResolution*0.5);
            float radius = min(iResolution.x, iResolution.y)*0.5;
            // Changed from 0.5, 0.3 to 0.75, 0.45 (1.5x radius)
            float brighten = smoothstep(radius*0.75, radius*0.45, dist);
            // Changed from 0.4 to 0.48 (1.2x visibility)
            col = mix(col, vec3(0.99, 0.99, 1.0), brighten * 0.48);

            O = vec4(col, 1.0);
        }

        void main() {
            mainImage(gl_FragColor, vUv * iResolution);
        }
    `;

    // Uniforms
    const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2() }
    };

    const material = new THREE.ShaderMaterial({ 
        vertexShader, 
        fragmentShader, 
        uniforms 
    });
    animationMaterial = material;

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    // Resize handler
    const onResize = () => {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        uniforms.iResolution.value.set(w, h);
    };
    
    window.addEventListener('resize', onResize);
    onResize();

    // Render loop
    renderer.setAnimationLoop(() => {
        uniforms.iTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
    });

    // Store cleanup function
    container._cleanup = () => {
        window.removeEventListener('resize', onResize);
        renderer.setAnimationLoop(null);
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }
        material.dispose();
        mesh.geometry.dispose();
        renderer.dispose();
    };
}

function showLandingAnimation() {
    const landing = document.getElementById('landingAnimation');
    const landingContent = document.getElementById('landingContent');
    const rightPanel = document.querySelector('.right-panel');
    
    if (landing) {
        landing.classList.remove('hidden');
    }
    if (landingContent) {
        landingContent.classList.remove('hidden');
    }
    if (rightPanel) {
        rightPanel.classList.add('no-scroll');
    }
}

function hideLandingAnimation() {
    const landing = document.getElementById('landingAnimation');
    const landingContent = document.getElementById('landingContent');
    const rightPanel = document.querySelector('.right-panel');
    
    if (landing) {
        landing.classList.add('hidden');
    }
    if (landingContent) {
        landingContent.classList.add('hidden');
    }
    if (rightPanel) {
        rightPanel.classList.remove('no-scroll');
    }
}

// ============================================
// PROJECT DATA - Loaded from JSON
// ============================================
let projects = [];
let projectCache = {}; // Cache loaded project data

// Load projects index (simple array of file paths)
async function loadProjects() {
    try {
        const response = await fetch('projects/index.json');
        if (!response.ok) {
            throw new Error('Failed to load projects');
        }
        const projectFiles = await response.json();
        
        // Load basic info from each project file
        const projectPromises = projectFiles.map(async (filePath) => {
            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`Failed to load ${filePath}`);
                }
                const projectData = await response.json();
                
                // Cache the full project data
                projectCache[projectData.id] = projectData;
                
                // Return basic info for the list
                return {
                    id: projectData.id,
                    title: projectData.title,
                    year: projectData.year,
                    description: projectData.description,
                    timestamp: projectData.timestamp,
                    previewImage: projectData.previewImage
                };
            } catch (error) {
                console.error(`Error loading ${filePath}:`, error);
                return null;
            }
        });
        
        // Wait for all projects to load
        const loadedProjects = await Promise.all(projectPromises);
        
        // Filter out any failed loads (keep order from index.json)
        projects = loadedProjects.filter(p => p !== null);
        
        renderProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
        // Fallback to empty state
        projects = [];
        renderProjects();
    }
}

// Get project content (from cache since it was loaded with basic info)
function getProjectContent(projectId) {
    return projectCache[projectId] || null;
}
// ============================================
// DOM ELEMENTS
// ============================================

const projectList = document.getElementById('projectList');
const contentView = document.getElementById('contentView');
const contentPlaceholder = document.getElementById('contentPlaceholder');
const rightPanel = document.querySelector('.right-panel');

// ============================================
// RENDER PROJECT LIST
// ============================================

function renderProjects() {
    projectList.innerHTML = '';
    
    projects.forEach((project) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.dataset.projectId = project.id;
        
        projectItem.innerHTML = `
            <div class="project-title">${project.title}</div>
            <div class="project-year">${project.year}</div>
            <div class="project-description">${project.description}</div>
        `;
        
        // Click: Show full content (no hover behavior)
        projectItem.addEventListener('click', () => {
            handleProjectClick(project, projectItem);
        });
        
        projectList.appendChild(projectItem);
    });
}

// ============================================
// HANDLE PROJECT CLICK - Show Full Content
// ============================================

function handleProjectClick(project, element) {
    // Update active state
    const allProjectItems = document.querySelectorAll('.project-item');
    allProjectItems.forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    
    // Hide landing animation
    hideLandingAnimation();
    
    // Hide placeholder
    contentPlaceholder.classList.add('hidden');
    contentPlaceholder.classList.remove('visible');
    
    // Get project content from cache
    const projectData = getProjectContent(project.id);
    
    if (!projectData) {
        console.error('Failed to load project content');
        return;
    }
    
    // If content is already showing, fade out first then show new content
    if (contentView.classList.contains('active')) {
        // Fade out current content
        contentView.style.opacity = '0';
        
        setTimeout(() => {
            // Load new content
            showFullContent(projectData);
            
            // Ensure it's visible and fade back in
            contentView.classList.add('active');
            setTimeout(() => {
                contentView.style.opacity = '1';
            }, 50);
        }, 300);
    } else {
        // First time showing content - show immediately
        showFullContent(projectData);
        contentView.classList.add('active');
        
        // Ensure opacity is set
        setTimeout(() => {
            contentView.style.opacity = '1';
        }, 50);
    }
}

// ============================================
// SHOW FULL BLOG-STYLE CONTENT
// ============================================

function showFullContent(project) {
    // Build content HTML
    let contentHTML = `
        <div class="content-article">
            <div class="content-header">
                <h1 class="content-title">${project.title}</h1>
                <div class="content-meta">
                    <span>${project.description}</span>
                    <span>${project.timestamp}</span>
                </div>
            </div>
            
            <div class="content-body">
    `;
    
    // Process paragraphs and intersperse media based on position
    if (project.content && project.content.paragraphs) {
        project.content.paragraphs.forEach((paragraph, index) => {
            contentHTML += `<p>${paragraph}</p>`;
            
            // Add media that should appear after this paragraph
            if (project.content.media) {
                const mediaAfterThis = project.content.media.filter(m => 
                    m.position === `after-paragraph-${index}`
                );
                
                mediaAfterThis.forEach(media => {
                    contentHTML += renderMedia(media, project.title);
                });
            }
        });
        
        // Add media marked for "end"
        if (project.content.media) {
            const endMedia = project.content.media.filter(m => 
                m.position === 'end' || !m.position
            );
            
            endMedia.forEach(media => {
                contentHTML += renderMedia(media, project.title);
            });
        }
    }
    
    // Legacy support for old "images" structure
    if (project.content && project.content.images && !project.content.media) {
        project.content.images.forEach(image => {
            contentHTML += `
                <div class="content-image">
                    <img src="${image.src}" alt="${image.caption || project.title}" loading="lazy">
                </div>
                ${image.caption ? `<p class="content-caption">${image.caption}</p>` : ''}
            `;
        });
    }
    
    contentHTML += `
            </div>
        </div>
    `;
    
    // Set content
    contentView.innerHTML = contentHTML;
    
    // Scroll right panel to top
    if (rightPanel) {
        rightPanel.scrollTop = 0;
    }
}

// Helper function to render different media types
function renderMedia(media, projectTitle) {
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
            html += `<img src="${media.src}" alt="${media.caption || projectTitle}" loading="lazy">`;
            break;
    }
    
    html += '</div>';
    
    if (media.caption) {
        html += `<p class="content-caption">${media.caption}</p>`;
    }
    
    return html;
}

// ============================================
// NAVIGATION HANDLING
// ============================================

const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        const section = link.getAttribute('href').substring(1);
        
        // Handle different sections
        if (section === 'work') {
            // Show work section - back to landing
            // First, fade out and hide any existing content
            contentView.style.opacity = '0';
            contentView.classList.remove('active');
            
            // Clear content after fade
            setTimeout(() => {
                contentView.innerHTML = '';
            }, 300);
            
            // Hide placeholder
            contentPlaceholder.classList.remove('visible');
            contentPlaceholder.classList.add('hidden');
            
            // Show landing animation
            showLandingAnimation();
            
            // Clear active project
            document.querySelectorAll('.project-item').forEach(item => item.classList.remove('active'));
            
            // Scroll to top
            if (rightPanel) {
                rightPanel.scrollTop = 0;
            }
        } else if (section === 'about') {
            // You can implement an about page here
            showAboutPage();
        } else if (section === 'contact') {
            // You can implement a contact page here
            showContactPage();
        }
    });
});

// Placeholder functions for About and Contact
function showAboutPage() {
    const aboutHTML = `
        <div class="content-article">
            <div class="content-header">
                <h1 class="content-title">About</h1>
            </div>
            <div class="content-body">
                <p>Add your about content here. Tell visitors about yourself, your background, and what you do.</p>
            </div>
        </div>
    `;
    
    // Hide landing animation
    hideLandingAnimation();
    
    // Set content and show
    contentView.innerHTML = aboutHTML;
    
    // Reset opacity and show
    contentView.style.opacity = '0';
    contentView.classList.add('active');
    
    setTimeout(() => {
        contentView.style.opacity = '1';
    }, 50);
    
    contentPlaceholder.classList.add('hidden');
    contentPlaceholder.classList.remove('visible');
    
    // Scroll right panel to top
    if (rightPanel) {
        rightPanel.scrollTop = 0;
    }
    
    // Clear active project
    document.querySelectorAll('.project-item').forEach(item => item.classList.remove('active'));
}

function showContactPage() {
    const contactHTML = `
        <div class="content-article">
            <div class="content-header">
                <h1 class="content-title">Contact</h1>
            </div>
            <div class="content-body">
                <p>Add your contact information here. Email, social media links, or a contact form.</p>
            </div>
        </div>
    `;
    
    // Hide landing animation
    hideLandingAnimation();
    
    // Set content and show
    contentView.innerHTML = contactHTML;
    
    // Reset opacity and show
    contentView.style.opacity = '0';
    contentView.classList.add('active');
    
    setTimeout(() => {
        contentView.style.opacity = '1';
    }, 50);
    
    contentPlaceholder.classList.add('hidden');
    contentPlaceholder.classList.remove('visible');
    
    // Scroll right panel to top
    if (rightPanel) {
        rightPanel.scrollTop = 0;
    }
    
    // Clear active project
    document.querySelectorAll('.project-item').forEach(item => item.classList.remove('active'));
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Load projects from JSON file
    loadProjects();
    
    // Initialize the landing animation
    initLandingAnimation();
    
    // Show landing animation by default
    showLandingAnimation();
});
