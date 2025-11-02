// ============================================
// MEDIA PROTECTION - Prevent casual downloading
// ============================================

(function() {
    'use strict';
    
    // Disable right-click on images and videos
    function disableRightClick(e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
            e.preventDefault();
            showProtectionMessage();
            return false;
        }
    }
    
    // Disable drag and drop for images and videos
    function disableDragStart(e) {
        if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
            e.preventDefault();
            return false;
        }
    }
    
    // Show protection message
    function showProtectionMessage() {
        // Create message element if it doesn't exist
        let message = document.getElementById('protection-message');
        if (!message) {
            message = document.createElement('div');
            message.id = 'protection-message';
            message.textContent = 'Content is protected';
            message.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: rgba(17, 17, 17, 0.95);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(message);
        }
        
        // Show message
        message.style.opacity = '1';
        
        // Hide after 2 seconds
        setTimeout(() => {
            message.style.opacity = '0';
        }, 2000);
    }
    
    // Disable keyboard shortcuts for saving (Ctrl+S, Cmd+S)
    function disableSaveShortcut(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            return false;
        }
    }
    
    // Add CSS to prevent selection and dragging
    function addProtectionStyles() {
        const style = document.createElement('style');
        style.id = 'media-protection-styles';
        style.textContent = `
            /* Prevent selection of images and videos */
            img, video {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                -webkit-user-drag: none;
                -khtml-user-drag: none;
                -moz-user-drag: none;
                -o-user-drag: none;
                user-drag: none;
                pointer-events: auto;
            }
            
            /* Prevent text selection on captions */
            .content-caption,
            .gallery-card-description,
            .gallery-card-title {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize protection when DOM is ready
    function initMediaProtection() {
        // Add protection styles
        addProtectionStyles();
        
        // Add event listeners
        document.addEventListener('contextmenu', disableRightClick);
        document.addEventListener('dragstart', disableDragStart);
        document.addEventListener('keydown', disableSaveShortcut);
        
        console.log('Media protection enabled');
    }
    
    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMediaProtection);
    } else {
        initMediaProtection();
    }
})();
