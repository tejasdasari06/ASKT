// 3D Viewer JavaScript for ASKT Website

let currentRotationX = -20;
let currentRotationY = 45;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let zoomLevel = 1;

// Open 3D Viewer Modal
function open3DViewer(productId) {
    const modal = document.getElementById('viewer3DModal');
    if (modal) {
        modal.classList.add('active');
        reset3DView();
        initialize3DInteractions();
    }
}

// Close 3D Viewer Modal
function close3DViewer() {
    const modal = document.getElementById('viewer3DModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Rotate 3D View
function rotate3D(direction) {
    const viewer = document.getElementById('tshirt3DViewer');
    if (!viewer) return;
    
    if (direction === 'left') {
        currentRotationY -= 15;
    } else if (direction === 'right') {
        currentRotationY += 15;
    }
    
    update3DTransform();
}

// Reset 3D View
function reset3DView() {
    currentRotationX = -20;
    currentRotationY = 45;
    zoomLevel = 1;
    update3DTransform();
}

// Update 3D Transform
function update3DTransform() {
    const viewer = document.getElementById('tshirt3DViewer');
    if (viewer) {
        viewer.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg) scale(${zoomLevel})`;
    }
}

// Initialize 3D Interactions
function initialize3DInteractions() {
    const viewer = document.getElementById('tshirt3DViewer');
    const modal = document.getElementById('viewer3DModal');
    
    if (!viewer || !modal) return;
    
    // Mouse drag rotation
    viewer.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        viewer.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        
        currentRotationY += deltaX * 0.5;
        currentRotationX -= deltaY * 0.5;
        
        // Limit vertical rotation
        currentRotationX = Math.max(-90, Math.min(90, currentRotationX));
        
        update3DTransform();
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
        if (viewer) {
            viewer.style.cursor = 'grab';
        }
    });
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    viewer.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    viewer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        
        currentRotationY += deltaX * 0.5;
        currentRotationX -= deltaY * 0.5;
        
        currentRotationX = Math.max(-90, Math.min(90, currentRotationX));
        
        update3DTransform();
        
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    viewer.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Zoom with mouse wheel
    viewer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        zoomLevel = Math.max(0.5, Math.min(2, zoomLevel + delta));
        update3DTransform();
    });
}

// Product card 3D hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Add mouse move effect to product cards
    const productCards = document.querySelectorAll('.product-card-3d');
    
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            const container = card.querySelector('.product-3d-container');
            if (container) {
                container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const container = card.querySelector('.product-3d-container');
            if (container) {
                container.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            }
        });
    });
    
    // T-shirt 3D viewer in product cards
    const tshirtViewers = document.querySelectorAll('.tshirt-3d-viewer');
    
    tshirtViewers.forEach(viewer => {
        let isRotating = false;
        let rotationY = 0;
        
        viewer.addEventListener('mouseenter', () => {
            isRotating = true;
            animateRotation();
        });
        
        viewer.addEventListener('mouseleave', () => {
            isRotating = false;
        });
        
        function animateRotation() {
            if (!isRotating) return;
            rotationY += 2;
            viewer.style.transform = `rotateY(${rotationY}deg)`;
            requestAnimationFrame(animateRotation);
        }
    });
    
    // Close modal when clicking outside
    const modal = document.getElementById('viewer3DModal');
    const closeBtn = document.querySelector('.modal-3d-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', close3DViewer);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                close3DViewer();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            close3DViewer();
        }
    });
});

// Auto-rotate 3D viewer when modal is open
let autoRotateInterval = null;

function startAutoRotate() {
    if (autoRotateInterval) return;
    
    autoRotateInterval = setInterval(() => {
        const modal = document.getElementById('viewer3DModal');
        if (modal && modal.classList.contains('active') && !isDragging) {
            currentRotationY += 0.5;
            update3DTransform();
        } else {
            stopAutoRotate();
        }
    }, 50);
}

function stopAutoRotate() {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
    }
}

// Enhanced open function with auto-rotate
const originalOpen3DViewer = open3DViewer;
window.open3DViewer = function(productId) {
    originalOpen3DViewer(productId);
    setTimeout(startAutoRotate, 500);
};

// Enhanced close function
const originalClose3DViewer = close3DViewer;
window.close3DViewer = function() {
    originalClose3DViewer();
    stopAutoRotate();
};

