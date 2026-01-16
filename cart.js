// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Product data
const products = {
    // Original products
    'Classic T-Shirt': { name: 'Classic T-Shirt', price: 29.99, image: 'T-Shirt' },
    'Premium Jeans': { name: 'Premium Jeans', price: 79.99, image: 'Jeans' },
    'Designer Jacket': { name: 'Designer Jacket', price: 129.99, image: 'Jacket' },
    'Elegant Dress': { name: 'Elegant Dress', price: 89.99, image: 'Dress' },
    'Stylish Shoes': { name: 'Stylish Shoes', price: 99.99, image: 'Shoes' },
    'Fashion Accessories': { name: 'Fashion Accessories', price: 39.99, image: 'Accessories' },
    // Men's products
    'Classic White Dress Shirt': { name: 'Classic White Dress Shirt', price: 29.99, image: 'Shirt' },
    'Premium Slim Fit Jeans': { name: 'Premium Slim Fit Jeans', price: 79.99, image: 'Jeans' },
    'Leather Biker Jacket': { name: 'Leather Biker Jacket', price: 149.99, image: 'Jacket' },
    'Casual Polo Shirt': { name: 'Casual Polo Shirt', price: 34.99, image: 'Shirt' },
    'Classic Chino Pants': { name: 'Classic Chino Pants', price: 89.99, image: 'Pants' },
    'Leather Dress Shoes': { name: 'Leather Dress Shoes', price: 119.99, image: 'Shoes' },
    'Classic Leather Sneakers': { name: 'Classic Leather Sneakers', price: 99.99, image: 'Shoes' },
    'Designer Watch': { name: 'Designer Watch', price: 49.99, image: 'Watch' },
    // Women's products
    'Elegant Evening Dress': { name: 'Elegant Evening Dress', price: 89.99, image: 'Dress' },
    'Classic Blouse': { name: 'Classic Blouse', price: 39.99, image: 'Blouse' },
    'High-Waist Trousers': { name: 'High-Waist Trousers', price: 69.99, image: 'Pants' },
    'Summer Floral Dress': { name: 'Summer Floral Dress', price: 79.99, image: 'Dress' },
    'Designer Blazer': { name: 'Designer Blazer', price: 129.99, image: 'Jacket' },
    'Classic High Heels': { name: 'Classic High Heels', price: 109.99, image: 'Shoes' },
    'Comfortable Flats': { name: 'Comfortable Flats', price: 89.99, image: 'Shoes' },
    'Designer Handbag': { name: 'Designer Handbag', price: 59.99, image: 'Handbag' }
};

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        if (el) el.textContent = count;
    });
}

// Add item to cart
function addToCart(productName) {
    const product = products[productName];
    if (!product) return;

    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
}

// Remove item from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    saveCart();
    renderCart();
}

// Update item quantity
function updateQuantity(productName, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productName);
        return;
    }
    
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        renderCart();
    }
}

// Calculate totals
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over ₹1000
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
}

// Update quantity by index (for customized products)
function updateQuantityByIndex(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCartByIndex(index);
        return;
    }
    
    if (cart[index]) {
        cart[index].quantity = newQuantity;
        saveCart();
        renderCart();
    }
}

// Remove from cart by index (for customized products)
function removeFromCartByIndex(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }
}

// Render cart items
function renderCart() {
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartContent.style.display = 'grid';
    
    cartItemsList.innerHTML = cart.map((item, index) => {
        // Handle customized products with image data URLs
        let imageHtml = '';
        if (item.image && item.image.startsWith('data:image')) {
            // Customized product with preview image
            imageHtml = `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;">`;
        } else {
            // Regular product
            imageHtml = item.image || 'T-Shirt';
        }
        
        // Create unique identifier for customized products
        const itemId = item.customization ? `custom-${index}` : item.name;
        
        return `
        <div class="cart-item">
            <div class="cart-item-image">${imageHtml}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}${item.customization ? ' <span style="color: #d4af37; font-size: 0.85em;">(Customized)</span>' : ''}</div>
                <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantityByIndex(${index}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="updateQuantityByIndex(${index}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateQuantityByIndex(${index}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCartByIndex(${index})">Remove</button>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    // Update summary
    const { subtotal, shipping, tax, total } = calculateTotals();
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
}

// Apply coupon
function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
    const couponMessage = document.getElementById('couponMessage');
    const validCoupons = {
        'SAVE10': 0.10,
        'SAVE20': 0.20,
        'WELCOME': 0.15
    };
    
    if (validCoupons[couponCode]) {
        const discount = validCoupons[couponCode];
        const { subtotal } = calculateTotals();
        const discountAmount = subtotal * discount;
        const { shipping, tax } = calculateTotals();
        const total = subtotal - discountAmount + shipping + tax;
        
        couponMessage.innerHTML = `
            <div class="coupon-message success">
                Coupon applied! You saved $${discountAmount.toFixed(2)}
            </div>
        `;
        
        // Update total with discount
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        document.getElementById('subtotal').innerHTML = `
            <span style="text-decoration: line-through; color: #999;">$${subtotal.toFixed(2)}</span>
            <span style="margin-left: 10px;">$${(subtotal - discountAmount).toFixed(2)}</span>
        `;
    } else {
        couponMessage.innerHTML = `
            <div class="coupon-message error">
                Invalid coupon code. Try SAVE10, SAVE20, or WELCOME
            </div>
        `;
    }
}

// Initialize cart page
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        renderCart();
        updateCartCount();
        
        const applyCouponBtn = document.getElementById('applyCoupon');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', applyCoupon);
        }
        
        document.getElementById('couponCode').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyCoupon();
            }
        });
    });
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.updateQuantityByIndex = updateQuantityByIndex;
window.removeFromCartByIndex = removeFromCartByIndex;
window.applyCoupon = applyCoupon;
window.calculateTotals = calculateTotals;
window.getCart = () => cart;
window.updateCartCount = updateCartCount;

// Update cart count on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateCartCount);
} else {
    updateCartCount();
}

