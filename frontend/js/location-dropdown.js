
document.addEventListener('DOMContentLoaded', function() {
const locationContainer = document.querySelector('.location-dropdown-container');
if (locationContainer) {
    const locationTrigger = locationContainer.querySelector('.location-dropdown-trigger');
    const locationInput = locationContainer.querySelector('.location-dropdown-input');
    const locationOptions = locationContainer.querySelector('.location-dropdown-options');
    const locationOptionButtons = locationContainer.querySelectorAll('.location-dropdown-option');
    
    // Open dropdown when clicking anywhere on the trigger area
    locationTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        locationOptions.classList.toggle('hidden');
    });
    
    // Handle option selection
    locationOptionButtons.forEach(button => {
        button.addEventListener('click', function() {
            locationInput.value = button.textContent;
            locationInput.dataset.value = button.dataset.value;
            locationOptions.classList.add('hidden');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!locationContainer.contains(e.target)) {
            locationOptions.classList.add('hidden');
        }
    });
}
});