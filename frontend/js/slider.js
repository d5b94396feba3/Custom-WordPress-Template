document.addEventListener('DOMContentLoaded', function() {
    // --- Global DOM Elements ---


    // Hero Carousel Elements
    let carouselSlides = document.querySelectorAll('#hero-carousel .hero-slide');
    let carouselDotsContainer = document.getElementById('hero-carousel-dots');


    // Hero Carousel Functionality
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        carouselSlides.forEach((slide, i) => {
            slide.classList.remove('active', 'opacity-100');
            slide.classList.add('opacity-0');
            slide.setAttribute('aria-hidden', 'true'); // Hide for accessibility

            if (i === index) {
                slide.classList.add('active', 'opacity-100');
                slide.setAttribute('aria-hidden', 'false'); // Show for accessibility
            }
        });

        carouselDotsContainer.querySelectorAll('button').forEach((dot, i) => {
            dot.classList.remove('bg-[var(--color-primary-orange)]', 'opacity-100');
            dot.classList.add('bg-[var(--color-white)]', 'opacity-50');
            dot.setAttribute('aria-current', 'false');
            if (i === index) {
                dot.classList.remove('opacity-50');
                dot.classList.add('bg-[var(--color-primary-orange)]', 'opacity-100');
                dot.setAttribute('aria-current', 'true');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % carouselSlides.length;
        showSlide(currentSlide);
    }

    function startCarousel() {
        showSlide(currentSlide); // Show initial slide
        clearInterval(slideInterval); // Clear any existing interval
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Create dots
    carouselSlides.forEach((_, i) => {
        let dot = document.createElement('button');
        dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-[var(--color-white)]', 'opacity-50', 'hover:opacity-100', 'transition-opacity', 'duration-300');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
            currentSlide = i;
            startCarousel(); // Restart interval on manual navigation
        });
        carouselDotsContainer.appendChild(dot);
    });

    startCarousel();

});
