
    document.addEventListener('DOMContentLoaded', function() {
        // --- Global DOM Elements ---
    
        let mainContent_mp = document.getElementById('main-content'); 
    
        // Main Header for sticky effect
        let mainHeader_mp = document.getElementById('main-header');
    
        // --- Wizard Modal Elements ---
        let startWizardBtn = document.getElementById('start-wizard-btn');
        let styleSelectorModal = document.getElementById('style-selector-modal'); 
        let wizardModalCloseBtn = styleSelectorModal.querySelector('.modal-close-btn');
    
        // Elements within the single wizard modal
        let wizardModalMainTitle = document.getElementById('wizard-modal-main-title'); 
        let wizardModalStepText = document.getElementById('wizard-modal-step-text');
        let wizardHourglassSpinner = document.getElementById('wizard-hourglass-spinner');
        let wizardStepsContainer = document.getElementById('wizard-steps-container');
        let wizardBackBtn = document.getElementById('wizard-back-btn');
        let wizardBottomContainer = document.getElementById('wizard-bottom-container');
        let wizardNextBtn = document.getElementById('wizard-next-btn');
        let wizardSubmitBtn = document.getElementById('wizard-submit-btn');
        let wizardCloseBtn = document.getElementById('wizard-close-btn');
        let matterportGalleryWizard = document.getElementById('matterport-gallery-wizard');
        let matterportViewerWizard = document.getElementById('matterport-viewer-wizard');
        let wizardSelectedModelTitle = document.getElementById('wizard-selected-model-title');
        let noResultsWizard = document.getElementById('no-results-wizard');
        let wizardContactQuoteBtn = document.getElementById('wizard-contact-quote-btn');
        let wizardEstimatedCost = document.getElementById('wizard-estimated-cost');
        let wizardCostDetails = document.getElementById('wizard-cost-details');
        let wizardComplianceDetails = document.getElementById('wizard-compliance-details');
        let wizardViewAllHomesBtn = document.querySelector('.view-all-homes-btn');
        let wizardViewFeaturedGalleryBtn = document.querySelector('.back-to-featured-gallery-btn');
        let recommendedListingsContainer = document.getElementById('recommended-listings-container');
        let recommendedMatterportGallery = document.getElementById('recommended-matterport-gallery');
        let noResultsMessage = document.getElementById('no-results-message');
        let resultsIntroText = document.getElementById('results-intro-text');
        let progressFillWizard = document.getElementById('progress-fill-wizard');
        let progressFillWizardContainer = document.getElementById('progress-fill-wizard-container');
        let progressIndicatorsWizard = document.querySelectorAll('.progress-step-indicator');
        let userSelectionsSummary = document.getElementById('user-selections-summary');
    
        // Validation messages
        let styleSelectionMessage = document.getElementById('style-selection-message');
        let sizeSelectionMessage = document.getElementById('size-selection-message');
        let budgetSelectionMessage = document.getElementById('budget-selection-message');
        let featuresSelectionMessage = document.getElementById('features-selection-message');
        let finishesError = document.getElementById('finishes-error');
        let allowancesError = document.getElementById('allowances-error');
        let roomsBathsError = document.getElementById('rooms-baths-error'); 
    
        let contactInfoMessage = document.getElementById('contact-info-message');
        let contactErroroMessage = document.getElementById('contact-error-message');
    
        // Elements for About This Home section in Wizard Step 10
        let wizardModalDescriptionElement = document.getElementById('wizard-modal-description');
        let wizardModalStyleElement = document.getElementById('wizard-modal-style');
        let wizardModalSizeElement = document.getElementById('wizard-modal-size');
        let wizardModalFeaturesContainer = document.getElementById('wizard-modal-features');
        // Tab functionality for Popular Properties
        let tabButtons = document.querySelectorAll('#popular-properties .tab-button');
        // Global state
        let currentStepWizard = 1;
        const totalWizardQuestions = 8; // Steps 1-8 are questions
        const galleryStep = 9; // Step 9 is the results gallery
        const viewerStep = 10; // Step 10 is the Matterport viewer
        const totalStepsInIndicator = 10; // Total steps in the progress indicator
        let tourOpenedFromMainPage = false; // Flag to differentiate entry point
    
        // Get the floor plan elements
        const floorPlanImage = document.getElementById('floor-plan-image');
        const downloadFloorPlanBtn = document.getElementById('download-floor-plan-btn');
    
        // Step 10 Tabs
        const step10DetailsMenu = document.getElementById('details-menu');
        const step10TabButtons = step10DetailsMenu.querySelectorAll('.tab-btn');
        const step10DetailSections = document.querySelectorAll('.details-section');

        let currentModelId = ''; 
       
        // Pricing Data
        const pricingData = {
             baseCostPerSqFt: 150, // Base construction cost per sq.ft.
             styleMultipliers: {
                 modern: 1.1,
                 traditional: 1.0,
                 farmhouse: 1.05,
                 ranch: 0.95,
                 colonial: 1.1, 
                 contemporary: 1.15,
                 luxury: 1.3,
                 coastal: 1.1,
                 craftsman: 1.08,
                 mediterranean: 1.2,
                 townhome: 0.9,
                 villa: 1.25
             },
             storiesMultiplier: {
                 '1': 1.0,
                 '1.5': 1.05,
                 '2': 1.1,
                 '3': 1.2
             },
             garageCost: {
                 '0': 0,
                 '1': 15000,
                 '2': 25000,
                 '3': 35000,
                 '4': 50000
             },
             bedroomCost: {
                 '1': 0,
                 '2': 5000,
                 '3': 10000,
                 '4': 15000,
                 '5': 20000,
                 '6': 25000
             },
             bathroomCost: {
                 '1': 0,
                 '1.5': 7500,
                 '2': 15000,
                 '2.5': 22500,
                 '3': 30000,
                 '3.5': 37500,
                 '4': 45000
             },
             kitchenTypeCost: {
                 'basic': 10000,
                 'standard': 20000,
                 'gourmet': 35000,
                 'luxury': 50000
             },
             additionalRooms: {
                 'office': 5000,
                 'mudroom': 3000,
                 'laundry': 4000,
                 'pantry': 2500
             },
             flooringCost: {
                 'laminate': 3.5, // per sq.ft.
                 'engineered': 7.5,
                 'hardwood': 11.5,
                 'tile': 8.0
             },
             countertopsCost: {
                 'laminate': 35, // per sq.ft.
                 'quartz': 85,
                 'granite': 70,
                 'marble': 137.5
             },
             cabinetsAllowance: {
                 'basic': 20000,
                 'standard': 30000,
                 'premium': 42500
             },
             appliancesAllowance: {
                 'basic': 6500,
                 'standard': 10000,
                 'premium': 18500
             },
             bathFixturesAllowance: {
                 'basic': 3000, // per bathroom
                 'standard': 5500,
                 'premium': 11000
             }
         };
    
    
        // --- Matterport Models Data (Curated List) ---
        let MATTERPORT_MODELS = [];
    
    
        // Fetch listings from WordPress REST API
        function fetchFeaturedListings() {
            fetch('https://dummyapi.com/wp-json/dummy-api/v1/get-featured-listings', { // Dummy API endpoint
                method: 'GET',
                headers: {
                        'X-WP-Nonce': 'dummy-nonce-value' // Dummy nonce
                    },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    MATTERPORT_MODELS = data.data;
                    renderPropertyCards(MATTERPORT_MODELS);
                } else {
                    console.error('Error fetching listings:', data.message);
                    renderPropertyCards([]);
                }
            })
            .catch(error => {
                console.error('Error fetching listings:', error);
                renderPropertyCards([]);
            })
            .finally(() => {
                // hideSpinnerWizard();
            });
        }
    
    
        // --- DOM Elements for Property Grid (main page) ---
        let propertyGridContainer = document.getElementById('property-grid-container');
    
        // --- Render Property Cards Function (for main page) ---
        function renderPropertyCards(models) {
            propertyGridContainer.innerHTML = ''; // Clear existing cards
 
            // Apply the 6-listing limit here for any set of models passed
            let limitedModels = models.slice(0, 6);

            let floor_img_link=models.floor_img_link;
 
            if (limitedModels.length === 0) {
                propertyGridContainer.innerHTML = `
                    <div class="col-span-full py-12 text-center text-[var(--color-text-medium)]">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 class="mt-2 text-lg font-medium text-[var(--color-dark-primary)]">No homes match your selection.</h3>
                        <p class="mt-1 text-sm">Please adjust your filters or contact us for custom plans.</p>
                    </div>
                `;
                return;
            }
 
            limitedModels.forEach(model => {

                let modelId = model.id;
                let modelTitle = model.title;
                // Calculate default pricing based on the model's size and style
                const defaultPricing = calculateDefaultPricing(modelId, modelTitle);
                const estimatedCost = defaultPricing.total;

                let card = document.createElement('article');
                card.setAttribute('itemscope', '');
                card.setAttribute('itemtype', 'http://schema.org/Product');
                card.classList.add(
                    'property-card', 'bg-[var(--color-white)]', 'rounded-xl', 'shadow-lg', 'overflow-hidden',
                    'flex', 'flex-col', 'transition-all', 'duration-300', 'hover:shadow-xl',
                    'hover:transform', 'hover:-translate-y-1'
                );
 
                card.innerHTML = `
                    <div class="relative w-full h-48 overflow-hidden group">
                        <iframe
                            src="https://my.matterport.com/show/?m=${model.id}&play=0&qs=1&f=0"
                            width="100%" height="100%"
                            frameborder="0"
                            allowfullscreen
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                            class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            aria-label="${model.title} 3D preview">
                        </iframe>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <!-- Removed title, style, and size from here as per instructions -->
                        </div>
                        <span class="absolute top-3 left-3 bg-gradient-to-br from-[var(--color-primary-orange)] to-[var(--color-hover-orange)] text-[var(--color-white)] text-xs font-bold px-3 py-1 rounded-full uppercase">${model.style}</span>
                        <span class="absolute top-3 right-3 bg-gradient-to-br from-[var(--color-primary-orange)] to-[var(--color-hover-orange)] text-[var(--color-white)] text-xs font-bold px-3 py-1 rounded-full uppercase">3D MODEL</span>
                        <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer view-tour-overlay"
                            data-model-id="${model.id}" data-model-title="${model.title}" data-estimated-cost="${model.cost}"
                            aria-label="View ${model.title} 3D tour">
                            <div class="bg-white/90 hover:bg-white transition-colors duration-200 rounded-full p-3 shadow-lg">
                                <svg class="w-8 h-8 text-[var(--color-primary-orange)]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="p-6 text-left flex-grow flex-col">
                        <h3 class="text-xl font-bold text-[var(--color-dark-primary)] mb-2 text-left" itemprop="name">${model.title}</h3>
                        <div class="flex items-center text-[var(--color-text-medium)] text-sm mb-4 space-x-4">
                            <span class="flex items-center"><i class="fas fa-home text-[var(--color-primary-orange)] mr-1" aria-hidden="true"></i> ${model.style}</span>
                            <span class="flex items-center"><i class="fas fa-ruler-combined text-[var(--color-primary-orange)] mr-1" aria-hidden="true"></i> ${model.size} sqft</span>
                        </div>
                        <p class="text-[var(--color-text-medium)] text-sm mb-3 flex-grow text-left">${model.description}</p>
                      
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs text-gray-500 text-left"><span class="text-xs text-gray-500">Starting from</span></p>
                                <p class="text-xl font-bold text-gray-900">$${Number(estimatedCost).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                            </div>

                            <button class="inline-flex items-center justify-center mt-5 px-4 py-2 rounded-lg bg-gradient-to-br from-[var(--color-primary-orange)] to-[var(--color-hover-orange)] text-white font-medium hover:from-[var(--color-hover-orange)] hover:to-[var(--color-primary-orange)] transition-all duration-200 view-3d-tour-home-btn focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                data-model-id="${model.id}"
                                data-model-title="${model.title}"
                                data-estimated-cost="${estimatedCost}"
                                aria-label="Explore ${model.title} 3D tour">
                                <i class="fas fa-eye mr-2" aria-hidden="true"></i> View Details
                            </button>
                        </div>
 
                    </div>
                `;
                propertyGridContainer.appendChild(card);
            });
 
            // Attach event listeners to all "Explore 3D Tour" buttons and overlays
            document.querySelectorAll('.view-3d-tour-home-btn, .view-tour-overlay').forEach(element => {
                element.addEventListener('click', (event) => {
                    let modelId = event.currentTarget.dataset.modelId;
                    let modelTitle = event.currentTarget.dataset.modelTitle;

                    // Calculate default pricing based on the model's size and style
                    const defaultPricing = calculateDefaultPricing(modelId, modelTitle);
                    const estimatedCost = defaultPricing.total;

                    // Now open the wizard modal and go to step 10
                    openWizardModal(viewerStep, modelId, modelTitle, estimatedCost);
                });
            });
        }
    
        // Function to calculate default pricing for a model
        function calculateDefaultPricing(modelId, modelTitle) {
        // Find the model in our data
        const model = MATTERPORT_MODELS.find(m => m.id === modelId);
        if (!model) return { total: 0 };
        
        // Create default selections for pricing calculation
        const defaultSelections = {
            styles: [model.style.toLowerCase()], // Ensure style is in lowercase
            size: model.size,
            sizeMin: model.size,
            sizeMax: model.size,
            stories: '1', // Default to 1 story
            garage: '2', // Default to 2-car garage
            bedrooms: '3', // Default to 3 bedrooms
            bathrooms: '2', // Default to 2 bathrooms
            kitchenType: 'standard', // Default to standard kitchen
            additionalRooms: [], // No additional rooms by default
            flooring: 'engineered', // Default flooring
            countertops: 'quartz', // Default countertops
            cabinets: 'standard', // Default cabinets
            appliances: 'standard', // Default appliances
            bathFixtures: 'standard', // Default bath fixtures
            isRenovation: false, // Default to new construction
            budgetMin: 0,
            budgetMax: 0,
            features: [],
            propertyAddress: ''
        };
        
        // Calculate costs with these default selections
        return calculateCosts(defaultSelections);
    }
    
    
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active state from all buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                    btn.setAttribute('tabindex', '-1');
                });
                // Add active state to clicked button
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                this.setAttribute('tabindex', '0');
    
                let filterValue = this.dataset.filter; // Get the filter value from data-filter attribute
    
                let filteredModels = [];
                if (filterValue === 'all') { // This is now the "Featured" button
                    filteredModels = MATTERPORT_MODELS; // Pass the full list to renderPropertyCards, which will slice to 6
                } else {
                    filteredModels = MATTERPORT_MODELS.filter(model => model.style === filterValue);
                }
                renderPropertyCards(filteredModels);
            });
        });
    
        // Initial fetch of listings
        fetchFeaturedListings();
    
        // Initial render of all properties for the main page
        renderPropertyCards(MATTERPORT_MODELS); // This will render the first 6 as "Featured" on load
    
    
        // Function to open the main wizard modal, with option to jump to a specific step/model
        function openWizardModal(initialStep = 1, modelId = null, modelTitle = null, estimatedCost = null) {
            styleSelectorModal.classList.remove('hidden');
            styleSelectorModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            mainContent_mp.setAttribute('aria-hidden', 'true');
    
            if (initialStep === viewerStep && modelId) {
                tourOpenedFromMainPage = true; // Set flag for direct tour viewing
                embedMatterportTourWizard(modelId, modelTitle, estimatedCost);
                progressFillWizardContainer.classList.add('hidden');
                showWizardStep(viewerStep);
    
            } else {
                tourOpenedFromMainPage = false; // Ensure flag is false for wizard flow
                showWizardStep(initialStep); // Default to step 1 or specified initial step
                progressFillWizardContainer.classList.remove('hidden');
            }
        }
    
        function closeWizardModal() {
            styleSelectorModal.classList.remove('open');
            styleSelectorModal.classList.add('hidden');
            document.body.style.overflow = '';
            mainContent_mp.setAttribute('aria-hidden', 'false');
            if (matterportViewerWizard) matterportViewerWizard.src = ''; // Stop tour if active
            // Reset wizard state to step 1 for next open
            currentStepWizard = 1;
        }
    
        function showSpinnerWizard(message = "Building Custom Selections...") {
            wizardHourglassSpinner.querySelector('p').textContent = message;
            wizardHourglassSpinner.classList.remove('hidden');
            wizardHourglassSpinner.classList.add('show');
        }
    
        function hideSpinnerWizard() {
            wizardHourglassSpinner.classList.remove('show');
            wizardHourglassSpinner.classList.add('hidden');
        }
    
        function updateWizardButtons() {
            // Standard back/next/submit for wizard flow
            wizardBackBtn.classList.toggle('hidden', currentStepWizard === 1 || currentStepWizard === viewerStep);
            wizardNextBtn.classList.toggle('hidden', currentStepWizard >= totalWizardQuestions || currentStepWizard >= galleryStep);
            wizardSubmitBtn.classList.toggle('hidden', currentStepWizard !== totalWizardQuestions);
            wizardCloseBtn.classList.toggle('hidden', currentStepWizard < galleryStep);
    
            // Specific buttons for viewer step (Step 10)
            if (currentStepWizard === viewerStep) {
                if (tourOpenedFromMainPage) {
                    wizardViewFeaturedGalleryBtn.classList.remove('hidden'); // Option to go back to main page gallery
                    wizardViewAllHomesBtn.classList.add('hidden'); // Hide wizard gallery button
                } else {
                    wizardViewAllHomesBtn.classList.remove('hidden'); // Option to go back to wizard gallery
                    wizardViewFeaturedGalleryBtn.classList.add('hidden'); // Hide main page gallery button
                }
                // Hide wizard navigation buttons when in viewer step
                wizardNextBtn.classList.add('hidden');
                wizardSubmitBtn.classList.add('hidden');
            } else {

                wizardViewAllHomesBtn.classList.add('hidden');
                wizardViewFeaturedGalleryBtn.classList.add('hidden');
            }
            // wizardContactQuoteBtn.classList.toggle('hidden', currentStepWizard !== viewerStep); 
        }
    
        function showWizardStep(stepNumber) {
            document.querySelectorAll('.wizard-step').forEach(step => {
                step.classList.add('hidden');
            });
            document.getElementById(`step-${stepNumber}`).classList.remove('hidden');
            currentStepWizard = stepNumber;
            updateWizardButtons();
    
            // Update progress indicator
            let progressPercentage = ((stepNumber - 1) / (totalStepsInIndicator - 1)) * 100;
            progressFillWizard.style.width = `${progressPercentage}%`;
    
            progressIndicatorsWizard.forEach(indicator => {
                let indicatorStep = parseInt(indicator.dataset.stepIndex);
                let stepNumberDiv = indicator.querySelector('div');
                let stepTextSpan = indicator.querySelector('span');
    
                if (indicatorStep <= stepNumber) {
                    indicator.classList.add('active-step');
                    stepNumberDiv.classList.remove('bg-gray-300', 'border-gray-300');
                    stepNumberDiv.classList.add('bg-orange-500', 'border-orange-500', 'text-white');
                    stepTextSpan.classList.add('text-gray-800');
                } else {
                    indicator.classList.remove('active-step');
                    stepNumberDiv.classList.remove('bg-orange-500', 'border-orange-500', 'text-white');
                    stepNumberDiv.classList.add('bg-gray-300', 'border-gray-300');
                    stepTextSpan.classList.remove('text-gray-800');
                }
            });
    
            if (wizardBottomContainer) {
                wizardBottomContainer.classList.remove('hidden'); 
    
                if (currentStepWizard <= totalWizardQuestions) {
                    wizardModalMainTitle.textContent = 'Find Your Perfect Home Style';
                    // wizardModalStepText.textContent = `Step ${currentStepWizard} of ${totalWizardQuestions}`;
                } else if (currentStepWizard === galleryStep) {
                    wizardModalMainTitle.textContent = 'Your Perfect Matches';
                    // wizardModalStepText.textContent = 'Showing Results';
                }
            }
    
            // Reset validation messages and button state for all steps
            styleSelectionMessage.classList.add('hidden');
            sizeSelectionMessage.classList.add('hidden');
            budgetSelectionMessage.classList.add('hidden');
            featuresSelectionMessage.classList.add('hidden');
            contactInfoMessage.classList.add('hidden');
            contactErroroMessage.classList.add('hidden');
            finishesError.classList.add('hidden');
            allowancesError.classList.add('hidden');
            roomsBathsError.classList.add('hidden'); // Hide rooms/baths error
            wizardNextBtn.disabled = false; // Re-enable by default, then disable if needed
    
            // Re-validate current step to set initial button state
            validateCurrentWizardStep();
            
            // If land on the gallery step, render it
            if (currentStepWizard === galleryStep) {
                renderMatterportGalleryWizard();
            }
            // If land on the viewerStep, hide progress indicatior
            if (currentStepWizard === viewerStep) {
                progressFillWizardContainer.classList.add('hidden');
                // Initialize tab menu for Step 10
                if (step10DetailsMenu && step10TabButtons.length > 0 && step10DetailSections.length > 0) {
                    // Hide all sections first
                    step10DetailSections.forEach(section => section.classList.add('hidden'));
                    // Deactivate all tabs
                    step10TabButtons.forEach(btn => {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-selected', 'false');
                        btn.setAttribute('tabindex', '-1'); // Set all to -1 initially
                    });
    
                    // Activate the first tab (Property Details) and show its section
                    const firstTab = document.getElementById('tab-property-details');
                    const firstSection = document.getElementById('section-property-details');
                    if (firstTab && firstSection) {
                        firstTab.classList.add('active');
                        firstTab.setAttribute('aria-selected', 'true');
                        firstTab.setAttribute('tabindex', '0'); // Set active tab to 0
                        firstSection.classList.remove('hidden');
                    }
                }
            }
        }
    
        async function submitWizardData() {
            showSpinnerWizard("Processing your selections...");

            try {
                const formData = new FormData();
                
                // Collect all form data
                document.querySelectorAll('input[name="styles"]:checked').forEach(checkbox => {
                    formData.append('styles[]', checkbox.value);
                });
                
                formData.append('size_min', document.getElementById('size-min').value || '0');
                formData.append('size_max', document.getElementById('size-max').value || '10000');
                formData.append('stories', document.querySelector('input[name="stories"]:checked')?.value || '1');
                formData.append('garage', document.querySelector('input[name="garage"]:checked')?.value || '0');

                // In submitWizardData():
                formData.append('bedrooms', document.querySelector('input[name="bedrooms"]:checked')?.value || '3');
                formData.append('bathrooms', document.querySelector('input[name="bathrooms"]:checked')?.value || '2');
                formData.append('kitchen_type', document.querySelector('input[name="kitchen-type"]:checked')?.value || 'standard');

                document.querySelectorAll('input[name="additional-rooms"]:checked').forEach(checkbox => {
                    formData.append('additional_rooms[]', checkbox.value);
                });
                
                formData.append('flooring', document.querySelector('input[name="flooring"]:checked')?.value || '');
                formData.append('countertops', document.querySelector('input[name="countertops"]:checked')?.value || '');
 
                formData.append('cabinets', document.querySelector('input[name="cabinets"]:checked')?.value || '');
                formData.append('appliances', document.querySelector('input[name="appliances"]:checked')?.value || '');
                formData.append('bath_fixtures', document.querySelector('input[name="bath-fixtures"]:checked')?.value || '');
 
 
                formData.append('budget_min', document.getElementById('budget-min').value || '0');
                formData.append('budget_max', document.getElementById('budget-max').value || '1000000');
                
                document.querySelectorAll('input[name="features"]:checked').forEach(checkbox => {
                    formData.append('features[]', checkbox.value);
                });
                
                formData.append('property_address', document.getElementById('property-address').value || '');
                formData.append('is_renovation', document.getElementById('is-renovation').checked ? '1' : '0');

                formData.append('contact_name', document.getElementById('contact-name').value || '');
                formData.append('contact_email', document.getElementById('contact-email').value || '');
                formData.append('contact_phone', document.getElementById('contact-phone').value || '');
                
                // File upload
                const fileInput = document.getElementById('survey-upload');
                if (fileInput.files.length > 0) {
                    formData.append('survey_file', fileInput.files[0]);
                }

                // calculated costs to form data
                const selections = getUserSelections();

                // If a model is selected, use its size for calculation
                if (currentModelId) {
                    const selectedModel = MATTERPORT_MODELS.find(model => model.id === currentModelId);
                    if (selectedModel) {
                        selections.size = selectedModel.size; // Add the model's size to selections
                        formData.append('selected_model[title]', selectedModel.title);
                        formData.append('selected_model[style]', selectedModel.style);
                        formData.append('selected_model[size]', selectedModel.size);
                        formData.append('selected_model[cost]', selectedModel.cost);
                    }
                }

                const calculatedCosts = calculateCosts(selections);

                // Add cost data to form submission
                formData.append('estimated_cost', calculatedCosts.total);
                formData.append('baseConstruction', calculatedCosts.baseConstruction);
                formData.append('garageCost', calculatedCosts.garage);
                                
                // Console log the data
                console.log('Form Data:', formData);
 
                const response = await fetch('https://dummyapi.com/wp-json/dummy-api/v1/send-search-data', { // Dummy API endpoint
                    method: 'POST',
                    headers: {
                        'X-WP-Nonce': 'dummy-nonce-value' // Dummy nonce
                    },
                    body: formData,
                });
 
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Server error');
                }
 
                const data = await response.json();
                hideSpinnerWizard();
                // console.log('Success:', data);   
                showWizardStep(galleryStep);
                
            } catch (error) {
                hideSpinnerWizard();
                console.error('Error:', error);
                alert('Submission failed: ' + error.message);
            }
        }


        function validateCurrentWizardStep() {
            let isValid = true;
            if (currentStepWizard === 1) {
                let areStylesSelected = document.querySelectorAll('input[name="styles"]:checked').length > 0;
                isValid = areStylesSelected;
                styleSelectionMessage.classList.toggle('hidden', isValid);
            } else if (currentStepWizard === 2) {
                let sizeMinInput = document.getElementById('size-min');
                let sizeMaxInput = document.getElementById('size-max');
                let storiesSelected = document.querySelector('input[name="stories"]:checked') !== null;
                let garageSelected = document.querySelector('input[name="garage"]:checked') !== null;
                
                isValid = sizeMinInput.value !== '' && 
                        sizeMaxInput.value !== '' && 
                        storiesSelected && 
                        garageSelected;
                
                sizeSelectionMessage.classList.toggle('hidden', isValid);
            } else if (currentStepWizard === 3) {
                const bedroomsSelected = document.querySelector('input[name="bedrooms"]:checked') !== null;
                const bathroomsSelected = document.querySelector('input[name="bathrooms']:checked') !== null;
                const kitchenTypeSelected = document.querySelector('input[name="kitchen-type']:checked') !== null;

                isValid = bedroomsSelected && bathroomsSelected && kitchenTypeSelected;
                roomsBathsError.classList.toggle('hidden', isValid);
                wizardNextBtn.disabled = !isValid; // Explicitly disable button if not valid

            } else if (currentStepWizard === 4) {
                // Finishes: Check if radio buttons are selected for flooring and countertops
                const flooringSelected = document.querySelector('input[name="flooring"]:checked') !== null;
                const countertopsSelected = document.querySelector('input[name="countertops"]:checked') !== null;
                isValid = flooringSelected && countertopsSelected;
                finishesError.classList.toggle('hidden', isValid);
            } else if (currentStepWizard === 5) {
                let budgetMinInput = document.getElementById('budget-min');
                let budgetMaxInput = document.getElementById('budget-max');
                isValid = budgetMinInput.value !== '' && budgetMaxInput.value !== '';
                budgetSelectionMessage.classList.toggle('hidden', isValid);
            } else if (currentStepWizard === 6) {
                // Allowances: Check if radio buttons are selected for cabinets, appliances, and bath-fixtures
                const cabinetsSelected = document.querySelector('input[name="cabinets"]:checked') !== null;
                const appliancesSelected = document.querySelector('input[name="appliances"]:checked') !== null;
                const bathFixturesSelected = document.querySelector('input[name="bath-fixtures']:checked') !== null;
                isValid = cabinetsSelected && appliancesSelected && bathFixturesSelected;
                allowancesError.classList.toggle('hidden', isValid);
            } else if (currentStepWizard === 7) {
                let areFeaturesSelected = document.querySelectorAll('input[name="features"]:checked').length > 0;
                isValid = areFeaturesSelected;
                featuresSelectionMessage.classList.toggle('hidden', isValid);
            } else if (currentStepWizard === 8) {
                // Validate contact information fields
                const nameInput = document.getElementById('contact-name');
                const emailInput = document.getElementById('contact-email');
                const phoneInput = document.getElementById('contact-phone');
                
                // Create or get the phone format display span
                let phoneFormatSpan = document.getElementById('phone-format-display');
                if (!phoneFormatSpan) {
                    phoneFormatSpan = document.createElement('span');
                    phoneFormatSpan.id = 'phone-format-display';
                    phoneFormatSpan.style.display = 'block';
                    phoneFormatSpan.style.marginTop = '5px';
                    phoneFormatSpan.style.fontSize = '0.7em';
                    phoneFormatSpan.style.color = '#666';
                    phoneInput.parentNode.appendChild(phoneFormatSpan);
                }
                
                // Reset validation state
                isValid = true;
                
                // Name validation
                if (nameInput.value.trim() === '') {
                    isValid = false;
                    nameInput.classList.add('error');
                } else {
                    nameInput.classList.remove('error');
                }
                
                // Email validation
                if (emailInput.value.trim() === '') {
                    isValid = false;
                    emailInput.classList.add('error');
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(emailInput.value.trim())) {
                        isValid = false;
                        emailInput.classList.add('error');
                    } else {
                        emailInput.classList.remove('error');
                    }
                }
                
                // Phone validation and formatting
                if (phoneInput.value.trim() !== '') {
                    const digitsOnly = phoneInput.value.replace(/\D/g, '');
                    
                    // Format the phone number display
                    let formattedPhone = '';
                    if (digitsOnly.length > 0) {
                        formattedPhone = `(${digitsOnly.substring(0, 3)}) ${digitsOnly.substring(3, 6)}-${digitsOnly.substring(6, 10)}`;
                    }
                    // phoneFormatSpan.textContent = formattedPhone;
                    phoneInput.value = formattedPhone;
                    phoneFormatSpan.textContent = '';
                    
                    if (digitsOnly.length === 10) {
                        const areaCode = digitsOnly.substring(0, 3);
                        const exchangeCode = digitsOnly.substring(3, 6);
                        
                        if (!/^[2-9]\d{2}$/.test(areaCode) || !/^[2-9]\d{2}$/.test(exchangeCode)) {
                            isValid = false;
                            phoneInput.classList.add('error');
                            phoneFormatSpan.style.color = '#ff0000';
                            phoneFormatSpan.textContent = 'Invalid area code or exchange number';
                        } else {
                            phoneInput.classList.remove('error');
                            phoneFormatSpan.style.color = '#666';
                        }
                    } else {
                        isValid = false;
                        phoneInput.classList.add('error');
                        phoneFormatSpan.style.color = '#ff0000';
                        if (digitsOnly.length > 0) {
                            phoneFormatSpan.textContent = 'Phone number must be 10 digits';
                        }
                    }
                } else {
                    // Phone is optional in this case
                    phoneInput.classList.remove('error');
                    phoneFormatSpan.textContent = '';
                }

                // Update UI
                contactInfoMessage.classList.toggle('hidden', isValid);
            }

            wizardNextBtn.disabled = !isValid;
            wizardSubmitBtn.disabled = !isValid; // Also disable submit if on last question step
            return isValid;
        }
    
        //  event listeners
        document.getElementById('contact-name').addEventListener('input', validateCurrentWizardStep);
        document.getElementById('contact-email').addEventListener('input', validateCurrentWizardStep);
        document.getElementById('contact-phone').addEventListener('input', validateCurrentWizardStep);
    
        // Update the processWizardStep function
        function processWizardStep() {
            if (!validateCurrentWizardStep()) {
                hideSpinnerWizard();
                return;
            }

            const nextBtn = document.getElementById('wizard-next-btn');
            const submitBtn = document.getElementById('wizard-submit-btn');
            const activeBtn = currentStepWizard === totalWizardQuestions ? submitBtn : nextBtn;
                    
            // Set loading state
            activeBtn.classList.add('btn-loading');
            activeBtn.disabled = true;
            
            // Show spinner in modal
            showSpinnerWizard(currentStepWizard === totalWizardQuestions ? 
                "Finding your perfect matches..." : 
                "Processing your selections...");

                setTimeout(() => {
                    hideSpinnerWizard();
                    showWizardStep(currentStepWizard + 1);
                    
                    // Restore button state
                    activeBtn.classList.remove('btn-loading');
                    // activeBtn.innerHTML = originalContent;
                    activeBtn.disabled = false;
                }, 800);
        }
    
            function getUserSelections() {
                // Helper function to safely get values
                const getValue = (selector) => {
                    const el = document.querySelector(selector);
                    return el ? el.value : null;
                };
    
                // Helper function to get checked radio values
                const getCheckedRadio = (name) => {
                    const radio = document.querySelector(`input[name="${name}"]:checked`);
                    return radio ? radio.value : '';
                };
    
                // Helper function to get checked checkboxes
                const getCheckedCheckboxes = (name) => {
                    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
                };
    
                return {
                    styles: getCheckedCheckboxes('styles'),
                    sizeMin: parseInt(getValue('#size-min')) || 0,
                    sizeMax: parseInt(getValue('#size-max')) || Infinity,
                    stories: getCheckedRadio('stories') || '1',
                    garage: getCheckedRadio('garage') || '2',
                    bedrooms: getCheckedRadio('bedrooms') || '3',
                    bathrooms: getCheckedRadio('bathrooms') || '2',
                    kitchenType: getCheckedRadio('kitchen-type') || 'standard',
                    additionalRooms: getCheckedCheckboxes('additional-rooms'),
                    flooring: getCheckedRadio('flooring') || '',
                    countertops: getCheckedRadio('countertops') || '',
                    cabinets: getCheckedRadio('cabinets') || '',
                    appliances: getCheckedRadio('appliances') || '',
                    bathFixtures: getCheckedRadio('bath-fixtures') || '',
                    budgetMin: parseInt(getValue('#budget-min')) || 0,
                    budgetMax: parseInt(getValue('#budget-max')) || Infinity,
                    features: getCheckedCheckboxes('features'),
                    propertyAddress: getValue('#property-address') || '',
                    isRenovation: document.getElementById('is-renovation') ? document.getElementById('is-renovation').checked : false
                };
            }
    
            // event listeners for the radio buttons
            document.querySelectorAll('input[name="stories"]').forEach(radio => {
                radio.addEventListener('change', validateCurrentWizardStep);
            });
    
            document.querySelectorAll('input[name="garage"]').forEach(radio => {
                radio.addEventListener('change', validateCurrentWizardStep);
            });
    
            // event listeners for step 3 radio buttons
            document.querySelectorAll('input[name="bedrooms"]').forEach(radio => {
                radio.addEventListener('change', validateCurrentWizardStep);
            });
            document.querySelectorAll('input[name="bathrooms"]').forEach(radio => {
                radio.addEventListener('change', validateCurrentWizardStep);
            });
            document.querySelectorAll('input[name="kitchen-type"]').forEach(radio => {
                radio.addEventListener('change', validateCurrentWizardStep);
            });
    
            async function isMatterportModelActive(modelId) {
                return true;
            }
    
            async function checkAndFilterMatterportModels() {
                let currentlyActiveModels = [];
                for (let model of MATTERPORT_MODELS) {
                    let isActive = await isMatterportModelActive(model.id);
                    if (isActive) {
                        currentlyActiveModels.push(model);
                    } else {
                        console.log(`Model ID: ${model.id} ("${model.title}") is not active or accessible and will be removed.`);
                    }
                }
                MATTERPORT_MODELS = currentlyActiveModels;
    
                if (currentStepWizard === galleryStep) {
                    renderMatterportGalleryWizard();
                }
            }
    
            function renderMatterportGalleryWizard() {
                showSpinnerWizard("Finding matching home styles...");
                let selections = getUserSelections();

                // Score all models
                let scoredModels = MATTERPORT_MODELS.map(model => {
                    let score = 0;
                    let isExactMatch = true;
                    
                    // Style match
                    if (selections.styles.length > 0 && !selections.styles.includes(model.style)) {
                        isExactMatch = false;
                        score += 30; // Base score for non-matching styles
                    } else {
                        score += 100;
                    }
                    
                    // Size match
                    if (model.size >= selections.sizeMin && model.size <= selections.sizeMax) {
                        score += 50;
                    } else {
                        isExactMatch = false;
                        let sizeDiff = Math.min(
                            Math.abs(model.size - selections.sizeMin),
                            Math.abs(model.size - selections.sizeMax)
                        );
                        score += Math.max(10, 50 - sizeDiff/100);
                    }
                    
                    // Budget match
                    if (model.cost >= selections.budgetMin && model.cost <= selections.budgetMax) {
                        score += 50;
                    } else {
                        isExactMatch = false;
                        let costDiff = Math.min(
                            Math.abs(model.cost - selections.budgetMin),
                            Math.abs(model.cost - selections.budgetMax)
                        );
                        score += Math.max(10, 50 - costDiff/10000);
                    }
                    
                    return { model, score, isExactMatch };
                });

                // Sort by exact match first, then by score
                scoredModels.sort((a, b) => {
                    if (a.isExactMatch !== b.isExactMatch) {
                        return b.isExactMatch - a.isExactMatch; // Exact matches first
                    }
                    return b.score - a.score; // Then by score
                });

                // Get top 10 models (or all available if less than 10)
                let topModels = scoredModels.slice(0, 10);
                let exactMatchesCount = topModels.filter(item => item.isExactMatch).length;

                // Clear UI
                matterportGalleryWizard.innerHTML = '';
                recommendedMatterportGallery.innerHTML = '';
                resultsIntroText.classList.remove('hidden');
                noResultsWizard.classList.add('hidden');

                if (topModels.length > 0) {
                    resultsIntroText.textContent = `Found ${exactMatchesCount} exact matches. Showing ${topModels.length} total suggestions.`;
                    
                    // Show ALL top models in the main gallery (no separation)
                    topModels.forEach(item => {
                        let card = createMatterportCard(item.model);
                        matterportGalleryWizard.appendChild(card);
                    });

                    // Hide recommendations section since showing all together
                    recommendedListingsContainer.classList.add('hidden');
                } else {
                    // No matches at all
                    noResultsWizard.classList.remove('hidden');
                    resultsIntroText.classList.add('hidden');
                    noResultsMessage.innerHTML = `
                        <i class="fas fa-info-circle text-[var(--color-primary-orange)] h-5 w-5 flex-shrink-0 mt-1"></i>
                        <span>
                            <span class="font-semibold">No models available.</span> <a href="/contact-us" class="text-[var(--color-primary-orange)] hover:underline font-medium">Contact us for custom options</a>.
                        </span>
                    `;
                }

                hideSpinnerWizard();

                // event listeners
                document.querySelectorAll('.view-tour-btn, .view-tour-overlay').forEach(element => {
                    element.addEventListener('click', async (event) => {
                        event.preventDefault(); // Prevent default behavior if needed
                        
                        const modelId = event.currentTarget.dataset.modelId;
                        const modelTitle = event.currentTarget.dataset.modelTitle;
                        const estimatedCost = event.currentTarget.dataset.estimatedCost;
                        tourOpenedFromMainPage = false;
                        currentModelId=modelId;
                        
                        const activeBtn = event.currentTarget; // Get reference to clicked button
                        
                        try {
                            // Show loading state
                            activeBtn.classList.add('btn-loading');
                            activeBtn.disabled = true;
                            
                            // First submit the wizard data
                            await submitWizardData();
                            
                            // Then proceed with the tour embedding
                            embedMatterportTourWizard(modelId, modelTitle, estimatedCost);
                            showWizardStep(viewerStep);
                            
                            // alert('Submitted wizard data successfully');
                        } catch (error) {
                            console.error('Error:', error);
                            alert('Submission failed: ' + error.message);
                        } finally {
                            // Always restore button state
                            activeBtn.classList.remove('btn-loading');
                            activeBtn.disabled = false;
                        }
                    });
                });
            }
    
            function createMatterportCard(model) {
                let modelId = model.id;
                console.log(`Model ID: ${modelId}`);
                let modelTitle = model.title;
                console.log(`Model Title: ${modelTitle}`);

                // Get user selections
                const userSelections = getUserSelections();
                
                // Apply model-specific values to user selections
                const modelBasedSelections = {
                    ...userSelections,
                    styles: [model.style.toLowerCase()], // Use model's style
                    size: model.size,                    // Use model's size
                    sizeMin: model.size,                 // Use model's size as min
                    sizeMax: model.size                  // Use model's size as max
                };

                // Calculate costs with user selections + model specifics
                const calculatedCosts = calculateCosts(modelBasedSelections);
                const estimatedCost = calculatedCosts.total;
                console.log(`Model estimatedCost: ${estimatedCost}`);

                let card = document.createElement('div');
                card.classList.add(
                    'bg-white', 'rounded-xl', 'shadow-md', 'overflow-hidden',
                    'transition-all', 'duration-300', 'hover:shadow-xl',
                    'hover:transform', 'hover:-translate-y-1', 'border',
                    'border-gray-100', 'relative'
                );

                card.innerHTML = `
                    <div class="relative w-full h-48 overflow-hidden group">
                        <iframe
                            src="https://my.matterport.com/show/?m=${model.id}&play=0&qs=1&f=0"
                            width="100%" height="100%"
                            frameborder="0"
                            allowfullscreen
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                            class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            aria-label="${model.title} 3D preview">
                        </iframe>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <!-- Removed title, style, and size from here as per instructions -->
                        </div>

                        <span class="absolute top-3 left-3 bg-gradient-to-br from-[var(--color-primary-orange)] to-[var(--color-hover-orange)] text-[var(--color-white)] text-xs font-bold px-3 py-1 rounded-full uppercase">${model.style}</span>
                        <span class="absolute top-3 right-3 bg-gradient-to-br from-[var(--color-primary-orange)] to-[var(--color-hover-orange)] text-[var(--color-white)] text-xs font-bold px-3 py-1 rounded-full uppercase">3D MODEL</span>
                        <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer view-tour-overlay"
                            data-model-id="${model.id}" 
                            data-model-title="${model.title}" 
                            data-estimated-cost="${estimatedCost}"
                            aria-label="Explore ${model.title} 3D tour">
                            <div class="bg-white/90 hover:bg-white transition-colors duration-200 rounded-full p-3 shadow-lg">
                                <svg class="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="p-5">
                        <h3 class="text-xl font-bold text-[var(--color-dark-primary)] mb-2 text-left">${model.title}</h3>
                        <div class="flex items-center text-[var(--color-text-medium)] text-sm mb-4 space-x-4">
                            <span class="flex items-center"><i class="fas fa-home text-[var(--color-primary-orange)] mr-1" aria-hidden="true"></i> ${model.style}</span>
                            <span class="flex items-center"><i class="fas fa-ruler-combined text-[var(--color-primary-orange)] mr-1" aria-hidden="true"></i> ${model.size} sqft</span>
                        </div>
                        <div class="mb-4">
                            <p class="text-[var(--color-text-medium)] text-sm mb-3 flex-grow text-left">${model.description}</p>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-xs text-gray-500 text-left">Starting from</p>
                                <p class="text-xl font-bold text-gray-900">$${Number(estimatedCost).toLocaleString('en-US', {maximumFractionDigits: 0})}</p>
                            </div>
                            <button class="inline-flex items-center justify-center mt-5 px-4 py-2 rounded-lg bg-gradient-to-br from-[var(--color-primary-orange)] to-[var(--color-hover-orange)] text-white font-medium hover:from-[var(--color-hover-orange)] hover:to-[var(--color-primary-orange)] transition-all duration-200 view-tour-btn focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                data-model-id="${model.id}"
                                data-model-title="${model.title}"
                                data-estimated-cost="${estimatedCost}"
                                aria-label="Explore ${model.title} 3D tour">
                                <i class="fas fa-eye mr-2" aria-hidden="true"></i> View Details
                            </button>
                        </div>
                    </div>
                `;
                return card;
            }
    
            function calculateCosts(formData) {
                    const costs = {};
                    
                    // Use the model's size for calculation
                    let totalSquareFootage = formData.size || formData.sizeMax || 0;
                    let numBathrooms = parseFloat(formData.bathrooms) || 0;
                    
                    // Safely get style with fallback
                    let style = 'traditional';
                    if (formData.styles && formData.styles.length > 0) {
                        style = (typeof formData.styles[0] === 'string') ? formData.styles[0].toLowerCase() : 'traditional';
                    }
                    
                    // Base construction cost
                    costs.baseConstruction = totalSquareFootage * pricingData.baseCostPerSqFt * 
                                        (pricingData.styleMultipliers[style] || 1.0) * 
                                        (pricingData.storiesMultiplier[formData.stories] || 1.0);
                    
                    // Garage cost
                    costs.garage = pricingData.garageCost[formData.garage] || 0;
                    
                    // Bedrooms cost
                    costs.bedrooms = pricingData.bedroomCost[formData.bedrooms] || 0;
                    
                    // Bathrooms cost
                    costs.bathrooms = (pricingData.bathroomCost[formData.bathrooms] || 0);
                    
                    // Kitchen cost
                    costs.kitchen = pricingData.kitchenTypeCost[formData.kitchenType] || 0;
                    
                    // Additional rooms
                    costs.additionalRooms = 0;
                    if (formData.additionalRooms && formData.additionalRooms.length > 0) {
                        formData.additionalRooms.forEach(room => {
                            costs.additionalRooms += (pricingData.additionalRooms[room] || 0);
                        });
                    }
                    
                    // Finishes with default values
                    const flooringType = formData.flooring || 'N/A';
                    costs.flooring = flooringType !== 'N/A' ? 
                        totalSquareFootage * (pricingData.flooringCost[formData.flooring] || 0) : 
                        0;
                    
                    const countertopsType = formData.countertops || 'N/A';
                    costs.countertops = countertopsType !== 'N/A' ? 
                        50 * (pricingData.countertopsCost[formData.countertops] || 0) : 
                        0;
                    
                    // Allowances with default values
                    const cabinetsType = formData.cabinets || 'N/A';
                    costs.cabinets = cabinetsType !== 'N/A' ? 
                        (pricingData.cabinetsAllowance[formData.cabinets] || 0) : 
                        0;
                    
                    const appliancesType = formData.appliances || 'N/A';
                    costs.appliances = appliancesType !== 'N/A' ? 
                        (pricingData.appliancesAllowance[formData.appliances] || 0) : 
                        0;
                    
                    const bathFixturesType = formData.bathFixtures || 'N/A';
                    costs.bathFixtures = bathFixturesType !== 'N/A' ? 
                        numBathrooms * (pricingData.bathFixturesAllowance[formData.bathFixtures] || 0) : 
                        0;
                    
                    // Total cost before renovation adjustment
                    costs.subtotal = costs.baseConstruction + costs.garage + costs.bedrooms + 
                                costs.bathrooms + costs.kitchen + costs.additionalRooms + 
                                costs.flooring + costs.countertops + costs.cabinets + 
                                costs.appliances + costs.bathFixtures;
    
                    // Apply renovation adjustment if applicable
                    if (formData.isRenovation) {
                        costs.renovationAdjustment = costs.subtotal * 0.3; // 30% reduction for renovation
                        costs.total = costs.subtotal - costs.renovationAdjustment;
                    } else {
                        costs.renovationAdjustment = 0;
                        costs.total = costs.subtotal;
                    }
                    
                    // Add the selection types to the costs object for display
                    costs.selections = {
                        flooring: flooringType,
                        countertops: countertopsType,
                        cabinets: cabinetsType,
                        appliances: appliancesType,
                        bathFixtures: bathFixturesType
                    };
                    
                    return costs;
            }
    
            function embedMatterportTourWizard(modelId, title, cost) {
                currentModelId = modelId; // Store the model ID
                // Get user selections or use defaults when viewing from main page
                let userSelections = tourOpenedFromMainPage ? {
                    styles: [],
                    size: 0,
                    sizeMin: 0,
                    sizeMax: 0,
                    stories: '1',
                    garage: '2',
                    bedrooms: '3',
                    bathrooms: '2',
                    kitchenType: 'standard',
                    additionalRooms: [],
                    flooring: 'engineered', // Default flooring
                    countertops: 'quartz', // Default countertops
                    cabinets: 'standard', // Default cabinets
                    appliances: 'standard', // Default appliances
                    bathFixtures: 'standard', // Default bath fixtures
                    isRenovation: false,
                    budgetMin: 0,
                    budgetMax: 0,
                    features: [],
                    propertyAddress: ''
                } : getUserSelections();
    
                let parsedCost = typeof cost === 'number' ? cost : parseFloat(String(cost).replace(/,/g, ''));
    
                if (isNaN(parsedCost)) {
                    console.error("Invalid cost provided to embedMatterportTourWizard:", cost);
                    wizardEstimatedCost.textContent = 'Error';
                    wizardCostDetails.innerHTML = '<p class="text-red-500">Could not calculate costs.</p>';
                    return;
                }
    
                // Find the full model object
                let selectedModel = MATTERPORT_MODELS.find(model => model.id === modelId);
                if (!selectedModel) {
                    console.error("Model not found:", modelId);
                    return;
                }
    
                // Update the selections with the model's actual size
                userSelections.size = selectedModel.size;
                userSelections.styles = [selectedModel.style.toLowerCase()];
    
                // Calculate costs with the updated selections
                const calculatedCosts = calculateCosts(userSelections);
    
                // Format currency
                let formatCurrency = (amount) => {
                    return '$' + amount.toLocaleString('en-US');
                };
    
                // Set the floor plan image if available
                if (selectedModel.floor_img_link) {
                    floorPlanImage.src = selectedModel.floor_img_link;
                    floorPlanImage.alt = `${selectedModel.title} Floor Plan`;
                    downloadFloorPlanBtn.style.display = 'flex';
                } else {
                    floorPlanImage.src = 'https://placehold.co/600x400?text=Floor+Plan+Not+Available'; // Fallback image
                    floorPlanImage.alt = 'Floor plan not available';
                    downloadFloorPlanBtn.style.display = 'none';
                }
    
                // model style display in the title
                if (wizardSelectedModelTitle) {
                    wizardSelectedModelTitle.innerHTML = `
                         <span class="inline-flex items-center bg-[var(--color-primary-orange)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                    <i class="fas fa-home text-white text-[10px] mr-1.5" aria-hidden="true"></i>
                                    <span id="wizard-model-style"> ${selectedModel.style} </span>
                                </span>
                                <span class="inline-flex items-center text-xs text-gray-600 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200">
                                    <i class="fas fa-ruler-combined text-gray-500 text-[10px] mr-1.5" aria-hidden="true"></i>
                                    <span id="wizard-model-size"> ${selectedModel.size} sqft</span>
                                </span>
                                <span class="inline-flex items-center text-xs text-gray-600 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200">
                                    <i class="fas fa-dollar-sign text-gray-500 text-[10px] mr-1" aria-hidden="true"></i>
                                    <span id="wizard-model-price">${Number(calculatedCosts.total).toLocaleString('en-US', {maximumFractionDigits: 0})} </span>
                                </span>
                    `;
                }
    
                // Populate detail elements for Step 10
                if (wizardModalDescriptionElement) wizardModalDescriptionElement.textContent = selectedModel.description;
    
                if (wizardModalFeaturesContainer) {
                    wizardModalFeaturesContainer.innerHTML = ''; // Clear previous features
                    const hardcodedFeatures = ["Open Concept", "Smart Home", "Pool", "Large Porch"];
                    hardcodedFeatures.forEach(feature => {
                        let span = document.createElement('span');
                        span.classList.add('inline-flex', 'items-center', 'px-3', 'py-1', 'rounded-full', 'text-xs', 'font-medium', 'bg-orange-100', 'text-orange-800');
                        
                        let iconClass = '';
                        switch(feature) {
                            case 'Open Concept': iconClass = 'fas fa-expand'; break;
                            case 'Smart Home': iconClass = 'fas fa-house-signal'; break;
                            case 'Pool': iconClass = 'fas fa-swimming-pool'; break;
                            case 'Large Porch': iconClass = 'fas fa-chair'; break;
                            default: iconClass = 'fas fa-star'; // Default icon
                        }
                        span.innerHTML = `<i class="${iconClass} mr-1.5" aria-hidden="true"></i> ${feature}`;
                        wizardModalFeaturesContainer.appendChild(span);
                    });
                }
    
                if (userSelectionsSummary) {
                    // Format the styles list
                    const stylesList = userSelections.styles.length > 0 ? 
                        userSelections.styles.join(', ') : 'Not specified';
                    
                    // Format the size range
                    const sizeRange = userSelections.sizeMin && userSelections.sizeMax ?
                        `${userSelections.sizeMin.toLocaleString()} - ${userSelections.sizeMax.toLocaleString()} sq ft` : 
                        'Not specified';
                    
                    // Format the budget range
                    const budgetRange = userSelections.budgetMin && userSelections.budgetMax ?
                        `$${userSelections.budgetMin.toLocaleString()} - $${userSelections.budgetMax.toLocaleString()}` : 
                        'Not specified';
                    
                    // Format additional rooms
                    const additionalRoomsList = userSelections.additionalRooms.length > 0 ?
                        userSelections.additionalRooms.join(', ') : 'None';
                    
                    // Format features list
                    const featuresList = userSelections.features.length > 0 ?
                        userSelections.features.join(', ') : 'None';
                    
                    // Format project type
                    const projectType = userSelections.isRenovation ? 'Renovation' : 'New Construction';
                    
                    userSelectionsSummary.innerHTML = `
                    <div id="section-property-details" class="details-section space-y-6">
                        <div class="bg-white rounded-xl shadow-sm p-6">
                            
                            <div class="mb-6">
                                <p class="text-gray-600" id="wizard-modal-description">
                                    ${selectedModel.description || 'A beautifully designed home that perfectly matches your specifications.'}
                                </p>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-archway text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Architectural Style</p>
                                            <p class="font-medium text-gray-800" id="wizard-modal-style">${selectedModel.style || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-ruler-combined text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Total Living Area</p>
                                            <p class="font-medium text-gray-800"><span id="wizard-modal-size">${selectedModel.size ? selectedModel.size.toLocaleString() : '0'}</span> sq ft</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-sm p-6">
                            <div class="flex items-center mb-6 pb-4 border-b border-gray-100">
                                <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                                    <i class="fas fa-sliders-h text-orange-500" aria-hidden="true"></i>
                                </div>
                                <h3 class="text-xl font-bold text-gray-800">Your Custom Selections</h3>
                            </div>
                            
                            <div id="user-selections-summary" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-palette text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Preferred Styles</p>
                                            <p class="font-medium text-gray-800">${userSelections.styles.length > 0 ? userSelections.styles.map(style => style.charAt(0).toUpperCase() + style.slice(1)).join(', ') : 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-ruler text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Size Range</p>
                                            <p class="font-medium text-gray-800">${userSelections.sizeMin && userSelections.sizeMax ? 
                                                `${userSelections.sizeMin.toLocaleString()} - ${userSelections.sizeMax.toLocaleString()} sq ft` : 
                                                'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-bed text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Bedrooms</p>
                                            <p class="font-medium text-gray-800">${userSelections.bedrooms || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-bath text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Bathrooms</p>
                                            <p class="font-medium text-gray-800">${userSelections.bathrooms || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
    
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-building text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Stories</p>
                                            <p class="font-medium text-gray-800">${userSelections.stories || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-car text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Garage</p>
                                            <p class="font-medium text-gray-800">${userSelections.garage === '0' ? 'No Garage' : `${userSelections.garage}-Car`}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-utensils text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Kitchen Type</p>
                                            <p class="font-medium text-gray-800">${userSelections.kitchenType ? userSelections.kitchenType.charAt(0).toUpperCase() + userSelections.kitchenType.slice(1) : 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-plus-square text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Additional Rooms</p>
                                            <p class="font-medium text-gray-800">${userSelections.additionalRooms.length > 0 ? 
                                                userSelections.additionalRooms.map(room => room.charAt(0).toUpperCase() + room.slice(1)).join(', ') : 
                                                'None'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-home text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Flooring</p>
                                            <p class="font-medium text-gray-800">${userSelections.flooring ? userSelections.flooring.charAt(0).toUpperCase() + userSelections.flooring.slice(1) : 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-gem text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Countertops</p>
                                            <p class="font-medium text-gray-800">${userSelections.countertops ? userSelections.countertops.charAt(0).toUpperCase() + userSelections.countertops.slice(1) : 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-dollar-sign text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Budget Range</p>
                                            <p class="font-medium text-gray-800">${userSelections.budgetMin && userSelections.budgetMax ? 
                                                `$${userSelections.budgetMin.toLocaleString()} - $${userSelections.budgetMax.toLocaleString()}` : 
                                                'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-map-marker-alt text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Preferred Location</p>
                                            <p class="font-medium text-gray-800">
                                                ${userSelections.propertyAddress ? userSelections.propertyAddress : 'All Areas'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
    
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-list text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-sm font-medium text-gray-500">Must Have Features</p>
                                            <p class="text-gray-800">${userSelections.features.length > 0 ? 
                                                userSelections.features.map(feature => feature.charAt(0).toUpperCase() + feature.slice(1)).join(', ') : 
                                                'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
    
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <div class="flex items-start">
                                        <div class="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3 mt-1">
                                            <i class="fas fa-tools text-orange-500 text-sm" aria-hidden="true"></i>
                                        </div>
                                        <div>
                                            <p class="text-xs font-medium text-gray-500 mb-1">Project Type</p>
                                            <p class="font-medium text-gray-800">${userSelections.isRenovation ? 'Renovation' : 'New Construction'}</p>
                                        </div>
                                    </div>
                                </div>
    
                            </div>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-sm p-6">
                            <div class="flex items-center mb-6 pb-4 border-b border-gray-100">
                                <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                                    <i class="fas fa-star text-orange-500" aria-hidden="true"></i>
                                </div>
                                <h3 class="text-xl font-bold text-gray-800">Key Features</h3>
                            </div>
                            
                            <div id="wizard-modal-features" class="flex flex-wrap gap-3">
                                ${selectedModel.features && selectedModel.features.length > 0 ? 
                                    selectedModel.features.map(feature => `
                                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                            <i class="${getFeatureIcon(feature)} mr-1.5" aria-hidden="true"></i>
                                            ${feature}
                                        </span>
                                    `).join('') : 
                                    '<p class="text-gray-500">No special features specified</p>'}
                            </div>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-sm p-6">
                            <div class="flex items-start">
                                <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4 mt-1">
                                    <i class="fas fa-map-marked-alt text-orange-500" aria-hidden="true"></i>
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-lg font-bold text-gray-800 mb-2">Property Documents</h3>
                                    <div id="survey-link" class="mt-2">
                                        <a href="https://dummy-survey-records.com/search/parcels?searchString=location" target="_blank" class="inline-flex items-center text-orange-600 hover:text-orange-800">
                                            <i class="fas fa-external-link-alt mr-2" aria-hidden="true"></i>
                                            <span id="survey-link-text">View dummy property survey records</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                }
    
    
                // Build cost details HTML with enhanced styling
                wizardCostDetails.innerHTML = `
                    <div class="space-y-4">
                        <!-- Base Construction -->
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                    <i class="fas fa-home text-orange-500 text-sm" aria-hidden="true"></i>
                                </div>
                                <div>
                                    <span class="text-gray-700">Base Construction</span>
                                    <p class="text-xs text-gray-500 mt-1">Includes foundation, framing, roofing, and basic exterior finishes</p>
                                </div>
                            </div>
                            <span class="font-medium text-gray-900">${formatCurrency(calculatedCosts.baseConstruction)}</span>
                        </div>
    
                        <!-- Garage -->
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                    <i class="fas fa-warehouse text-orange-500 text-sm" aria-hidden="true"></i>
                                </div>
                                <div>
                                    <span class="text-gray-700">${userSelections.garage === '0' ? 'No Garage' : `${userSelections.garage}-Car Garage`}</span>
                                    <p class="text-xs text-gray-500 mt-1">${userSelections.garage === '0' ? 'No garage included' : 
                                        `Includes ${userSelections.garage} garage bay(s) with automatic opener, drywall finish, and epoxy-coated concrete flooring`}</p>
                                </div>
                            </div>
                            <span class="font-medium text-gray-900">${formatCurrency(calculatedCosts.garage)}</span>
                        </div>
    
                        <!-- Bedrooms -->
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                    <i class="fas fa-bed text-orange-500 text-sm" aria-hidden="true"></i>
                                </div>
                                <div>
                                    <span class="text-gray-700">${userSelections.bedrooms} Bedrooms</span>
                                    <p class="text-xs text-gray-500 mt-1">Includes ${userSelections.bedrooms} bedrooms with ${calculatedCosts.selections.flooring.charAt(0).toUpperCase() + calculatedCosts.selections.flooring.slice(1)} flooring, 
                                    pre-wired for ceiling fans, and basic closet organization</p>
                                </div>
                            </div>
                            <span class="font-medium text-gray-900">${formatCurrency(calculatedCosts.bedrooms)}</span>
                        </div>
    
                        <!-- Bathrooms -->
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                    <i class="fas fa-bath text-orange-500 text-sm" aria-hidden="true"></i>
                                </div>
                                <div>
                                    <span class="text-gray-700">${userSelections.bathrooms} Bathrooms</span>
                                    <p class="text-xs text-gray-500 mt-1">Includes ${userSelections.bathrooms} full baths with ${calculatedCosts.selections.bathFixtures.charAt(0).toUpperCase() + calculatedCosts.selections.bathFixtures.slice(1)} fixtures, 
                                    ceramic tile flooring, and ${calculatedCosts.selections.countertops.charAt(0).toUpperCase() + calculatedCosts.selections.countertops.slice(1)} vanity tops</p>
                                </div>
                            </div>
                            <span class="font-medium text-gray-900">${formatCurrency(calculatedCosts.bathrooms)}</span>
                        </div>
    
                        <!-- Kitchen -->
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                    <i class="fas fa-kitchen-set text-orange-500 text-sm" aria-hidden="true"></i>
                                </div>
                                <div>
                                    <span class="text-gray-700">${userSelections.kitchenType.charAt(0).toUpperCase() + userSelections.kitchenType.slice(1)} Kitchen</span>
                                    <p class="text-xs text-gray-500 mt-1">
                                        ${userSelections.kitchenType === 'basic' ? 'Standard layout with laminate countertops and stock cabinets' : 
                                        userSelections.kitchenType === 'standard' ? 'Upgraded layout with quartz countertops and semi-custom cabinets' : 
                                        userSelections.kitchenType === 'gourmet' ? 'Chef-inspired kitchen with premium appliances and custom cabinetry' : 
                                        'Luxury kitchen with high-end appliances, custom cabinetry, and premium finishes'}
                                    </p>
                                </div>
                            </div>
                            <span class="font-medium text-gray-900">${formatCurrency(calculatedCosts.kitchen)}</span>
                        </div>
    
                        ${userSelections.additionalRooms.length > 0 ? `
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                    <i class="fas fa-plus text-orange-500 text-sm" aria-hidden="true"></i>
                                </div>
                                <div>
                                    <span class="text-gray-700">Additional Rooms</span>
                                    <p class="text-xs text-gray-500 mt-1">Includes ${userSelections.additionalRooms.map(room => room.charAt(0).toUpperCase() + room.slice(1)).join(', ')} with matching ${calculatedCosts.selections.flooring.charAt(0).toUpperCase() + calculatedCosts.selections.flooring.slice(1)} flooring</p>
                                </div>
                            </div>
                            <span class="font-medium text-gray-900">${formatCurrency(calculatedCosts.additionalRooms)}</span>
                        </div>
                        ` : ''}
    
                        <!-- Flooring -->
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                    <i class="fas fa-brush text-orange-500 text-sm" aria-hidden="true"></i>
                                </div>
                                <div>
                                    <span class="text-gray-700">Flooring (${calculatedCosts.selections.flooring.charAt(0).toUpperCase() + calculatedCosts.selections.flooring.slice(1)})</span>
                                    <p class="text-xs text-gray-500 mt-1">
                                        ${calculatedCosts.selections.flooring === 'laminate' ? 'Durable laminate flooring throughout main living areas' : 
                                        calculatedCosts.selections.flooring === 'engineered' ? 'Premium engineered hardwood in main areas, tile in wet areas' : 
                                        calculatedCosts.selections.flooring === 'hardwood' ? 'Solid hardwood flooring throughout main living areas' : 
                                        'Ceramic or porcelain tile flooring in all areas'}
                                    </p>
                                </div>
                            </div>
                            <span class="font-medium text-gray-900">${formatCurrency(calculatedCosts.flooring)}</span>
                        </div>
                        
                        <!-- Countertops -->
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                    <i class="fas fa-cube text-orange-500 text-sm" aria-hidden="true"></i>
                                </div>
                                <div>
                                    <span class="text-gray-700">Countertops (${calculatedCosts.selections.countertops.charAt(0).toUpperCase() + calculatedCosts.selections.countertops.slice(1)})</span>
                                    <p class="text-xs text-gray-500 mt-1">
                                        ${calculatedCosts.selections.countertops === 'laminate' ? 'Standard laminate countertops in kitchen and baths' : 
                                        calculatedCosts.selections.countertops === 'quartz' ? 'Premium quartz countertops with integrated sinks' : 
                                        calculatedCosts.selections.countertops === 'granite' ? 'Natural granite countertops with polished finish' : 
                                        'Luxury marble countertops with sealed finish'}
                                    </p>
                                </div>
                            </div>
                            <span class="font-medium text-gray-900">${formatCurrency(calculatedCosts.countertops)}</span>
                        </div>
                        
                        <!-- Kitchen Cabinets -->
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                    <i class="fas fa-archive text-orange-500 text-sm" aria-hidden="true"></i>
                                </div>
                                <div>
                                    <span class="text-gray-700">Kitchen Cabinets (${calculatedCosts.selections.cabinets.charAt(0).toUpperCase() + calculatedCosts.selections.cabinets.slice(1)})</span>
                                    <p class="text-xs text-gray-500 mt-1">
                                        ${calculatedCosts.selections.cabinets === 'basic' ? 'Stock cabinets with standard hardware and laminate finish' : 
                                        calculatedCosts.selections.cabinets === 'standard' ? 'Semi-custom cabinets with soft-close hinges and painted finish' : 
                                        'Custom cabinetry with premium hardware, dovetail drawers, and specialty finishes'}
                                    </p>
                                </div>
                            </div>
                            <span class="font-medium text-gray-900">${formatCurrency(calculatedCosts.cabinets)}</span>
                        </div>
                        
                        <!-- Appliances -->
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                    <i class="fas fa-blender text-orange-500 text-sm" aria-hidden="true"></i>
                                </div>
                                <div>
                                    <span class="text-gray-700">Appliances (${calculatedCosts.selections.appliances.charAt(0).toUpperCase() + calculatedCosts.selections.appliances.slice(1)})</span>
                                    <p class="text-xs text-gray-500 mt-1">
                                        ${calculatedCosts.selections.appliances === 'basic' ? 'Standard appliance package including refrigerator, range, microwave, and dishwasher' : 
                                        calculatedCosts.selections.appliances === 'standard' ? 'Upgraded stainless steel appliances with energy-efficient ratings' : 
                                        'Professional-grade appliance suite with smart features and premium finishes'}
                                    </p>
                                </div>
                            </div>
                            <span class="font-medium text-gray-900">${formatCurrency(calculatedCosts.appliances)}</span>
                        </div>
                        
                        <!-- Bathroom Fixtures -->
                        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                    <i class="fas fa-toilet text-orange-500 text-sm" aria-hidden="true"></i>
                                </div>
                                <div>
                                    <span class="text-gray-700">Bathroom Fixtures (${calculatedCosts.selections.bathFixtures.charAt(0).toUpperCase() + calculatedCosts.selections.bathFixtures.slice(1)})</span>
                                    <p class="text-xs text-gray-500 mt-1">
                                        ${calculatedCosts.selections.bathFixtures === 'basic' ? 'Standard chrome fixtures with single-handle controls' : 
                                        calculatedCosts.selections.bathFixtures === 'standard' ? 'Upgraded brushed nickel fixtures with water-saving features' : 
                                        'Luxury fixtures with thermostatic controls, rainfall showerheads, and designer finishes'}
                                    </p>
                                </div>
                            </div>
                            <span class="font-medium text-gray-900">${formatCurrency(calculatedCosts.bathFixtures)}</span>
                        </div>
    
                        ${userSelections.isRenovation ? `
                        <div class="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                    <i class="fas fa-tools text-orange-500 text-sm" aria-hidden="true"></i>
                                </div>
                                <div>
                                    <span class="text-gray-700">Renovation Adjustment</span>
                                    <p class="text-xs text-gray-500 mt-1">Credit for existing structure and reusable elements</p>
                                </div>
                            </div>
                            <span class="font-medium text-orange-600">-${formatCurrency(calculatedCosts.renovationAdjustment)}</span>
                        </div>
                        ` : ''}
    
                        <div class="mt-6 pt-4 border-t border-gray-200">
                            <div class="flex justify-between items-center">
                                <span class="text-lg font-semibold text-gray-800">Total Estimated Cost</span>
                                <span class="text-2xl font-bold text-[var(--color-primary-orange)]">${formatCurrency(calculatedCosts.total)}</span>
                            </div>
                            <p class="text-xs text-gray-500 mt-2 italic">
                                Note: Final costs depend on site-specific factors, materials, and customizations.
                                All specifications are subject to change based on availability and final design.
                            </p>
                        </div>
                    </div>
                `;
    
                // Set up the viewer
                matterportViewerWizard.src = `https://my.matterport.com/show/?m=${modelId}&play=1&help=1&qs=1&mls=1&brand=0&log=0&dh=1&floorplan=1`;
    
                // wizardSelectedModelTitle.textContent = title;
                wizardEstimatedCost.textContent = formatCurrency(calculatedCosts.total);
    
                wizardModalMainTitle.textContent = title; // Main title remains static
    
            }
    
            // Helper function to get appropriate icons for features
            function getFeatureIcon(feature) {
                const iconMap = {
                    'Open Concept': 'fas fa-expand',
                    'Smart Home': 'fas fa-house-signal',
                    'Pool': 'fas fa-swimming-pool',
                    'Outdoor Living': 'fas fa-umbrella-beach',
                    'Energy Efficient': 'fas fa-solar-panel',
                    'Hurricane Resistant': 'fas fa-wind',
                    'Home Office': 'fas fa-laptop-house',
                    'Gourmet Kitchen': 'fas fa-utensils',
                    'Master Suite': 'fas fa-bed',
                    'Walk-in Closet': 'fas fa-tshirt',
                    'Smart Lighting': 'fas fa-lightbulb',
                    'Home Theater': 'fas fa-film'
                };
                
                return iconMap[feature] || 'fas fa-star';
            }
    
            // --- Event Listeners ---
            if (startWizardBtn) {
                wizardModalMainTitle.textContent = 'Find Your Perfect Home Style';
                startWizardBtn.addEventListener('click', () => openWizardModal(1));
            }
    
            if (wizardNextBtn) {
                wizardNextBtn.addEventListener('click', processWizardStep);
            }
    
            if (wizardSubmitBtn) {
                wizardSubmitBtn.addEventListener('click', processWizardStep);
            }
    
            if (wizardViewAllHomesBtn) {
                wizardViewAllHomesBtn.addEventListener('click', () => {
                    tourOpenedFromMainPage = false; // Reset flag
                    progressFillWizardContainer.classList.remove('hidden');
                    wizardModalMainTitle.textContent = 'Find Your Perfect Home Style';
                    showWizardStep(galleryStep); // Go back to wizard gallery
    
                });
            }
            // "Back to Featured Gallery" button
            if (wizardViewFeaturedGalleryBtn) {
                wizardViewFeaturedGalleryBtn.addEventListener('click', () => {
                    closeWizardModal(); // close the modal, as per requirements
                });
            }
    
            if (wizardBackBtn) {
                wizardBackBtn.addEventListener('click', () => {
                    if (currentStepWizard === galleryStep) {
                        showWizardStep(totalWizardQuestions); // Go back to the last question step
                       
                    } else if (currentStepWizard === viewerStep) {
                        showWizardStep(galleryStep);
    
                    } else {
                        showWizardStep(currentStepWizard - 1);
                    }
                });
            }
    
            if (wizardCloseBtn) {
                wizardCloseBtn.addEventListener('click', closeWizardModal);
            }
    
            wizardModalCloseBtn.addEventListener('click', closeWizardModal);
    
    
            // Close wizard modal when clicking outside content
            // styleSelectorModal.addEventListener('click', (e) => {
            //     if (e.target === styleSelectorModal) {
            //         closeWizardModal();
            //     }
            // });
    
            // Close wizard modal with Escape key
            // document.addEventListener('keydown', (e) => {
            //     if (e.key === 'Escape' && styleSelectorModal.classList.contains('open')) {
            //         closeWizardModal();
            //     }
            // });
    
            // Handle file name display for survey upload in wizard
            let surveyUploadInput = document.getElementById('survey-upload');
            let fileNameDisplay = document.getElementById('file-name');
            if (surveyUploadInput && fileNameDisplay) {
                surveyUploadInput.addEventListener('change', function() {
                    if (this.files.length > 0) {
                        fileNameDisplay.textContent = this.files[0].name;
                    } else {
                        fileNameDisplay.textContent = 'No file selected';
                    }
                });
            }
    
        // download functionality
        downloadFloorPlanBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent any default behavior
            
            try {
                // Show loading state on button
                const originalText = downloadFloorPlanBtn.innerHTML;
                // downloadFloorPlanBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Downloading...';
                downloadFloorPlanBtn.disabled = true;
    
                // Get selected model safely
                const modelId = matterportViewerWizard?.src?.split('m=')[1]?.split('&')[0];
                const selectedModel = MATTERPORT_MODELS.find(model => model.id === modelId);
                
                if (selectedModel?.floor_img_link) {
                    const a = document.createElement('a');
                    a.href = selectedModel.floor_img_link;
                    a.download = `${selectedModel.title.replace(/\s+/g, '_')}_Floor_Plan.jpg`;
                    a.style.display = 'none';
                    
                    document.body.appendChild(a);
                    a.click();
                    
                    // Clean up
                    setTimeout(() => {
                        document.body.removeChild(a);
                        // downloadFloorPlanBtn.innerHTML = originalText;
                        downloadFloorPlanBtn.disabled = false;
                    }, 100);
                    
                    // Fallback in case download doesn't start
                    setTimeout(() => {
                        if (downloadFloorPlanBtn.disabled) {
                            // downloadFloorPlanBtn.innerHTML = originalText;
                            downloadFloorPlanBtn.disabled = false;
                            window.open(selectedModel.floor_img_link, '_blank');
                        }
                    }, 2000);
                } else {
                    throw new Error('Floor plan not available');
                }
            } catch (error) {
                console.error('Download failed:', error);
                alert('Could not download floor plan. Please try again.');
                // downloadFloorPlanBtn.innerHTML = '<i class="fas fa-download mr-2"></i> Download Floor Plan';
                downloadFloorPlanBtn.disabled = false;
                
                // Fallback - open in new tab if download fails
                if (selectedModel?.floor_img_link) {
                    window.open(selectedModel.floor_img_link, '_blank');
                }
            }
        });
    
        // Step 10 tab switching logic
        step10TabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Deactivate all tabs and hide all sections
                step10TabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                    btn.setAttribute('tabindex', '-1');
                });
                step10DetailSections.forEach(section => {
                    section.classList.add('hidden');
                });
    
                // Activate clicked tab and show target section
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                this.setAttribute('tabindex', '0');
                const targetId = this.dataset.target;
                document.getElementById(targetId).classList.remove('hidden');
            });
        });
    
    
            // --- Initial Setup and Interval for Wizard ---
            // 1. Perform an immediate check on load to filter the initial list
            checkAndFilterMatterportModels();
    
            setInterval(checkAndFilterMatterportModels, 3600000); // 1 hour
            
            // Input change listeners for real-time validation
            document.querySelectorAll('input[name="styles"]').forEach(checkbox => {
                checkbox.addEventListener('change', validateCurrentWizardStep);
            });
            document.getElementById('size-min').addEventListener('input', validateCurrentWizardStep);
            document.getElementById('size-max').addEventListener('input', validateCurrentWizardStep);
            document.getElementById('budget-min').addEventListener('input', validateCurrentWizardStep);
            document.getElementById('budget-max').addEventListener('input', validateCurrentWizardStep);
            document.querySelectorAll('input[name="features"]').forEach(checkbox => {
                checkbox.addEventListener('change', validateCurrentWizardStep);
            });
    
            // event listeners only if elements exist
            const storiesEl = document.getElementById('stories');
            const garageEl = document.getElementById('garage');
            const bedroomsEl = document.getElementById('bedrooms');
            const bathroomsEl = document.getElementById('bathrooms');
            const kitchenTypeEl = document.getElementById('kitchen-type');
    
            if (storiesEl) storiesEl.addEventListener('change', validateCurrentWizardStep);
            if (garageEl) garageEl.addEventListener('change', validateCurrentWizardStep);
            if (bedroomsEl) bedroomsEl.addEventListener('change', validateCurrentWizardStep);
            if (bathroomsEl) bathroomsEl.addEventListener('change', validateCurrentWizardStep);
            if (kitchenTypeEl) kitchenTypeEl.addEventListener('change', validateCurrentWizardStep);
    
            document.querySelectorAll('input[name="flooring"]').forEach(radio => {
                radio.addEventListener('change', validateCurrentWizardStep);
            });
            document.querySelectorAll('input[name="countertops"]').forEach(radio => {
                radio.addEventListener('change', validateCurrentWizardStep);
            });
            document.querySelectorAll('input[name="cabinets"]').forEach(radio => {
                radio.addEventListener('change', validateCurrentWizardStep);
            });
            document.querySelectorAll('input[name="appliances"]').forEach(radio => {
                radio.addEventListener('change', validateCurrentWizardStep);
            });
            document.querySelectorAll('input[name="bath-fixtures"]').forEach(radio => {
                radio.addEventListener('change', validateCurrentWizardStep);
            });
    
    document.getElementById('save-estimate-btn').addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    generatePrintableEstimate.call(this);
    });

    function generatePrintableEstimate() {
        const btn = this;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Preparing document...';
        btn.disabled = true;
    
        try {
            // Get model data - try multiple methods to ensure we get the ID
            let modelId = currentModelId;
            
            let selectedModel = MATTERPORT_MODELS.find(model => model.id === modelId);
            
            if (!selectedModel) {
                console.error("Could not determine model for estimate");
                alert("Could not determine which model to generate estimate for. Please try again.");
                return;
            }
    
            // Get user selections
            const selections = getUserSelections();
            
            // selections with defaults from model
            const completeSelections = {
                styles: selections.styles?.length ? selections.styles : [selectedModel.style.toLowerCase()],
                size: selectedModel.size,
                sizeMin: selections.sizeMin || selectedModel.size,
                sizeMax: selections.sizeMax || selectedModel.size,
                stories: selections.stories || '1',
                garage: selections.garage || '2',
                bedrooms: selections.bedrooms || '3',
                bathrooms: selections.bathrooms || '2',
                kitchenType: selections.kitchenType || 'standard',
                additionalRooms: selections.additionalRooms || [],
                flooring: selections.flooring || 'engineered',
                countertops: selections.countertops || 'quartz',
                cabinets: selections.cabinets || 'standard',
                appliances: selections.appliances || 'standard',
                bathFixtures: selections.bathFixtures || 'standard',
                isRenovation: selections.isRenovation || false,
                budgetMin: selections.budgetMin || 0,
                budgetMax: selections.budgetMax || 0,
                features: selections.features || [],
                propertyAddress: selections.propertyAddress || 'Not specified'
            };
    
            // Calculate costs with complete selections
            const calculatedCosts = calculateCosts(completeSelections);
    
            // Format currency helper with NaN/infinity protection
            const formatCurrency = (amount) => {
                if (isNaN(amount) || !isFinite(amount)) {
                    return '$0';
                }
                return '$' + amount.toLocaleString('en-US', {maximumFractionDigits: 0});
            };
    
            const usedDefaults = !selections.styles?.length && 
                               !selections.sizeMin && 
                               !selections.sizeMax;
    
            // Format the size range
            const sizeRange = selections.sizeMin && selections.sizeMax ?
                `${selections.sizeMin.toLocaleString()} - ${selections.sizeMax.toLocaleString()} sq ft` : 
                'Not specified';
            
            // Format the budget range
            const budgetRange = selections.budgetMin && selections.budgetMax ?
                `$${selections.budgetMin.toLocaleString()} - $${selections.budgetMax.toLocaleString()}` : 
                'Not specified';
    
            // Create the printable content
            const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Construction Estimate - ${selectedModel.title}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        line-height: 1.6; 
                        color: #333; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 20px; 
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px; 
                        padding-bottom: 20px;
                        border-bottom: 1px solid #eee;
                    }
                    .logo { 
                        height: 70px; 
                        margin-bottom: 15px; 
                    }
                    h1 { 
                        color: #e67e22; 
                        margin: 0 0 5px 0;
                        font-size: 28px;
                    }
                    .subtitle { 
                        color: #666; 
                        margin: 0 0 10px 0;
                        font-size: 14px;
                    }
                    .section { 
                        margin-bottom: 30px; 
                        page-break-inside: avoid; 
                    }
                    .section-title { 
                        background-color: #f8f8f8; 
                        padding: 10px 15px; 
                        border-left: 4px solid #e67e22; 
                        font-weight: bold; 
                        margin-bottom: 15px;
                        font-size: 16px;
                    }
                    .two-column { 
                        display: flex; 
                        justify-content: space-between;
                        margin-bottom: 15px;
                    }
                    .column { 
                        width: 48%; 
                    }
                    .details-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 15px 0;
                        font-size: 14px;
                    }
                    .details-table th { 
                        text-align: left; 
                        padding: 10px; 
                        background-color: #f5f5f5;
                        border-bottom: 2px solid #ddd;
                    }
                    .details-table td { 
                        padding: 10px; 
                        border-bottom: 1px solid #eee; 
                    }
                    .details-table tr:last-child td {
                        border-bottom: none;
                    }
                    .cost-total-row td {
                        font-weight: bold;
                        background-color: #f9f9f9;
                    }
                    .features { 
                        display: flex; 
                        flex-wrap: wrap; 
                        gap: 8px; 
                        margin: 15px 0; 
                    }
                    .feature-tag { 
                        background-color: #fdebd0; 
                        color: #e67e22; 
                        padding: 5px 12px; 
                        border-radius: 15px; 
                        font-size: 13px;
                    }
                    .footer { 
                        margin-top: 40px; 
                        font-size: 12px; 
                        color: #777; 
                        text-align: center; 
                        border-top: 1px solid #eee; 
                        padding-top: 15px;
                    }
                    .highlight-box {
                        background-color: #fff9f2;
                        border: 1px solid #f0e6d9;
                        border-radius: 5px;
                        padding: 15px;
                        margin: 15px 0;
                    }
                    .text-orange {
                        color: #e67e22;
                    }
                    @media print {
                        body { 
                            padding: 0; 
                            font-size: 12pt;
                        }
                        .no-print { 
                            display: none !important; 
                        }
                        .page-break { 
                            page-break-after: always; 
                        }
                        .section {
                            margin-bottom: 20pt;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo"><img src="https://via.placeholder.com/150x70?text=Dummy+Logo" alt="Dummy Builders Inc. Logo" style="height: 70px;"></div>
                    <h1>Detailed Construction Estimate</h1>
                    <div class="subtitle">Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                
                <div class="section">
                    <div class="section-title">Project Overview</div>
                    <div class="two-column">
                        <div class="column">
                            <p><strong>Selected Model:</strong> ${selectedModel.title}</p>
                            <p><strong>Architectural Style:</strong> ${selectedModel.style}</p>
                            <p><strong>Total Living Area:</strong> ${selectedModel.size.toLocaleString()} sq.ft.</p>
                            <p><strong>Project Type:</strong> ${completeSelections.isRenovation ? 'Renovation' : 'New Construction'}</p>
                        </div>
                        <div class="column">
                            <p><strong>Estimated Total Cost:</strong> <span class="text-orange">${formatCurrency(calculatedCosts.total)}</span></p>
                            <p><strong>Location:</strong> ${completeSelections.propertyAddress}</p>
                            <p><strong>Stories:</strong> ${completeSelections.stories}</p>
                            <p><strong>Garage:</strong> ${completeSelections.garage === '0' ? 'None' : completeSelections.garage + '-car'}</p>
                        </div>
                    </div>
                    
                    <div class="highlight-box">
                        <p><strong>Note:</strong> This estimate is based on ${usedDefaults ? 'standard specifications' : 'your selections'} and current market pricing. Final costs may vary based on site conditions, material availability, and design modifications.</p>
                    </div>
                </div>
                
                <div class="section">
                    <div class="section-title">${usedDefaults ? 'Standard Specifications' : 'Your Custom Selections'}</div>
                    <table class="details-table">
                        <tr>
                            <th>Category</th>
                            <th>${usedDefaults ? 'Standard Value' : 'Selection'}</th>
                        </tr>
                        <tr>
                            <td>Preferred Styles</td>
                            <td>${completeSelections.styles.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</td>
                        </tr>
                        <tr>
                            <td>Size Range</td>
                            <td>${
                                sizeRange ? 'Not specified' : 
                                `${completeSelections.sizeMin.toLocaleString()} - ${completeSelections.sizeMax.toLocaleString()} sq.ft.`
                            }</td>
                        </tr>
                        <tr>
                            <td>Bedrooms</td>
                            <td>${completeSelections.bedrooms}</td>
                        </tr>
                        <tr>
                            <td>Bathrooms</td>
                            <td>${completeSelections.bathrooms}</td>
                        </tr>
                        <tr>
                            <td>Kitchen Type</td>
                            <td>${completeSelections.kitchenType.charAt(0).toUpperCase() + completeSelections.kitchenType.slice(1)}</td>
                        </tr>
                        <tr>
                            <td>Additional Rooms</td>
                            <td>${completeSelections.additionalRooms.length > 0 ? 
                                completeSelections.additionalRooms.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ') : 
                                'None'}</td>
                        </tr>
                        <tr>
                            <td>Flooring</td>
                            <td>${completeSelections.flooring.charAt(0).toUpperCase() + completeSelections.flooring.slice(1)}</td>
                        </tr>
                        <tr>
                            <td>Countertops</td>
                            <td>${completeSelections.countertops.charAt(0).toUpperCase() + completeSelections.countertops.slice(1)}</td>
                        </tr>
                        <tr>
                            <td>Cabinets</td>
                            <td>${completeSelections.cabinets.charAt(0).toUpperCase() + completeSelections.cabinets.slice(1)}</td>
                        </tr>
                        <tr>
                            <td>Appliances</td>
                            <td>${completeSelections.appliances.charAt(0).toUpperCase() + completeSelections.appliances.slice(1)}</td>
                        </tr>
                        <tr>
                            <td>Bath Fixtures</td>
                            <td>${completeSelections.bathFixtures.charAt(0).toUpperCase() + completeSelections.bathFixtures.slice(1)}</td>
                        </tr>
                        <tr>
                            <td>Budget Range</td>
                            <td>${
                                budgetRange ? 'Not specified' : 
                                `$${completeSelections.budgetMin.toLocaleString()} - $${completeSelections.budgetMax.toLocaleString()}`
                            }</td>                    </tr>
                    </table>
                </div>
                
                ${completeSelections.features.length > 0 ? `
                <div class="section">
                    <div class="section-title">${usedDefaults ? 'Standard Features' : 'Selected Features'}</div>
                    <div class="features">
                        ${completeSelections.features.map(f => `<span class="feature-tag">${f.charAt(0).toUpperCase() + f.slice(1)}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="section">
                    <div class="section-title">Detailed Cost Breakdown</div>
                    <table class="details-table">
                        <tr>
                            <th>Item</th>
                            <th>Description</th>
                            <th>Estimated Cost</th>
                        </tr>
                        <tr>
                            <td>Base Construction</td>
                            <td>Includes foundation, framing, roofing, and basic finishes</td>
                            <td>${formatCurrency(calculatedCosts.baseConstruction)}</td>
                        </tr>
                        <tr>
                            <td>${completeSelections.garage === '0' ? 'No Garage' : completeSelections.garage + '-Car Garage'}</td>
                            <td>${completeSelections.garage === '0' ? 'No garage included' : 'Garage with automatic opener and finished interior'}</td>
                            <td>${formatCurrency(calculatedCosts.garage)}</td>
                        </tr>
                        <tr>
                            <td>${completeSelections.bedrooms} Bedrooms</td>
                            <td>Includes flooring, pre-wiring, and basic closet organization</td>
                            <td>${formatCurrency(calculatedCosts.bedrooms)}</td>
                        </tr>
                        <tr>
                            <td>${completeSelections.bathrooms} Bathrooms</td>
                            <td>Includes fixtures, tile work, and countertops</td>
                            <td>${formatCurrency(calculatedCosts.bathrooms)}</td>
                        </tr>
                        <tr>
                            <td>${completeSelections.kitchenType.charAt(0).toUpperCase() + completeSelections.kitchenType.slice(1)} Kitchen</td>
                            <td>Includes cabinets, countertops, and basic appliances</td>
                            <td>${formatCurrency(calculatedCosts.kitchen)}</td>
                        </tr>
                        ${completeSelections.additionalRooms.length > 0 ? `
                        <tr>
                            <td>Additional Rooms</td>
                            <td>${completeSelections.additionalRooms.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}</td>
                            <td>${formatCurrency(calculatedCosts.additionalRooms)}</td>
                        </tr>
                        ` : ''}
                        <tr>
                            <td>Flooring (${completeSelections.flooring.charAt(0).toUpperCase() + completeSelections.flooring.slice(1)})</td>
                            <td>Flooring throughout main living areas</td>
                            <td>${formatCurrency(calculatedCosts.flooring)}</td>
                        </tr>
                        <tr>
                            <td>Countertops (${completeSelections.countertops.charAt(0).toUpperCase() + completeSelections.countertops.slice(1)})</td>
                            <td>Kitchen and bathroom countertops</td>
                            <td>${formatCurrency(calculatedCosts.countertops)}</td>
                        </tr>
                        <tr>
                            <td>Cabinets (${completeSelections.cabinets.charAt(0).toUpperCase() + completeSelections.cabinets.slice(1)})</td>
                            <td>Kitchen and bathroom cabinetry</td>
                            <td>${formatCurrency(calculatedCosts.cabinets)}</td>
                        </tr>
                        <tr>
                            <td>Appliances (${completeSelections.appliances.charAt(0).toUpperCase() + completeSelections.appliances.slice(1)})</td>
                            <td>Kitchen and laundry appliances</td>
                            <td>${formatCurrency(calculatedCosts.appliances)}</td>
                        </tr>
                        <tr>
                            <td>Bath Fixtures (${completeSelections.bathFixtures.charAt(0).toUpperCase() + completeSelections.bathFixtures.slice(1)})</td>
                            <td>Bathroom faucets, showers, and fixtures</td>
                            <td>${formatCurrency(calculatedCosts.bathFixtures)}</td>
                        </tr>
                        ${completeSelections.isRenovation ? `
                        <tr>
                            <td>Renovation Adjustment</td>
                            <td>Credit for existing structure and reusable elements</td>
                            <td>-${formatCurrency(calculatedCosts.renovationAdjustment)}</td>
                        </tr>
                        ` : ''}
                        <tr class="cost-total-row">
                            <td colspan="2"><strong>Total Estimated Cost</strong></td>
                            <td><strong class="text-orange">${formatCurrency(calculatedCosts.total)}</strong></td>
                        </tr>
                    </table>
                    
                    <div class="highlight-box">
                        <p><strong>Important Notes:</strong></p>
                        <ul style="margin-top: 10px; padding-left: 20px;">
                            <li>This estimate is valid for 30 days from the date shown above</li>
                            <li>Final costs may vary based on site conditions, material availability, and design modifications</li>
                            <li>Does not include land costs, permits, or site preparation unless specified</li>
                            <li>Consult with our team for a more detailed quote based on final plans</li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Thank you for considering Dummy Builders Inc. for your project.</p>
                    <p>© ${new Date().getFullYear()} Dummy Builders Inc. All Rights Reserved.</p>
                    <p>Call us at: (555) 123-4567</p>
                </div>
                
                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="padding: 12px 24px; background: #e67e22; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold;">Print Estimate</button>
                    <button onclick="window.close()" style="padding: 12px 24px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 15px; font-size: 16px;">Close Window</button>
                </div>
            </body>
            </html>
            `;
    
            // Open a new window with the printable content
            const printWindow = window.open('', '_blank');
            printWindow.document.write(printContent);
            printWindow.document.close();
            
            // Focus the window
            printWindow.focus();
            
            // trigger print dialog after a short delay
            setTimeout(() => {
                printWindow.print();
            }, 500);
    
        } catch (error) {
            console.error('Error generating document:', error);
            alert('Could not generate document. Please try again or contact support.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
    
        });
