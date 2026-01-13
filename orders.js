// Orders page functionality
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    displayStatistics();
});

// Load and display all orders
function loadOrders() {
    const orders = getAllOrders();
    const ordersList = document.getElementById('ordersList');
    const emptyOrders = document.getElementById('emptyOrders');
    
    if (!ordersList) return;
    
    if (orders.length === 0) {
        ordersList.style.display = 'none';
        emptyOrders.style.display = 'block';
        return;
    }
    
    ordersList.style.display = 'flex';
    emptyOrders.style.display = 'none';
    
    // Sort orders by date (newest first)
    const sortedOrders = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    ordersList.innerHTML = sortedOrders.map(order => {
        const formatted = formatOrderForDisplay(order);
        return `
            <div class="order-card" onclick="viewOrderDetails('${order.orderNumber}')">
                <div class="order-header">
                    <div>
                        <div class="order-number">Order #${order.orderNumber}</div>
                        <div class="order-date">${formatted.date}</div>
                    </div>
                    <div class="order-total">${formatted.total}</div>
                </div>
                <div class="order-info">
                    <div class="info-item">
                        <span class="info-label">Customer</span>
                        <span class="info-value">${formatted.customer}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email</span>
                        <span class="info-value">${formatted.email}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Phone</span>
                        <span class="info-value">${formatted.phone}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Payment</span>
                        <span class="info-value">${formatted.paymentMethod}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Shipping</span>
                        <span class="info-value">${formatted.shippingMethod}</span>
                    </div>
                </div>
                <div class="order-items-preview">
                    <p><strong>Items:</strong> ${formatted.items}</p>
                </div>
                <div class="order-actions">
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); viewOrderDetails('${order.orderNumber}')">View Details</button>
                    <button class="btn btn-success btn-small" onclick="event.stopPropagation(); downloadBill('${order.orderNumber}', event)">📄 Download PDF</button>
                    <button class="btn btn-print btn-small" onclick="event.stopPropagation(); printBill('${order.orderNumber}')">🖨️ Print</button>
                    <button class="btn btn-danger btn-small" onclick="event.stopPropagation(); deleteOrderConfirm('${order.orderNumber}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Display statistics
function displayStatistics() {
    const stats = getOrderStatistics();
    const statisticsDiv = document.getElementById('statistics');
    
    if (!statisticsDiv) return;
    
    statisticsDiv.innerHTML = `
        <div class="stat-card">
            <h3>${stats.totalOrders}</h3>
            <p>Total Orders</p>
        </div>
        <div class="stat-card">
            <h3>$${stats.totalRevenue}</h3>
            <p>Total Revenue</p>
        </div>
        <div class="stat-card">
            <h3>$${stats.averageOrderValue}</h3>
            <p>Average Order Value</p>
        </div>
        <div class="stat-card">
            <h3>${stats.totalItems}</h3>
            <p>Total Items Sold</p>
        </div>
    `;
}

// View order details
function viewOrderDetails(orderNumber) {
    const order = getOrderByNumber(orderNumber);
    if (!order) {
        alert('Order not found');
        return;
    }
    
    const modal = document.getElementById('orderModal');
    const detailsDiv = document.getElementById('orderDetails');
    
    // Format payment details (hide sensitive info)
    let paymentInfo = '';
    if (order.payment.method === 'credit') {
        const cardNumber = order.payment.details.cardNumber || '';
        const maskedCard = cardNumber.length > 4 ? '**** **** **** ' + cardNumber.slice(-4) : '****';
        paymentInfo = `
            <div class="detail-item">
                <span class="detail-label">Card Number</span>
                <span class="detail-value">${maskedCard}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Expiry Date</span>
                <span class="detail-value">${order.payment.details.expiryDate || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Cardholder Name</span>
                <span class="detail-value">${order.payment.details.cardholderName || 'N/A'}</span>
            </div>
        `;
    } else if (order.payment.method === 'paypal') {
        paymentInfo = `
            <div class="detail-item">
                <span class="detail-label">PayPal Email</span>
                <span class="detail-value">${order.payment.details.email || 'N/A'}</span>
            </div>
        `;
    }
    
    detailsDiv.innerHTML = `
        <h2 style="color: var(--primary-color); margin-bottom: 1.5rem;">Order #${order.orderNumber}</h2>
        
        <div class="order-details-section">
            <h3>Order Information</h3>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Order Date</span>
                    <span class="detail-value">${new Date(order.orderDate).toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Order Total</span>
                    <span class="detail-value">$${order.orderSummary.total}</span>
                </div>
            </div>
        </div>
        
        <div class="order-details-section">
            <h3>Customer Information</h3>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Name</span>
                    <span class="detail-value">${order.customer.firstName} ${order.customer.lastName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${order.customer.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Phone</span>
                    <span class="detail-value">${order.customer.phone}</span>
                </div>
            </div>
        </div>
        
        <div class="order-details-section">
            <h3>Shipping Address</h3>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Address</span>
                    <span class="detail-value">${order.shipping.address}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">City</span>
                    <span class="detail-value">${order.shipping.city}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">State</span>
                    <span class="detail-value">${order.shipping.state}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">ZIP Code</span>
                    <span class="detail-value">${order.shipping.zip}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Country</span>
                    <span class="detail-value">${order.shipping.country}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Shipping Method</span>
                    <span class="detail-value">${order.shipping.method} ($${order.shipping.cost})</span>
                </div>
            </div>
        </div>
        
        <div class="order-details-section">
            <h3>Billing Address</h3>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Name</span>
                    <span class="detail-value">${order.billing.firstName} ${order.billing.lastName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Address</span>
                    <span class="detail-value">${order.billing.address}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">City</span>
                    <span class="detail-value">${order.billing.city}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">State</span>
                    <span class="detail-value">${order.billing.state}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">ZIP Code</span>
                    <span class="detail-value">${order.billing.zip}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Country</span>
                    <span class="detail-value">${order.billing.country}</span>
                </div>
            </div>
        </div>
        
        <div class="order-details-section">
            <h3>Payment Information</h3>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Payment Method</span>
                    <span class="detail-value">${order.payment.method.charAt(0).toUpperCase() + order.payment.method.slice(1)}</span>
                </div>
                ${paymentInfo}
            </div>
        </div>
        
        <div class="order-details-section">
            <h3>Order Items</h3>
            <div class="items-list">
                ${order.items.map(item => `
                    <div class="item-row">
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                            <div class="item-details">Quantity: ${item.quantity} × $${item.price.toFixed(2)}</div>
                        </div>
                        <div class="item-price">$${item.subtotal.toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="order-details-section">
            <h3>Order Summary</h3>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Subtotal</span>
                    <span class="detail-value">$${order.orderSummary.subtotal}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Shipping</span>
                    <span class="detail-value">$${order.orderSummary.shipping}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Tax</span>
                    <span class="detail-value">$${order.orderSummary.tax}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Total</span>
                    <span class="detail-value" style="font-size: 1.3rem; color: var(--secondary-color);">$${order.orderSummary.total}</span>
                </div>
            </div>
        </div>
    `;
    
    // Add action buttons in modal
    const modalActions = document.getElementById('modalActions');
    if (modalActions) {
        modalActions.innerHTML = `
            <button class="btn btn-success" onclick="downloadBill('${order.orderNumber}', event)">📄 Download PDF</button>
            <button class="btn btn-print" onclick="printBill('${order.orderNumber}')">🖨️ Print Bill</button>
        `;
    }
    
    modal.style.display = 'flex';
}

// Close order modal
function closeOrderModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// Delete order confirmation
function deleteOrderConfirm(orderNumber) {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
        if (deleteOrder(orderNumber)) {
            loadOrders();
            displayStatistics();
            alert('Order deleted successfully');
        } else {
            alert('Failed to delete order');
        }
    }
}

// Refresh orders
function refreshOrders() {
    loadOrders();
    displayStatistics();
}

// Generate and download bill as PDF
function downloadBill(orderNumber, event) {
    const order = getOrderByNumber(orderNumber);
    if (!order) {
        alert('Order not found');
        return;
    }
    
    // Check if html2pdf is available
    if (typeof html2pdf === 'undefined') {
        alert('PDF generation library is loading. Please wait a moment and try again.');
        return;
    }
    
    // Show loading message
    const originalText = event?.target?.textContent || 'Downloading...';
    if (event?.target) {
        event.target.textContent = 'Generating PDF...';
        event.target.disabled = true;
    }
    
    // Generate bill HTML
    const billHTML = generateBillHTML(order);
    const billTemplate = document.getElementById('billTemplate');
    
    // Make template visible temporarily for PDF generation
    billTemplate.style.position = 'absolute';
    billTemplate.style.left = '-9999px';
    billTemplate.style.width = '800px';
    billTemplate.innerHTML = billHTML;
    
    // Wait a moment for rendering
    setTimeout(() => {
        // Get the bill element
        const billElement = billTemplate.querySelector('.bill-container');
        
        if (!billElement) {
            alert('Error: Could not generate bill content');
            billTemplate.innerHTML = '';
            if (event?.target) {
                event.target.textContent = originalText;
                event.target.disabled = false;
            }
            return;
        }
        
        // Configure PDF options
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `Invoice_${order.orderNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true,
                logging: false,
                windowWidth: 800
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        // Generate and download PDF
        html2pdf().set(opt).from(billElement).save().then(() => {
            // Clear the template after download
            billTemplate.innerHTML = '';
            billTemplate.style.position = '';
            billTemplate.style.left = '';
            billTemplate.style.width = '';
            
            // Restore button
            if (event?.target) {
                event.target.textContent = originalText;
                event.target.disabled = false;
            }
        }).catch((error) => {
            console.error('PDF generation error:', error);
            alert('Error generating PDF. Please try again or use the Print option.');
            billTemplate.innerHTML = '';
            billTemplate.style.position = '';
            billTemplate.style.left = '';
            billTemplate.style.width = '';
            
            // Restore button
            if (event?.target) {
                event.target.textContent = originalText;
                event.target.disabled = false;
            }
        });
    }, 100);
}

// Print bill
function printBill(orderNumber) {
    const order = getOrderByNumber(orderNumber);
    if (!order) {
        alert('Order not found');
        return;
    }
    
    const billHTML = generateBillHTML(order);
    const billTemplate = document.getElementById('billTemplate');
    billTemplate.innerHTML = billHTML;
    
    // Close modal if open
    closeOrderModal();
    
    // Trigger print
    window.print();
}

// Generate bill HTML
function generateBillHTML(order) {
    const orderDate = new Date(order.orderDate);
    const formattedDate = orderDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Format payment method
    let paymentMethod = order.payment.method.charAt(0).toUpperCase() + order.payment.method.slice(1);
    if (order.payment.method === 'credit') {
        const cardNumber = order.payment.details.cardNumber || '';
        if (cardNumber.length > 4) {
            paymentMethod += ` (****${cardNumber.slice(-4)})`;
        }
    }
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Invoice - ${order.orderNumber}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Inter', Arial, sans-serif;
                    color: #333;
                    line-height: 1.6;
                    background: white;
                }
                .bill-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px;
                }
                .bill-header {
                    text-align: center;
                    border-bottom: 3px solid #d4af37;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .bill-header h1 {
                    color: #1a1a1a;
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                    font-family: 'Playfair Display', serif;
                }
                .bill-header p {
                    color: #666;
                    font-size: 0.9rem;
                }
                .bill-section {
                    margin-bottom: 25px;
                }
                .bill-section h2 {
                    color: #1a1a1a;
                    font-size: 1.3rem;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e0e0e0;
                }
                .bill-section h3 {
                    color: #1a1a1a;
                    font-size: 1.1rem;
                    margin-bottom: 15px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #e0e0e0;
                }
                .bill-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #f0f0f0;
                }
                .bill-address-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                @media print {
                    .bill-address-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                @media (max-width: 600px) {
                    .bill-address-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .bill-row-label {
                    font-weight: 600;
                    color: #333;
                }
                .bill-row-value {
                    color: #666;
                }
                .bill-items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                .bill-items-table th {
                    background: #f8f9fa;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    color: #1a1a1a;
                    border-bottom: 2px solid #e0e0e0;
                }
                .bill-items-table td {
                    padding: 12px;
                    border-bottom: 1px solid #f0f0f0;
                }
                .bill-items-table tr:last-child td {
                    border-bottom: none;
                }
                .bill-total {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                .bill-total-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    font-size: 1rem;
                }
                .bill-total-row.final {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #d4af37;
                    border-top: 2px solid #d4af37;
                    padding-top: 15px;
                    margin-top: 10px;
                }
                .bill-footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #e0e0e0;
                    text-align: center;
                    color: #666;
                    font-size: 0.9rem;
                }
                @media print {
                    @page {
                        margin: 1cm;
                    }
                    body {
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            <div class="bill-container">
                <div class="bill-header">
                    <h1>Fashion Forward</h1>
                    <p>123 Fashion Street, New York, NY 10001</p>
                    <p>Phone: +1 (555) 123-4567 | Email: info@fashionforward.com</p>
                </div>
                
                <div class="bill-section">
                    <h2>Invoice Details</h2>
                    <div class="bill-row">
                        <span class="bill-row-label">Invoice Number:</span>
                        <span class="bill-row-value">${order.orderNumber}</span>
                    </div>
                    <div class="bill-row">
                        <span class="bill-row-label">Invoice Date:</span>
                        <span class="bill-row-value">${formattedDate}</span>
                    </div>
                    <div class="bill-row">
                        <span class="bill-row-label">Order Status:</span>
                        <span class="bill-row-value" style="color: #27ae60; font-weight: 700;">Confirmed</span>
                    </div>
                </div>
                
                <div class="bill-section">
                    <h2>Customer Contact Information</h2>
                    <div class="bill-row">
                        <span class="bill-row-label">Full Name:</span>
                        <span class="bill-row-value">${order.customer.firstName} ${order.customer.lastName}</span>
                    </div>
                    <div class="bill-row">
                        <span class="bill-row-label">Email Address:</span>
                        <span class="bill-row-value">${order.customer.email}</span>
                    </div>
                    <div class="bill-row">
                        <span class="bill-row-label">Phone Number:</span>
                        <span class="bill-row-value">${order.customer.phone}</span>
                    </div>
                </div>
                
                <div class="bill-section">
                    <h2>Customer Addresses</h2>
                    <div class="bill-address-grid">
                        <div>
                            <h3>Billing Address</h3>
                            <div class="bill-row">
                                <span class="bill-row-label">Name:</span>
                                <span class="bill-row-value">${order.billing.firstName} ${order.billing.lastName}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-row-label">Address:</span>
                                <span class="bill-row-value">${order.billing.address}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-row-label">City:</span>
                                <span class="bill-row-value">${order.billing.city}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-row-label">State:</span>
                                <span class="bill-row-value">${order.billing.state}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-row-label">ZIP Code:</span>
                                <span class="bill-row-value">${order.billing.zip}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-row-label">Country:</span>
                                <span class="bill-row-value">${order.billing.country}</span>
                            </div>
                        </div>
                        <div>
                            <h3>Shipping Address</h3>
                            <div class="bill-row">
                                <span class="bill-row-label">Name:</span>
                                <span class="bill-row-value">${order.customer.firstName} ${order.customer.lastName}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-row-label">Address:</span>
                                <span class="bill-row-value">${order.shipping.address}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-row-label">City:</span>
                                <span class="bill-row-value">${order.shipping.city}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-row-label">State:</span>
                                <span class="bill-row-value">${order.shipping.state}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-row-label">ZIP Code:</span>
                                <span class="bill-row-value">${order.shipping.zip}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-row-label">Country:</span>
                                <span class="bill-row-value">${order.shipping.country}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-row-label">Shipping Method:</span>
                                <span class="bill-row-value">${order.shipping.method.charAt(0).toUpperCase() + order.shipping.method.slice(1)} ($${order.shipping.cost})</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bill-section">
                    <h2>Payment Information</h2>
                    <div class="bill-row">
                        <span class="bill-row-label">Payment Method:</span>
                        <span class="bill-row-value">${paymentMethod}</span>
                    </div>
                    ${order.payment.method === 'credit' && order.payment.details.cardholderName ? `
                    <div class="bill-row">
                        <span class="bill-row-label">Cardholder Name:</span>
                        <span class="bill-row-value">${order.payment.details.cardholderName}</span>
                    </div>
                    ` : ''}
                    ${order.payment.method === 'paypal' && order.payment.details.email ? `
                    <div class="bill-row">
                        <span class="bill-row-label">PayPal Email:</span>
                        <span class="bill-row-value">${order.payment.details.email}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="bill-section">
                    <h2>Items</h2>
                    <table class="bill-items-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${item.price.toFixed(2)}</td>
                                    <td>$${item.subtotal.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="bill-total">
                    <div class="bill-total-row">
                        <span>Subtotal:</span>
                        <span>$${order.orderSummary.subtotal}</span>
                    </div>
                    <div class="bill-total-row">
                        <span>Shipping:</span>
                        <span>$${order.orderSummary.shipping}</span>
                    </div>
                    <div class="bill-total-row">
                        <span>Tax:</span>
                        <span>$${order.orderSummary.tax}</span>
                    </div>
                    <div class="bill-total-row final">
                        <span>Total Amount:</span>
                        <span>$${order.orderSummary.total}</span>
                    </div>
                </div>
                
                <div class="bill-footer">
                    <p>Thank you for your business!</p>
                    <p>This is a computer-generated invoice and does not require a signature.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('orderModal');
    if (e.target === modal) {
        closeOrderModal();
    }
});



