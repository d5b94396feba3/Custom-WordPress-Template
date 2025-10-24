
document.addEventListener('DOMContentLoaded', function() {
    // Function to handle dropdown functionality
    function setupDropdown(container) {
        const input = container.querySelector('.dropdown-input');
        const button = container.querySelector('.dropdown-button');
        const options = container.querySelector('.dropdown-options');
        const optionItems = container.querySelectorAll('.dropdown-option');

        // Toggle dropdown visibility
        function toggleDropdown() {
            options.classList.toggle('hidden');
            // Close other open dropdowns
            document.querySelectorAll('.dropdown-options').forEach(otherOptions => {
                if (otherOptions !== options && !otherOptions.classList.contains('hidden')) {
                    otherOptions.classList.add('hidden');
                }
            });
        }

        // Button click handler
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleDropdown();
        });

        // Input click handler (opens dropdown)
        input.addEventListener('click', function() {
            if (options.classList.contains('hidden')) {
                toggleDropdown();
            }
        });

        // Option selection handler
        optionItems.forEach(option => {
            option.addEventListener('click', function() {
                input.value = this.getAttribute('data-value');
                input.dispatchEvent(new Event('input', { bubbles: true }));
                options.classList.add('hidden');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!container.contains(e.target)) {
                options.classList.add('hidden');
            }
        });
    }    
    // Initialize all dropdowns on the page
    document.querySelectorAll('.dropdown-container').forEach(setupDropdown);
});
