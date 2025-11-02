// ============================================
// CONTACT PAGE - Rendering and Functionality
// ============================================

// Load and render contact page
async function initContactPage() {
    try {
        // Load social media data from about.json
        const response = await fetch('about.json');
        if (!response.ok) {
            throw new Error('Failed to load contact data');
        }
        const aboutData = await response.json();
        renderContactPage(aboutData.social);
    } catch (error) {
        console.error('Error loading contact page:', error);
        showContactError();
    }
}

// Render contact page content
function renderContactPage(socialData) {
    const contentView = document.getElementById('contentView');
    
    // Extract email from social data
    const emailData = socialData.find(s => s.platform === 'Email');
    const otherSocials = socialData.filter(s => s.platform !== 'Email');
    
    let contactHTML = `
        <div class="contact-container">
            <div class="contact-header">
                <h1 class="contact-title">Get In Touch</h1>
                <p class="contact-subtitle">Let's connect and discuss your next project</p>
            </div>

            <!-- Email Section -->
            <section class="contact-section">
                <h2 class="contact-section-title">Email</h2>
                <div class="contact-email">
                    <a href="${emailData.url}" class="email-link">
                        ${emailData.url.replace('mailto:', '')}
                    </a>
                </div>
            </section>

            <!-- Social Links Section -->
            <section class="contact-section">
                <h2 class="contact-section-title">Connect</h2>
                <div class="contact-social">
                    ${otherSocials.map(social => `
                        <a href="${social.url}" class="contact-social-link" target="_blank" rel="noopener noreferrer">
                            <span class="contact-social-icon">${getContactIcon(social.icon)}</span>
                            <span class="contact-social-platform">${social.platform}</span>
                        </a>
                    `).join('')}
                </div>
            </section>
        </div>
    `;
    
    contentView.innerHTML = contactHTML;
    injectContactStyles();
}

// Get social media icons
function getContactIcon(iconName) {
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
function showContactError() {
    const contentView = document.getElementById('contentView');
    contentView.innerHTML = `
        <div class="content-article">
            <div class="content-header">
                <h1 class="content-title">Contact</h1>
                <div class="content-meta">
                    <span style="color: #E63946;">Failed to load contact page. Please try again.</span>
                </div>
            </div>
        </div>
    `;
}

// Inject contact page styles
function injectContactStyles() {
    if (document.getElementById('contact-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'contact-styles';
    style.textContent = `
        .contact-container {
            max-width: 800px;
            margin: 0 auto;
            animation: fadeInContent 0.5s ease-out;
        }

        .contact-header {
            text-align: left;
            margin-bottom: 80px;
        }

        .contact-title {
            font-size: 48px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 16px;
            line-height: 1.2;
        }

        .contact-subtitle {
            font-size: 20px;
            color: #666666;
            font-weight: 400;
            line-height: 1.6;
        }

        .contact-section {
            margin-bottom: 80px;
        }

        .contact-section-title {
            font-size: 32px;
            font-weight: 700;
            color: #111111;
            margin-bottom: 32px;
            padding-bottom: 16px;
            border-bottom: 2px solid #f0f0f0;
        }

        /* Email Section */
        .contact-email {
            padding: 20px 0 0 0;
        }

        .email-link {
            font-size: 28px;
            font-weight: 600;
            color: #111111;
            text-decoration: none;
            position: relative;
            display: inline-block;
            transition: all 0.3s ease;
        }

        .email-link::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #111111;
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
        }

        .email-link:hover {
            color: #333333;
        }

        .email-link:hover::after {
            transform: scaleX(1);
            transform-origin: left;
        }

        /* Social Links */
        .contact-social {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
        }

        .contact-social-link {
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

        .contact-social-link:hover {
            background: #333333;
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .contact-social-link:hover .contact-social-icon {
            transform: translate(2px, -2px);
        }

        .contact-social-icon {
            font-size: 18px;
            transition: transform 0.3s ease;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .contact-title {
                font-size: 36px;
            }

            .contact-subtitle {
                font-size: 18px;
            }

            .contact-section-title {
                font-size: 28px;
            }

            .email-link {
                font-size: 22px;
                word-break: break-all;
            }

            .contact-social {
                justify-content: flex-start;
            }
        }
    `;
    
    document.head.appendChild(style);
}

