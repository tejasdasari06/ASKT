// Customize T-Shirt Functionality

let currentView = 'back'; // 'front' or 'back'
let designs = [];
let activeDesignIndex = -1;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let currentTextDesign = {
    text: '',
    fontSize: 40,
    color: '#000000',
    fontFamily: 'Arial'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initializeDragAndDrop();
    updateTshirtColor('#ffffff');
});

// T-Shirt Color Functions
function updateTshirtColor(color) {
    const preview = document.getElementById('tshirtPreview');
    if (preview) {
        preview.style.backgroundColor = color;
    }
    document.documentElement.style.setProperty('--tshirt-color', color);
}

function setTshirtColor(color) {
    document.getElementById('tshirtColor').value = color;
    updateTshirtColor(color);
}

// View Switching
function switchView(view) {
    currentView = view;
    document.querySelectorAll('.btn-preview').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update designs visibility based on view
    updateDesignsVisibility();
}

function updateDesignsVisibility() {
    designs.forEach((design, index) => {
        const designElement = document.querySelector(`[data-design-index="${index}"]`);
        if (designElement) {
            designElement.style.display = design.view === currentView ? 'block' : 'none';
        }
    });
}

// Image Upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        addDesign({
            type: 'image',
            src: e.target.result,
            view: currentView,
            x: 50,
            y: 50,
            size: 100,
            rotation: 0
        });
    };
    reader.readAsDataURL(file);
    
    // Reset input
    event.target.value = '';
}

// Text Design Functions
function addTextDesign() {
    document.getElementById('textDesignGroup').style.display = 'block';
    document.getElementById('textInput').focus();
}

function updateTextStyle() {
    const fontSize = document.getElementById('fontSize').value;
    const color = document.getElementById('textColor').value;
    const fontFamily = document.getElementById('fontFamily').value;
    
    document.getElementById('fontSizeValue').textContent = fontSize + 'px';
    
    currentTextDesign = {
        text: document.getElementById('textInput').value,
        fontSize: parseInt(fontSize),
        color: color,
        fontFamily: fontFamily
    };
}

function applyTextDesign() {
    const text = document.getElementById('textInput').value.trim();
    if (!text) {
        alert('Please enter some text');
        return;
    }

    addDesign({
        type: 'text',
        text: text,
        fontSize: currentTextDesign.fontSize,
        color: currentTextDesign.color,
        fontFamily: currentTextDesign.fontFamily,
        view: currentView,
        x: 50,
        y: 50,
        size: 100,
        rotation: 0
    });

    // Reset text input
    document.getElementById('textInput').value = '';
    document.getElementById('textDesignGroup').style.display = 'none';
}

// Add Design
function addDesign(designData) {
    const design = {
        id: Date.now(),
        ...designData
    };
    
    designs.push(design);
    renderDesign(design, designs.length - 1);
    updateDesignsList();
    selectDesign(designs.length - 1);
}

// Render Design on T-Shirt
function renderDesign(design, index) {
    const designLayer = document.getElementById('designLayer');
    const designItem = document.createElement('div');
    designItem.className = 'design-item';
    designItem.setAttribute('data-design-index', index);
    designItem.style.display = design.view === currentView ? 'block' : 'none';
    
    if (design.type === 'image') {
        const img = document.createElement('img');
        img.src = design.src;
        img.alt = 'Custom Design';
        designItem.appendChild(img);
    } else if (design.type === 'text') {
        const textDiv = document.createElement('div');
        textDiv.className = 'text-design';
        textDiv.textContent = design.text;
        textDiv.style.fontSize = design.fontSize + 'px';
        textDiv.style.color = design.color;
        textDiv.style.fontFamily = design.fontFamily;
        designItem.appendChild(textDiv);
    }
    
    // Position and size
    updateDesignElementPosition(designItem, design);
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteDesign(index);
    };
    designItem.appendChild(deleteBtn);
    
    // Click to select
    designItem.onclick = (e) => {
        if (e.target !== deleteBtn) {
            selectDesign(index);
        }
    };
    
    designLayer.appendChild(designItem);
}

// Update Design Element Position
function updateDesignElementPosition(element, design) {
    element.style.left = design.x + '%';
    element.style.top = design.y + '%';
    element.style.transform = `translate(-50%, -50%) scale(${design.size / 100}) rotate(${design.rotation}deg)`;
}

// Select Design
function selectDesign(index) {
    activeDesignIndex = index;
    
    // Update UI
    document.querySelectorAll('.design-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    document.querySelectorAll('.design-item-card').forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    
    // Update position controls
    if (index >= 0 && designs[index]) {
        const design = designs[index];
        document.getElementById('posX').value = design.x;
        document.getElementById('posY').value = design.y;
        document.getElementById('designSize').value = design.size;
        document.getElementById('designRotation').value = design.rotation;
        
        document.getElementById('posXValue').textContent = design.x + '%';
        document.getElementById('posYValue').textContent = design.y + '%';
        document.getElementById('sizeValue').textContent = design.size + '%';
        document.getElementById('rotationValue').textContent = design.rotation + '°';
        
        document.getElementById('positionControls').style.display = 'block';
    } else {
        document.getElementById('positionControls').style.display = 'none';
    }
}

// Update Design Position
function updateDesignPosition() {
    if (activeDesignIndex < 0 || !designs[activeDesignIndex]) return;
    
    const design = designs[activeDesignIndex];
    design.x = parseInt(document.getElementById('posX').value);
    design.y = parseInt(document.getElementById('posY').value);
    design.size = parseInt(document.getElementById('designSize').value);
    design.rotation = parseInt(document.getElementById('designRotation').value);
    
    document.getElementById('posXValue').textContent = design.x + '%';
    document.getElementById('posYValue').textContent = design.y + '%';
    document.getElementById('sizeValue').textContent = design.size + '%';
    document.getElementById('rotationValue').textContent = design.rotation + '°';
    
    const designElement = document.querySelector(`[data-design-index="${activeDesignIndex}"]`);
    if (designElement) {
        updateDesignElementPosition(designElement, design);
    }
}

// Delete Design
function deleteDesign(index) {
    designs.splice(index, 1);
    renderAllDesigns();
    updateDesignsList();
    
    if (activeDesignIndex === index) {
        activeDesignIndex = -1;
        document.getElementById('positionControls').style.display = 'none';
    } else if (activeDesignIndex > index) {
        activeDesignIndex--;
    }
}

// Render All Designs
function renderAllDesigns() {
    const designLayer = document.getElementById('designLayer');
    designLayer.innerHTML = '';
    
    designs.forEach((design, index) => {
        renderDesign(design, index);
    });
}

// Update Designs List
function updateDesignsList() {
    const designsList = document.getElementById('designsList');
    
    if (designs.length === 0) {
        designsList.innerHTML = '<p class="no-designs">No designs added yet</p>';
        return;
    }
    
    designsList.innerHTML = designs.map((design, index) => {
        const preview = design.type === 'image' 
            ? `<img src="${design.src}" alt="Design">`
            : `<div class="text-preview" style="font-size: ${Math.min(design.fontSize / 2, 12)}px; color: ${design.color}; font-family: ${design.fontFamily}">${design.text}</div>`;
        
        return `
            <div class="design-item-card ${index === activeDesignIndex ? 'active' : ''}" onclick="selectDesign(${index})">
                <div class="design-preview">${preview}</div>
                <div class="design-info">
                    <div class="design-name">${design.type === 'image' ? 'Image Design' : design.text}</div>
                    <div class="design-type">${design.type === 'image' ? 'Image' : 'Text'} • ${design.view === 'front' ? 'Front' : 'Back'}</div>
                </div>
                <div class="design-actions">
                    <button class="btn-delete" onclick="event.stopPropagation(); deleteDesign(${index})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Drag and Drop
function initializeDragAndDrop() {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseDown(e) {
    const designItem = e.target.closest('.design-item');
    if (!designItem || e.target.classList.contains('delete-btn')) return;
    
    const index = parseInt(designItem.getAttribute('data-design-index'));
    if (index >= 0 && designs[index]) {
        isDragging = true;
        selectDesign(index);
        
        const rect = designItem.parentElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        dragOffset.x = x - (designs[index].x / 100 * rect.width);
        dragOffset.y = y - (designs[index].y / 100 * rect.height);
    }
}

function handleMouseMove(e) {
    if (!isDragging || activeDesignIndex < 0) return;
    
    const designLayer = document.getElementById('designLayer');
    const rect = designLayer.getBoundingClientRect();
    const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;
    
    // Constrain to bounds
    const constrainedX = Math.max(0, Math.min(100, x));
    const constrainedY = Math.max(0, Math.min(100, y));
    
    designs[activeDesignIndex].x = constrainedX;
    designs[activeDesignIndex].y = constrainedY;
    
    document.getElementById('posX').value = constrainedX;
    document.getElementById('posY').value = constrainedY;
    document.getElementById('posXValue').textContent = Math.round(constrainedX) + '%';
    document.getElementById('posYValue').textContent = Math.round(constrainedY) + '%';
    
    const designElement = document.querySelector(`[data-design-index="${activeDesignIndex}"]`);
    if (designElement) {
        updateDesignElementPosition(designElement, designs[activeDesignIndex]);
    }
}

function handleMouseUp() {
    isDragging = false;
}

// Reset Customization
function resetCustomization() {
    if (confirm('Are you sure you want to reset all customizations?')) {
        designs = [];
        activeDesignIndex = -1;
        renderAllDesigns();
        updateDesignsList();
        document.getElementById('positionControls').style.display = 'none';
        updateTshirtColor('#ffffff');
        document.getElementById('tshirtColor').value = '#ffffff';
        document.getElementById('textInput').value = '';
        document.getElementById('textDesignGroup').style.display = 'none';
    }
}

// Add to Cart
async function addCustomizedToCart() {
    if (designs.length === 0) {
        alert('Please add at least one design before adding to cart');
        return;
    }
    
    // Create a canvas to generate preview image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const preview = document.getElementById('tshirtPreview');
    
    canvas.width = 800;
    canvas.height = 960; // Maintain aspect ratio
    
    // Draw t-shirt background
    const tshirtColor = document.getElementById('tshirtColor').value || '#ffffff';
    ctx.fillStyle = tshirtColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Load and draw all designs
    const imagePromises = [];
    const designData = [];
    
    designs.forEach(design => {
        if (design.view === currentView) {
            const x = (design.x / 100) * canvas.width;
            const y = (design.y / 100) * canvas.height;
            const size = (design.size / 100);
            
            if (design.type === 'image') {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                const promise = new Promise((resolve) => {
                    img.onload = function() {
                        ctx.save();
                        ctx.translate(x, y);
                        ctx.rotate((design.rotation * Math.PI) / 180);
                        ctx.scale(size, size);
                        ctx.drawImage(img, -img.width / 2, -img.height / 2);
                        ctx.restore();
                        resolve();
                    };
                    img.onerror = resolve; // Continue even if image fails to load
                    img.src = design.src;
                });
                imagePromises.push(promise);
            } else if (design.type === 'text') {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate((design.rotation * Math.PI) / 180);
                ctx.font = `${design.fontSize * size}px ${design.fontFamily}`;
                ctx.fillStyle = design.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(design.text, 0, 0);
                ctx.restore();
            }
        }
    });
    
    // Wait for all images to load
    await Promise.all(imagePromises);
    
    // Convert canvas to data URL
    const previewImage = canvas.toDataURL('image/png');
    
    // Create product data
    const customizedProduct = {
        name: 'Customized T-Shirt',
        price: 599,
        image: previewImage,
        quantity: 1,
        customization: {
            tshirtColor: tshirtColor,
            designs: designs.map(d => ({
                type: d.type,
                view: d.view,
                x: d.x,
                y: d.y,
                size: d.size,
                rotation: d.rotation,
                ...(d.type === 'image' ? { src: d.src } : {
                    text: d.text,
                    fontSize: d.fontSize,
                    color: d.color,
                    fontFamily: d.fontFamily
                })
            }))
        }
    };
    
    // Add to cart
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(customizedProduct);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    
    alert('Customized T-Shirt added to cart!');
    
    // Optionally redirect to cart
    // window.location.href = 'cart.html';
}

// Make functions globally available
window.updateTshirtColor = updateTshirtColor;
window.setTshirtColor = setTshirtColor;
window.switchView = switchView;
window.handleImageUpload = handleImageUpload;
window.addTextDesign = addTextDesign;
window.updateTextStyle = updateTextStyle;
window.applyTextDesign = applyTextDesign;
window.updateDesignPosition = updateDesignPosition;
window.selectDesign = selectDesign;
window.deleteDesign = deleteDesign;
window.resetCustomization = resetCustomization;
window.addCustomizedToCart = addCustomizedToCart;

