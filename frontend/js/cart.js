// Cart Management using localStorage

const CART_KEY = 'askt_cart';

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add item to cart
function addToCart(item) {
    const cart = getCart();
    
    // Check if item already exists (same id and size)
    const existingIndex = cart.findIndex(
        cartItem => cartItem.id === item.id && cartItem.size === item.size
    );

    if (existingIndex > -1) {
        // Update quantity
        cart[existingIndex].quantity += item.quantity || 1;
    } else {
        // Add new item
        cart.push({
            ...item,
            quantity: item.quantity || 1
        });
    }

    saveCart(cart);
    updateCartCount();
}

// Remove item from cart
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartCount();
}

// Clear cart
function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        if (el) el.textContent = totalItems;
    });
}

// Initialize cart count on page load
updateCartCount();
