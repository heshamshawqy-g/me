// ============================================
// ABOUT PAGE - Rendering and Functionality
// ============================================

// Load and render about page
async function initAboutPage() {
    try {
        const response = await fetch('about.json');
        if (!response.ok) {
            throw new Error('Failed to load about data');
        }
        const aboutData = await response.json();
        renderAboutPage(aboutData);
    } catch (error) {
        console.error('Error loading about page:', error);
        showAboutError();
    }
}

// Render about page content
function renderAboutPage(data) {
    const contentView = document.getElementById('contentView');
    
    let aboutHTML = `
        <div class="about-container">
            <!-- Part 1: Profile Section -->
            <section class="about-profile">
                <div class="about-profile-image">
                    <img src="${data.profile.image}" alt="${data.profile.name}">
                </div>
                <div class="about-profile-content">
                    <h1 class="about-profile-name">${data.profile.name}</h1>
                    <p class="about-profile-title">${data.profile.title}</p>
                    <div class="about-profile-bio">
                        ${data.profile.bio.map(paragraph => `<p>${paragraph}</p>`).join('')}
                    </div>
                </div>
            </section>

            <!-- Part 2: Experience Timeline -->
            <section class="about-section">
                <h2 class="about-section-title">Working Journey</h2>
                <div class="about-timeline">
                    ${data.experience.map(exp => `
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <div class="timeline-year">${exp.year}</div>
                                <h3 class="timeline-role">${exp.role}</h3>
                                <p class="timeline-company">${exp.company}</p>
                                <p class="timeline-description">${exp.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- Part 3: Skills -->
            <section class="about-section">
                <h2 class="about-section-title">Skillset</h2>
                <div class="about-skills">
                    ${data.skills.map(skill => `
                        <div class="skill-tag">${skill}</div>
                    `).join('')}
                </div>
            </section>

            <!-- Part 4: Tools Stack -->
            <section class="about-section">
                <h2 class="about-section-title">Tech Stack</h2>
                <div class="about-tools">
                    ${data.tools.map(tool => `
                        <div class="tool-item">
                            <span class="tool-name">${tool.name}</span>
                            <span class="tool-category">${tool.category}</span>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- Part 5: Social Links -->
            <section class="about-section">
                <h2 class="about-section-title">Connect</h2>
                <div class="about-social">
                    ${data.social.map(social => `
                        <a href="${social.url}" class="social-link" target="_blank" rel="noopener noreferrer">
                            <span class="social-icon">${getSocialIcon(social.icon)}</span>
                            <span class="social-platform">${social.platform}</span>
                        </a>
                    `).join('')}
                </div>
            </section>
        </div>
    `;
    
    contentView.innerHTML = aboutHTML;
    injectAboutStyles();
}

// Get social media icons (Unicode symbols)
function getSocialIcon(iconName) {
    const icons = {
        'linkedin': '↗',
        'github': '↗',
        'email': '✉',
        'twitter': '↗',
        'instagram': '↗'
    };
    return icons[iconName] || '↗';
}

// Show error message
function showAboutError() {
    const contentView = document.getElementById('contentView');
    contentView.innerHTML = `
        <div class="content-article">
            <div class="content-header">
                <h1 class="content-title">About</h1>
                <div class="content-meta">
                    <span style="color: #E63946;">Failed to load about page. Please try again.</span>
                </div>
            </div>
        </div>
    `;
}

// Inject about page styles
function injectAboutStyles() {
    if (document.getElementById('about-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'about-styles';
    style.textContent = `
        .about-container {
            max-width: 1000px;
            margin: 0 auto;
            animation: fadeInContent 0.5s ease-out;
        }

        /* Profile Section */
        .about-profile {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 60px;
            margin-bottom: 80px;
            align-items: start;
        }

        .about-profile-image {
            position: sticky;
            top: 40px;
        }

        .about-profile-image img {
            width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .about-profile-name {
            font-size: 42px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 8px;
            line-height: 1.2;
        }

        .about-profile-title {
            font-size: 20px;
            color: #666666;
            margin-bottom: 32px;
            font-weight: 500;
        }

        .about-profile-bio p {
            font-size: 17px;
            line-height: 1.8;
            color: #333333;
            margin-bottom: 20px;
        }

        /* Section Styles */
        .about-section {
            margin-bottom: 80px;
        }

        .about-section-title {
            font-size: 32px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 32px;
            padding-bottom: 16px;
            border-bottom: 2px solid #f0f0f0;
        }

        /* Timeline */
        .about-timeline {
            position: relative;
            padding-left: 40px;
        }

        .about-timeline::before {
            content: '';
            position: absolute;
            left: 0;
            top: 8px;
            bottom: 8px;
            width: 2px;
            background: linear-gradient(180deg, #111111 0%, #e0e0e0 100%);
        }

        .timeline-item {
            position: relative;
            margin-bottom: 48px;
        }

        .timeline-item:last-child {
            margin-bottom: 0;
        }

        .timeline-marker {
            position: absolute;
            left: -46px;
            top: 4px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #111111;
            border: 3px solid #ffffff;
            box-shadow: 0 0 0 2px #111111;
        }

        .timeline-year {
            font-size: 14px;
            font-weight: 600;
            color: #111111;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .timeline-role {
            font-size: 22px;
            font-weight: 600;
            color: #111111;
            margin-bottom: 4px;
        }

        .timeline-company {
            font-size: 16px;
            color: #666666;
            margin-bottom: 12px;
            font-weight: 500;
        }

        .timeline-description {
            font-size: 16px;
            line-height: 1.7;
            color: #555555;
        }

        /* Skills */
        .about-skills {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }

        .skill-tag {
            padding: 12px 24px;
            background: #f8f8f8;
            border-radius: 24px;
            font-size: 15px;
            font-weight: 500;
            color: #111111;
            transition: all 0.3s ease;
            border: 1px solid #e0e0e0;
        }

        .skill-tag:hover {
            background: #111111;
            color: #ffffff;
            border-color: #111111;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Tools */
        .about-tools {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
        }

        .tool-item {
            padding: 20px 24px;
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .tool-item:hover {
            border-color: #111111;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
        }

        .tool-name {
            font-size: 18px;
            font-weight: 600;
            color: #111111;
        }

        .tool-category {
            font-size: 13px;
            color: #888888;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* Social Links */
        .about-social {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
        }

        .social-link {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 14px 28px;
            background: #111111;
            color: #ffffff;
            border-radius: 28px;
            font-size: 16px;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .social-link:hover {
            background: #333333;
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .social-link:hover .social-icon {
            transform: translate(2px, -2px);
        }

        .social-icon {
            font-size: 18px;
            transition: transform 0.3s ease;
        }

        /* Responsive Design */
        @media (max-width: 900px) {
            .about-profile {
                grid-template-columns: 1fr;
                gap: 40px;
            }

            .about-profile-image {
                position: relative;
                top: 0;
                max-width: 280px;
                margin: 0 auto;
            }

            .about-profile-name {
                font-size: 32px;
            }

            .about-section-title {
                font-size: 28px;
            }
        }

        @media (max-width: 768px) {
            .about-timeline {
                padding-left: 30px;
            }

            .timeline-marker {
                left: -36px;
            }

            .about-tools {
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            }

            .about-profile-name {
                font-size: 28px;
            }

            .about-profile-title {
                font-size: 18px;
            }

            .timeline-role {
                font-size: 20px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

