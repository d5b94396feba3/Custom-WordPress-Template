document.addEventListener('DOMContentLoaded', function() {
    // --- Global DOM Elements ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mainContent = document.getElementById('main-content'); // Correctly defined here
    const mobileSubmenuButton = mobileMenu.querySelector('button[aria-expanded][aria-controls="mobile-property-submenu"]');
    const mobileSubmenu = document.getElementById('mobile-property-submenu');

    // Hero Carousel Elements
    const carouselSlides = document.querySelectorAll('#hero-carousel .hero-slide');
    const carouselDotsContainer = document.getElementById('hero-carousel-dots');

    // Main Header for sticky effect
    const mainHeader = document.getElementById('main-header');


    // Mobile Menu Toggle
    mobileMenuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden', isExpanded);
        // Adjust main content for accessibility when mobile menu is open
        mainContent.setAttribute('aria-hidden', !isExpanded);
        document.body.style.overflow = isExpanded ? '' : 'hidden'; // Prevent background scrolling
    });

    // Mobile submenu toggle
    if (mobileSubmenuButton && mobileSubmenu) {
        mobileSubmenuButton.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mobileSubmenu.classList.toggle('hidden', isExpanded);
        });
    }

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mainContent.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = ''; // Restore background scrolling
            if (mobileSubmenu) mobileSubmenu.classList.add('hidden'); 
            if (mobileSubmenuButton) mobileSubmenuButton.setAttribute('aria-expanded', 'false');
        });
    });

    // Desktop Dropdown
    const desktopDropdowns = document.querySelectorAll('header nav .group');
    desktopDropdowns.forEach(group => {
        const button = group.querySelector('a[aria-haspopup="true"]'); 
        const dropdown = group.querySelector('[role="menu"]');

        if (button && dropdown) {
            // Handle click for accessibility (keyboard users) and explicit toggle
            button.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default link behavior
                const isExpanded = this.getAttribute('aria-expanded') === 'true';

                // Close other open desktop dropdowns
                desktopDropdowns.forEach(otherGroup => {
                    const otherDropdown = otherGroup.querySelector('[role="menu"]');
                    const otherButton = otherGroup.querySelector('a[aria-haspopup="true"]');
                    if (otherDropdown && otherButton && otherDropdown !== dropdown && !otherDropdown.classList.contains('hidden')) {
                        otherDropdown.classList.add('hidden');
                        otherButton.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current dropdown
                dropdown.classList.toggle('hidden');
                this.setAttribute('aria-expanded', !isExpanded);
            });

            // Handle focusout for keyboard navigation
            group.addEventListener('focusout', function(e) {
                if (!group.contains(e.relatedTarget)) {
                    dropdown.classList.add('hidden');
                    button.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
});
