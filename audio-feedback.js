// ============================================
// AUDIO FEEDBACK - Digital beep on clicks
// ============================================

(function() {
    'use strict';
    
    // Create audio context
    let audioContext = null;
    
    // Initialize audio context (lazy initialization to avoid autoplay issues)
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }
    
    // Play a pleasant digital beep
    function playBeep() {
        try {
            const ctx = initAudioContext();
            
            // Create oscillator for the beep sound
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            // Configure sound
            oscillator.type = 'sine'; // Smooth, pleasant sound
            oscillator.frequency.setValueAtTime(800, ctx.currentTime); // 800 Hz - pleasant mid-range
            
            // Volume envelope (fade in and out quickly)
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01); // Gentle volume
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            
            // Play sound
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.1); // Short 100ms beep
            
        } catch (error) {
            // Silently fail if audio doesn't work
            console.log('Audio playback not available');
        }
    }
    
    // Add click sound to interactive elements
    function addClickSound() {
        // Initialize audio context on first user interaction
        document.addEventListener('click', function initAudio() {
            initAudioContext();
            document.removeEventListener('click', initAudio);
        }, { once: true });
        
        // Add click listener for interactive elements
        document.addEventListener('click', function(e) {
            const target = e.target;
            
            // Check if click is on an interactive element
            const isInteractive = 
                target.classList.contains('project-item') ||
                target.classList.contains('nav-link') ||
                target.classList.contains('gallery-card') ||
                target.classList.contains('social-link') ||
                target.classList.contains('contact-social-link') ||
                target.classList.contains('email-link') ||
                target.classList.contains('skill-tag') ||
                target.classList.contains('tool-item') ||
                target.closest('.project-item') ||
                target.closest('.nav-link') ||
                target.closest('.gallery-card') ||
                target.closest('.social-link') ||
                target.closest('.contact-social-link');
            
            if (isInteractive) {
                playBeep();
            }
        });
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addClickSound);
    } else {
        addClickSound();
    }
})();

