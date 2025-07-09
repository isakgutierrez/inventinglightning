// Global Variables
let cart = [];
let currentProject = null;
let currentImageIndex = 0;
let currentVideo = null;
let projectImages = {};
let videoData = {};

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadCart();
    updateCartDisplay();
    setupEventListeners();
    initializeFilters();
    initializeAnimations();
    initializeData();
});

// Page Initialization
function initializePage() {
    // Set active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Initialize page-specific functionality
    if (currentPage === 'gallery.html' || currentPage === '') {
        initializeGallery();
    } else if (currentPage === 'shop.html') {
        initializeShop();
    } else if (currentPage === 'booking.html') {
        initializeBooking();
    } else if (currentPage === 'videos.html') {
        initializeVideos();
    }

    // Show welcome message on home page
    if (currentPage === 'index.html' || currentPage === '') {
        setTimeout(() => {
            showNotification('Welcome to Isak Gutierrez Photography!', 'success');
        }, 2000);
    }
}

// Initialize Data
function initializeData() {
    // Project data for lightbox
    projectImages = {
        'urban-solitude': {
            title: 'Urban Solitude Series',
            subtitle: 'Metropolitan Isolation',
            description: 'An intimate exploration of isolation and connection within metropolitan spaces.',
            images: [
                { 
                    title: 'City Corner Solitude', 
                    description: 'A lone figure contemplates at a busy intersection, finding quiet in chaos.',
                    price: 350
                },
                { 
                    title: 'Subway Meditation', 
                    description: 'Underground moments of reflection during the daily commute.',
                    price: 350
                },
                { 
                    title: 'Window Reflection', 
                    description: 'Inner thoughts mirrored in urban glass and steel.',
                    price: 350
                },
                { 
                    title: 'Bench Stories', 
                    description: 'Silent narratives unfold on park benches throughout the city.',
                    price: 350
                }
            ]
        },
        'urban-nights': {
            title: 'Urban Nights',
            subtitle: 'After Dark Series',
            description: 'The city transforms after dark, revealing hidden stories in neon and shadow.',
            images: [
                { 
                    title: 'Neon Dreams', 
                    description: 'Electric atmosphere of late-night cityscapes.',
                    price: 275
                },
                { 
                    title: 'Late Night Diner', 
                    description: 'Stories illuminate under fluorescent light.',
                    price: 275
                }
            ]
        },
        'street-geometry': {
            title: 'Street Geometry',
            subtitle: 'Urban Mathematics',
            description: 'Finding mathematical beauty in the urban landscape through lines, shapes, and shadows.',
            images: [
                { 
                    title: 'Parallel Lines', 
                    description: 'Architecture meets motion in perfect geometric harmony.',
                    price: 425
                },
                { 
                    title: 'Shadow Patterns', 
                    description: 'Light creates form and depth in unexpected ways.',
                    price: 425
                }
            ]
        },
        'faces-of-la': {
            title: 'Faces of LA',
            subtitle: 'Character Studies',
            description: 'Portrait series capturing the diverse characters that make Los Angeles unique.',
            images: [
                { 
                    title: 'Street Artist', 
                    description: 'Creative spirit captured in natural light.',
                    price: 195
                },
                { 
                    title: 'Coffee Shop Regular', 
                    description: 'Morning rituals and familiar faces.',
                    price: 195
                }
            ]
        }
    };

    // Video data for modal
    videoData = {
        'urban-masterclass': {
            title: 'Urban Photography Masterclass',
            category: 'Tutorial',
            description: 'A comprehensive guide to creating compelling urban photography, covering everything from composition to post-processing techniques.',
            duration: '45:30'
        },
        'portrait-lighting': {
            title: 'Portrait Lighting Techniques',
            category: 'Tutorial',
            description: 'Master the fundamentals of natural and artificial lighting for stunning portrait photography.',
            duration: '22:30'
        },
        'composition-rules': {
            title: 'Composition Rules Every Photographer Should Know',
            category: 'Tutorial',
            description: 'Beyond the rule of thirds: advanced composition techniques for compelling images.',
            duration: '18:45'
        },
        'lightroom-workflow': {
            title: 'Complete Lightroom Workflow',
            category: 'Tutorial',
            description: 'My complete post-processing workflow from import to final export.',
            duration: '35:20'
        }
    };
}

// Event Listeners Setup
function setupEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navLinksContainer = document.querySelector('.nav-links');
            if (navLinksContainer) {
                navLinksContainer.classList.remove('mobile-open');
            }
        });
    });

    // Escape key handlers
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
        
        // Arrow keys for lightbox navigation
        if (currentProject) {
            if (e.key === 'ArrowLeft') {
                previousImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
    });

    // Cart outside click handler
    document.addEventListener('click', function(e) {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartButton = document.querySelector('.cart');
        
        if (cartSidebar && cartSidebar.classList.contains('open') && 
            !cartSidebar.contains(e.target) && !cartButton.contains(e.target)) {
            toggleCart();
        }
    });

    // Add hover effects to photo frames
    const photoFrames = document.querySelectorAll('.photo-frame');
    photoFrames.forEach(frame => {
        frame.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 16px rgba(255, 255, 255, 0.15)';
        });
        frame.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(255, 255, 255, 0.1)';
        });
    });
}

// Mobile Navigation
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('mobile-open');
    }
}

// Shopping Cart Functionality
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCart();
    showNotification(`${name} added to cart!`, 'success');
}

function removeFromCart(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        cart = cart.filter(item => item.id !== id);
        updateCartDisplay();
        saveCart();
        showNotification(`${item.name} removed from cart`, 'info');
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartCount || !cartItems || !cartTotal) return;
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price} x ${item.quantity}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Simulate checkout process
    showNotification('Redirecting to secure checkout...', 'info');
    
    setTimeout(() => {
        showNotification('Thank you for your purchase! You will receive an email confirmation shortly.', 'success');
        cart = [];
        updateCartDisplay();
        saveCart();
        toggleCart();
    }, 2000);
}

function saveCart() {
    // In a real implementation, save to localStorage or send to server
    console.log('Cart saved:', cart);
}

function loadCart() {
    // In a real implementation, load from localStorage or server
    console.log('Cart loaded');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 6px;
        z-index: 1003;
        max-width: 300px;
        animation: slideIn 0.3s ease;
        border: 1px solid;
    `;
    
    // Set colors based on type
    switch(type) {
        case 'success':
            notification.style.background = '#4CAF50';
            notification.style.borderColor = '#66BB6A';
            notification.style.color = '#ffffff';
            break;
        case 'error':
            notification.style.background = '#f44336';
            notification.style.borderColor = '#EF5350';
            notification.style.color = '#ffffff';
            break;
        case 'info':
            notification.style.background = '#2196F3';
            notification.style.borderColor = '#42A5F5';
            notification.style.color = '#ffffff';
            break;
        default:
            notification.style.background = '#333333';
            notification.style.borderColor = '#555555';
            notification.style.color = '#ffffff';
    }
    
    notification.textContent = message;
    
    // Add CSS animations if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Gallery Page Functionality
function initializeGallery() {
    setupGalleryFilters();
    setupProjectLightbox();
}

function setupGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterGalleryItems(filter);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterGalleryItems(filter) {
    const items = document.querySelectorAll('.gallery-project');
    items.forEach((item, index) => {
        const categories = item.getAttribute('data-category');
        if (filter === 'all' || (categories && categories.includes(filter))) {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
        } else {
            item.style.display = 'none';
        }
    });
}

function setupProjectLightbox() {
    const lightbox = document.getElementById('projectLightbox');
    if (!lightbox) return;

    // Close lightbox when clicking outside
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeProjectLightbox();
        }
    });
}

function openProjectLightbox(projectId) {
    const lightbox = document.getElementById('projectLightbox');
    const projectTitle = document.getElementById('projectTitle');
    const projectSubtitle = document.getElementById('projectSubtitle');
    const projectDescription = document.getElementById('projectDescription');
    
    if (!lightbox || !projectImages[projectId]) return;
    
    currentProject = projectId;
    currentImageIndex = 0;
    
    const project = projectImages[projectId];
    if (projectTitle) projectTitle.textContent = project.title;
    if (projectSubtitle) projectSubtitle.textContent = project.subtitle;
    if (projectDescription) projectDescription.textContent = project.description;
    
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectLightbox() {
    const lightbox = document.getElementById('projectLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    currentProject = null;
}

function updateLightboxImage() {
    if (!currentProject || !projectImages[currentProject]) return;
    
    const project = projectImages[currentProject];
    const lightboxImage = document.getElementById('lightboxImage');
    const imageCounter = document.getElementById('imageCounter');
    const imageTitle = document.getElementById('imageTitle');
    const imageDescription = document.getElementById('imageDescription');
    
    if (lightboxImage && project.images[currentImageIndex]) {
        const currentImage = project.images[currentImageIndex];
        lightboxImage.textContent = currentImage.title;
        
        if (imageTitle) imageTitle.textContent = currentImage.title;
        if (imageDescription) imageDescription.textContent = currentImage.description;
    }
    
    if (imageCounter) {
        imageCounter.textContent = `${currentImageIndex + 1} / ${project.images.length}`;
    }
}

function previousImage() {
    if (!currentProject || !projectImages[currentProject]) return;
    
    const project = projectImages[currentProject];
    currentImageIndex = (currentImageIndex - 1 + project.images.length) % project.images.length;
    updateLightboxImage();
}

function nextImage() {
    if (!currentProject || !projectImages[currentProject]) return;
    
    const project = projectImages[currentProject];
    currentImageIndex = (currentImageIndex + 1) % project.images.length;
    updateLightboxImage();
}

function addCurrentImageToCart() {
    if (!currentProject || !projectImages[currentProject]) return;
    
    const project = projectImages[currentProject];
    const currentImage = project.images[currentImageIndex];
    
    if (currentImage) {
        addToCart(
            `${currentProject}-${currentImageIndex}`,
            currentImage.title,
            currentImage.price
        );
    }
}

// Shop Page Functionality
function initializeShop() {
    setupShopFilters();
    setupProductOptions();
    
    // Add demo item to cart after a delay
    setTimeout(() => {
        if (cart.length === 0) {
            addToCart('demo-print', 'Urban Solitude Print', 350);
        }
    }, 3000);
}

function setupShopFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterShopItems(category);
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterShopItems(category) {
    const items = document.querySelectorAll('.shop-item');
    items.forEach((item, index) => {
        const categories = item.getAttribute('data-category');
        if (category === 'all' || (categories && categories.includes(category))) {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
        } else {
            item.style.display = 'none';
        }
    });
}

function setupProductOptions() {
    const frameOption = document.getElementById('frame-option');
    if (frameOption) {
        frameOption.addEventListener('change', updateProductPrice);
    }
}

function updateProductPrice() {
    const frameOption = document.getElementById('frame-option');
    const priceElement = document.querySelector('.product-price');
    
    if (!frameOption || !priceElement) return;
    
    const basePrice = 850;
    const selectedOption = frameOption.options[frameOption.selectedIndex];
    const additionalCost = parseInt(selectedOption.dataset.price) || 0;
    const totalPrice = basePrice + additionalCost;
    
    priceElement.textContent = `$${totalPrice}`;
}

function getCurrentPrice() {
    const frameOption = document.getElementById('frame-option');
    const basePrice = 850;
    
    if (!frameOption) return basePrice;
    
    const selectedOption = frameOption.options[frameOption.selectedIndex];
    const additionalCost = parseInt(selectedOption.dataset.price) || 0;
    
    return basePrice + additionalCost;
}

function addToWishlist(itemId) {
    showNotification('Added to wishlist!', 'success');
    // In a real implementation, this would save to user's wishlist
}

// Booking Page Functionality
function initializeBooking() {
    setupServiceSelection();
    setupFormValidation();
    setupDateValidation();
}

function setupServiceSelection() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const selectButton = card.querySelector('.select-service');
        if (selectButton) {
            selectButton.addEventListener('click', function() {
                const serviceType = card.getAttribute('data-service');
                selectService(serviceType);
            });
        }
    });
}

function selectService(serviceType) {
    const serviceSelect = document.getElementById('serviceType');
    if (serviceSelect) {
        serviceSelect.value = serviceType;
        
        // Scroll to form
        const bookingForm = document.querySelector('.booking-form-section');
        if (bookingForm) {
            bookingForm.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Update service cards visual state
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-service="${serviceType}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    showNotification(`${serviceType} service selected!`, 'success');
}

function setupFormValidation() {
    const form = document.querySelector('.booking-form');
    if (form) {
        form.addEventListener('submit', submitBookingForm);
        
        // Real-time validation
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', clearFieldError);
        });
    }
}

function setupDateValidation() {
    const dateInput = document.getElementById('eventDate');
    if (dateInput) {
        // Set minimum date to tomorrow
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validate based on field type
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    } else if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    // Remove error message
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: #ff6b6b; font-size: 0.8rem; margin-top: 0.25rem;';
    
    field.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function submitBookingForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate all required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isFormValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Please correct the errors in the form', 'error');
        return;
    }
    
    // Collect form data
    const bookingData = {};
    for (let [key, value] of formData.entries()) {
        bookingData[key] = value;
    }
    
    // Simulate form submission
    showNotification('Sending your request...', 'info');
    
    setTimeout(() => {
        console.log('Booking submitted:', bookingData);
        showNotification('Thank you for your booking request! I\'ll get back to you within 24 hours.', 'success');
        form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// Videos Page Functionality
function initializeVideos() {
    setupVideoFilters();
    setupVideoModals();
}

function setupVideoFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterVideoItems(category);
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterVideoItems(category) {
    const items = document.querySelectorAll('.video-item');
    items.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
        } else {
            item.style.display = 'none';
        }
    });
}

function setupVideoModals() {
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideo();
            }
        });
    }
}

function playVideo(videoId) {
    const modal = document.getElementById('videoModal');
    const modalTitle = document.getElementById('modalVideoTitle');
    const modalCategory = document.getElementById('modalVideoCategory');
    const modalDescription = document.getElementById('modalVideoDescription');
    const modalPlaceholder = document.getElementById('modalVideoPlaceholder');
    
    if (!modal) return;
    
    const video = videoData[videoId];
    if (video) {
        currentVideo = videoId;
        
        if (modalTitle) modalTitle.textContent = video.title;
        if (modalCategory) modalCategory.textContent = video.category;
        if (modalDescription) modalDescription.textContent = video.description;
        if (modalPlaceholder) modalPlaceholder.textContent = `${video.title} - ${video.duration}`;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        showNotification('Video player opened', 'info');
    }
}

function closeVideo() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    currentVideo = null;
}

function shareVideo(videoId) {
    const video = videoData[videoId] || { title: 'Photography Video' };
    const url = `${window.location.origin}/videos.html#${videoId}`;
    
    if (navigator.share) {
        navigator.share({
            title: `Check out: ${video.title}`,
            text: video.description || 'Amazing photography tutorial!',
            url: url
        }).then(() => {
            showNotification('Video shared successfully!', 'success');
        }).catch(() => {
            fallbackShare(url);
        });
    } else {
        fallbackShare(url);
    }
}

function shareCurrentVideo() {
    if (currentVideo) {
        shareVideo(currentVideo);
    }
}

function fallbackShare(url) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Video link copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Unable to copy link', 'error');
    });
}

// Newsletter Functionality
function subscribeNewsletter(event) {
    event.preventDefault();
    
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate subscription
    showNotification('Subscribing...', 'info');
    
    setTimeout(() => {
        console.log('Newsletter subscription:', email);
        showNotification('Thank you for subscribing! You\'ll receive our latest updates.', 'success');
        form.reset();
    }, 1500);
}

// Filter System
function initializeFilters() {
    // Add fade-in animation for filtered items
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Animation System
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const elementsToAnimate = document.querySelectorAll(`
        .featured-item,
        .service-item,
        .testimonial,
        .gallery-project,
        .shop-item,
        .video-item,
        .service-card,
        .timeline-item,
        .recognition-item,
        .publication-item,
        .info-item,
        .faq-item,
        .philosophy-item
    `);
    
    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Add parallax effect to hero sections
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroElements = document.querySelectorAll('.hero, .page-header');
        
        heroElements.forEach(hero => {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Contact Form Handling
function submitForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Simulate form submission
    showNotification('Sending message...', 'info');
    
    setTimeout(() => {
        console.log('Contact form submitted:', data);
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        event.target.reset();
    }, 2000);
}

// Utility Functions
function closeAllModals() {
    // Close project lightbox
    closeProjectLightbox();
    
    // Close video modal
    closeVideo();
    
    // Close cart
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar && cartSidebar.classList.contains('open')) {
        toggleCart();
    }
}

// Smooth scrolling for anchor links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    // Handle any necessary cleanup when navigating
    closeAllModals();
});

// Performance optimization - lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Dark theme specific enhancements
function initializeDarkTheme() {
    // Add subtle glow effects to interactive elements
    const interactiveElements = document.querySelectorAll('button, .cta-button, .photo-frame');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.1)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// Initialize dark theme enhancements
document.addEventListener('DOMContentLoaded', initializeDarkTheme);

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.openProjectLightbox = openProjectLightbox;
window.closeProjectLightbox = closeProjectLightbox;
window.previousImage = previousImage;
window.nextImage = nextImage;
window.addCurrentImageToCart = addCurrentImageToCart;
window.selectService = selectService;
window.submitBookingForm = submitBookingForm;
window.submitForm = submitForm;
window.subscribeNewsletter = subscribeNewsletter;
window.playVideo = playVideo;
window.closeVideo = closeVideo;
window.shareVideo = shareVideo;
window.shareCurrentVideo = shareCurrentVideo;
window.toggleMobileMenu = toggleMobileMenu;
window.addToWishlist = addToWishlist;
window.updateProductPrice = updateProductPrice;
window.getCurrentPrice = getCurrentPrice;