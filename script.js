/**
 * Military Essentials Website
 * Enhanced JavaScript with better UX, accessibility, and error handling
 */

(function() {
    'use strict';
    
    // ==========================================
    // CONSTANTS & CONFIGURATION
    // ==========================================
    
    const SCROLL_THRESHOLD = 50;
    const ANIMATION_DELAY = 300;
    const DEBOUNCE_DELAY = 150;
    
    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    
    const elements = {
        hamburgerMenu: document.getElementById('hamburgerMenu'),
        sidebar: document.getElementById('sidebar'),
        sidebarClose: document.getElementById('sidebarClose'),
        sidebarOverlay: document.getElementById('sidebarOverlay'),
        sidebarLinks: document.querySelectorAll('.sidebar-link'),
        sections: document.querySelectorAll('.section'),
        navbar: document.querySelector('.navbar'),
        pageLoader: document.getElementById('pageLoader')
    };
    
    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    
    const state = {
        isSidebarOpen: false,
        currentSection: 'home',
        isScrolling: false
    };
    
    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    /**
     * Debounce function to limit function calls
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Trap focus within sidebar for accessibility
     */
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        function handleTabKey(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
        
        element.addEventListener('keydown', handleTabKey);
        return () => element.removeEventListener('keydown', handleTabKey);
    }
    
    /**
     * Save section to localStorage for persistence
     */
    function saveCurrentSection(sectionId) {
        try {
            localStorage.setItem('currentSection', sectionId);
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    }
    
    /**
     * Load saved section from localStorage
     */
    function loadSavedSection() {
        try {
            return localStorage.getItem('currentSection');
        } catch (e) {
            console.warn('localStorage not available:', e);
            return null;
        }
    }
    
    // ==========================================
    // SIDEBAR FUNCTIONALITY
    // ==========================================
    
    let removeFocusTrap = null;
    
    /**
     * Open sidebar with proper accessibility
     */
    function openSidebar() {
        if (state.isSidebarOpen) return;
        
        state.isSidebarOpen = true;
        elements.sidebar.classList.add('active');
        elements.sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update ARIA attributes
        elements.hamburgerMenu.setAttribute('aria-expanded', 'true');
        elements.sidebar.setAttribute('aria-hidden', 'false');
        
        // Focus management
        setTimeout(() => {
            elements.sidebarClose.focus();
            removeFocusTrap = trapFocus(elements.sidebar);
        }, 100);
        
        // Announce to screen readers
        announceToScreenReader('Navigation menu opened');
    }
    
    /**
     * Close sidebar with proper cleanup
     */
    function closeSidebar() {
        if (!state.isSidebarOpen) return;
        
        state.isSidebarOpen = false;
        elements.sidebar.classList.remove('active');
        elements.sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Update ARIA attributes
        elements.hamburgerMenu.setAttribute('aria-expanded', 'false');
        elements.sidebar.setAttribute('aria-hidden', 'true');
        
        // Return focus to hamburger menu
        setTimeout(() => {
            elements.hamburgerMenu.focus();
        }, 100);
        
        // Remove focus trap
        if (removeFocusTrap) {
            removeFocusTrap();
            removeFocusTrap = null;
        }
        
        // Announce to screen readers
        announceToScreenReader('Navigation menu closed');
    }
    
    /**
     * Toggle sidebar
     */
    function toggleSidebar() {
        if (state.isSidebarOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
    
    // ==========================================
    // SECTION NAVIGATION
    // ==========================================
    
    /**
     * Show specific section with animation
     */
    function showSection(targetId) {
        // Validate target ID
        if (!targetId || !targetId.startsWith('#')) {
            console.error('Invalid section ID:', targetId);
            return;
        }
        
        const sectionId = targetId.substring(1);
        const targetSection = document.getElementById(sectionId);
        
        if (!targetSection) {
            console.error('Section not found:', sectionId);
            return;
        }
        
        // Don't animate if already on this section
        if (state.currentSection === sectionId) {
            closeSidebar();
            return;
        }
        
        // Hide all sections
        elements.sections.forEach(section => {
            section.classList.remove('active');
            section.setAttribute('aria-hidden', 'true');
        });
        
        // Show target section
        targetSection.classList.add('active');
        targetSection.setAttribute('aria-hidden', 'false');
        
        // Update state
        state.currentSection = sectionId;
        saveCurrentSection(sectionId);
        
        // Smooth scroll to top
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
        
        // Update document title
        updateDocumentTitle(sectionId);
        
        // Announce to screen readers
        const sectionName = getSectionName(sectionId);
        announceToScreenReader(`Navigated to ${sectionName}`);
    }
    
    /**
     * Get human-readable section name
     */
    function getSectionName(sectionId) {
        const names = {
            'home': 'Home',
            'faq': 'FAQ',
            'contact': 'Contact Us',
            'tos': 'Terms of Service',
            'privacy': 'Privacy Policy'
        };
        return names[sectionId] || sectionId;
    }
    
    /**
     * Update document title based on section
     */
    function updateDocumentTitle(sectionId) {
        const baseTitle = 'Military Essentials - Discord Bot Hosting';
        const sectionNames = {
            'home': baseTitle,
            'faq': 'FAQ - Military Essentials',
            'contact': 'Contact Us - Military Essentials',
            'tos': 'Terms of Service - Military Essentials',
            'privacy': 'Privacy Policy - Military Essentials'
        };
        document.title = sectionNames[sectionId] || baseTitle;
    }
    
    /**
     * Announce message to screen readers
     */
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        announcement.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
        
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
    }
    
    // ==========================================
    // SCROLL HANDLING
    // ==========================================
    
    /**
     * Handle scroll events with debouncing
     */
    const handleScroll = debounce(() => {
        if (window.scrollY > SCROLL_THRESHOLD) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
    }, DEBOUNCE_DELAY);
    
    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    
    /**
     * Initialize all event listeners
     */
    function initEventListeners() {
        // Sidebar controls
        if (elements.hamburgerMenu) {
            elements.hamburgerMenu.addEventListener('click', toggleSidebar);
        }
        
        if (elements.sidebarClose) {
            elements.sidebarClose.addEventListener('click', closeSidebar);
        }
        
        if (elements.sidebarOverlay) {
            elements.sidebarOverlay.addEventListener('click', closeSidebar);
        }
        
        // Sidebar links
        elements.sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                showSection(targetId);
                closeSidebar();
                
                // Update URL without page reload
                if (window.history && window.history.pushState) {
                    window.history.pushState(null, '', targetId);
                }
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
        
        // Browser navigation (back/forward)
        window.addEventListener('popstate', handlePopState);
        
        // Scroll handling
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Page visibility for performance
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    /**
     * Handle keyboard shortcuts
     */
    function handleKeyboardShortcuts(e) {
        // Escape key closes sidebar
        if (e.key === 'Escape' && state.isSidebarOpen) {
            closeSidebar();
        }
        
        // Ctrl/Cmd + K opens sidebar (common pattern)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleSidebar();
        }
    }
    
    /**
     * Handle browser back/forward navigation
     */
    function handlePopState() {
        const hash = window.location.hash || '#home';
        showSection(hash);
    }
    
    /**
     * Handle page visibility changes for performance
     */
    function handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, pause animations if needed
            console.log('Page hidden');
        } else {
            // Page is visible again
            console.log('Page visible');
        }
    }
    
    // ==========================================
    // PAGE INITIALIZATION
    // ==========================================
    
    /**
     * Initialize the page
     */
    function initPage() {
        // Hide loader after page is ready
        setTimeout(() => {
            if (elements.pageLoader) {
                elements.pageLoader.classList.add('hidden');
            }
        }, ANIMATION_DELAY);
        
        // Check for hash in URL or saved section
        const hash = window.location.hash;
        const savedSection = loadSavedSection();
        
        if (hash) {
            showSection(hash);
        } else if (savedSection) {
            showSection(`#${savedSection}`);
            // Update URL to match
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, '', `#${savedSection}`);
            }
        } else {
            showSection('#home');
        }
        
        // Initialize event listeners
        initEventListeners();
        
        // Add loaded class to body for CSS hooks
        document.body.classList.add('page-loaded');
        
        console.log('Military Essentials website initialized');
    }
    
    // ==========================================
    // ERROR HANDLING
    // ==========================================
    
    /**
     * Global error handler
     */
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        // Could send to analytics service here
    });
    
    /**
     * Unhandled promise rejection handler
     */
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        // Could send to analytics service here
    });
    
    // ==========================================
    // START APPLICATION
    // ==========================================
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPage);
    } else {
        initPage();
    }
    
    // Expose public API for debugging (remove in production)
    if (typeof window !== 'undefined') {
        window.MilitaryEssentials = {
            version: '2.0.0',
            state,
            openSidebar,
            closeSidebar,
            showSection
        };
    }
    
})();