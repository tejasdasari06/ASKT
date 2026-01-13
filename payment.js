// Payment page functionality
document.addEventListener('DOMContentLoaded', () => {
    renderOrderSummary();
    setupPaymentMethods();
    setupShippingOptions();
    setupBillingAddress();
    setupPlaceOrder();
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    } else {
        // Fallback
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('#cartCount');
        cartCountElements.forEach(el => {
            if (el) el.textContent = count;
        });
    }
});

// Render order summary
function renderOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('orderItems');
    
    if (!orderItems) return;
    
    if (cart.length === 0) {
        orderItems.innerHTML = '<p>Your cart is empty. <a href="index.html#products">Continue Shopping</a></p>';
        return;
    }
    
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-image">${item.image}</div>
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-info">Quantity: ${item.quantity} × $${item.price.toFixed(2)}</div>
            </div>
            <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    updateOrderTotals();
}

// Update order totals
function updateOrderTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Get selected shipping
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    const shippingPrice = selectedShipping ? parseFloat(selectedShipping.value === 'standard' ? 5.99 : selectedShipping.value === 'express' ? 12.99 : 24.99) : 5.99;
    
    const tax = subtotal * 0.08;
    const total = subtotal + shippingPrice + tax;
    
    document.getElementById('orderSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('orderShipping').textContent = shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`;
    document.getElementById('orderTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('orderTotal').textContent = `$${total.toFixed(2)}`;
}

// Setup payment method switching
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardForm = document.getElementById('creditCardForm');
    const paypalForm = document.getElementById('paypalForm');
    const otherPaymentForm = document.getElementById('otherPaymentForm');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', () => {
            const value = method.value;
            
            // Hide all forms
            creditCardForm.style.display = 'none';
            paypalForm.style.display = 'none';
            otherPaymentForm.style.display = 'none';
            
            // Show selected form
            if (value === 'credit') {
                creditCardForm.style.display = 'block';
            } else if (value === 'paypal') {
                paypalForm.style.display = 'block';
            } else {
                otherPaymentForm.style.display = 'block';
            }
        });
    });
}

// Setup shipping options
function setupShippingOptions() {
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', () => {
            updateOrderTotals();
        });
    });
}

// Setup billing address toggle
function setupBillingAddress() {
    const sameAsBilling = document.getElementById('sameAsBilling');
    const billingSection = document.getElementById('billingSection');
    
    if (sameAsBilling && billingSection) {
        sameAsBilling.addEventListener('change', () => {
            if (sameAsBilling.checked) {
                billingSection.style.display = 'none';
                // Copy shipping address to billing (simplified)
                const billingInputs = billingSection.querySelectorAll('input, select');
                billingInputs.forEach(input => {
                    input.removeAttribute('required');
                });
            } else {
                billingSection.style.display = 'block';
                const billingInputs = billingSection.querySelectorAll('input, select');
                billingInputs.forEach(input => {
                    input.setAttribute('required', 'required');
                });
            }
        });
    }
}

// Format card number input
document.addEventListener('DOMContentLoaded', () => {
    const cardNumberInput = document.querySelector('#creditCardForm input[type="text"]');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Format expiry date
    const expiryInput = document.querySelector('#creditCardForm input[placeholder="MM/YY"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Format CVV (numbers only)
    const cvvInput = document.querySelector('#creditCardForm input[placeholder="123"]');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
});

// Place order
function setupPlaceOrder() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (!placeOrderBtn) return;
    
    placeOrderBtn.addEventListener('click', () => {
        // Validate forms
        const shippingForm = document.getElementById('shippingForm');
        const billingForm = document.getElementById('billingForm');
        const sameAsBilling = document.getElementById('sameAsBilling');
        
        if (!shippingForm.checkValidity()) {
            shippingForm.reportValidity();
            return;
        }
        
        if (!sameAsBilling.checked && !billingForm.checkValidity()) {
            billingForm.reportValidity();
            return;
        }
        
        // Check payment method
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
        if (!selectedPayment) {
            alert('Please select a payment method');
            return;
        }
        
        // Validate payment form based on selected method
        if (selectedPayment.value === 'credit') {
            const creditForm = document.getElementById('creditCardForm');
            const creditInputs = creditForm.querySelectorAll('input[required]');
            let isValid = true;
            creditInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.reportValidity();
                }
            });
            if (!isValid) return;
        } else if (selectedPayment.value === 'paypal') {
            const paypalInput = document.querySelector('#paypalForm input[type="email"]');
            if (!paypalInput.value.trim()) {
                paypalInput.reportValidity();
                return;
            }
        }
        
        // Process order
        processOrder();
    });
}

// Process order
function processOrder() {
    // Generate order number
    const orderNumber = 'FF' + Date.now().toString().slice(-8);
    
    // Get cart items
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Get shipping form data
    const shippingForm = document.getElementById('shippingForm');
    const shippingInputs = Array.from(shippingForm.querySelectorAll('input:not([type="checkbox"]), select'));
    
    // Extract shipping data by position
    const shippingFirstName = shippingInputs[0]?.value || '';
    const shippingLastName = shippingInputs[1]?.value || '';
    const shippingEmail = shippingInputs[2]?.value || '';
    const shippingPhone = shippingInputs[3]?.value || '';
    const shippingAddress = shippingInputs[4]?.value || '';
    const shippingCity = shippingInputs[5]?.value || '';
    const shippingState = shippingInputs[6]?.value || '';
    const shippingZip = shippingInputs[7]?.value || '';
    const shippingCountry = shippingInputs[8]?.value || '';
    
    // Get billing form data
    const billingForm = document.getElementById('billingForm');
    const sameAsBilling = document.getElementById('sameAsBilling').checked;
    let billingData = {};
    
    if (sameAsBilling) {
        // Use shipping address as billing
        billingData = {
            firstName: shippingFirstName,
            lastName: shippingLastName,
            address: shippingAddress,
            city: shippingCity,
            state: shippingState,
            zip: shippingZip,
            country: shippingCountry
        };
    } else {
        const billingInputs = Array.from(billingForm.querySelectorAll('input, select'));
        billingData = {
            firstName: billingInputs[0]?.value || '',
            lastName: billingInputs[1]?.value || '',
            address: billingInputs[2]?.value || '',
            city: billingInputs[3]?.value || '',
            state: billingInputs[4]?.value || '',
            zip: billingInputs[5]?.value || '',
            country: billingInputs[6]?.value || ''
        };
    }
    
    // Get payment method
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    const paymentMethod = selectedPayment.value;
    let paymentDetails = {};
    
    if (paymentMethod === 'credit') {
        const creditInputs = document.querySelectorAll('#creditCardForm input');
        paymentDetails = {
            cardNumber: creditInputs[0]?.value || '',
            expiryDate: creditInputs[1]?.value || '',
            cvv: creditInputs[2]?.value || '',
            cardholderName: creditInputs[3]?.value || ''
        };
    } else if (paymentMethod === 'paypal') {
        const paypalInput = document.querySelector('#paypalForm input[type="email"]');
        paymentDetails = {
            email: paypalInput?.value || ''
        };
    }
    
    // Get shipping method
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    const shippingMethod = selectedShipping.value;
    const shippingPrice = shippingMethod === 'standard' ? 5.99 : shippingMethod === 'express' ? 12.99 : 24.99;
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + shippingPrice + tax;
    
    // Build complete order data object
    const orderData = {
        orderNumber: orderNumber,
        orderDate: new Date().toISOString(),
        customer: {
            firstName: shippingFirstName,
            lastName: shippingLastName,
            email: shippingEmail,
            phone: shippingPhone
        },
        shipping: {
            address: shippingAddress,
            city: shippingCity,
            state: shippingState,
            zip: shippingZip,
            country: shippingCountry,
            method: shippingMethod,
            cost: shippingPrice
        },
        billing: billingData,
        payment: {
            method: paymentMethod,
            details: paymentDetails
        },
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            subtotal: item.price * item.quantity
        })),
        orderSummary: {
            subtotal: subtotal.toFixed(2),
            shipping: shippingPrice.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        }
    };
    
    // Save order using orderManager
    if (typeof saveOrder === 'function') {
        saveOrder(orderData);
        console.log('Order saved successfully:', orderNumber);
    } else {
        // Fallback: save directly to localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
        console.log('Order saved (fallback):', orderNumber);
    }
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Show success modal
    const modal = document.getElementById('successModal');
    document.getElementById('orderNumber').textContent = orderNumber;
    modal.style.display = 'flex';
    
    // Update cart count
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}

// Close modal on click outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

