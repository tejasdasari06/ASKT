// Order Management System
// Automatically saves customer and order data

// Get all orders from storage
function getAllOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    return orders;
}

// Save order to storage
function saveOrder(orderData) {
    const orders = getAllOrders();
    
    // Add timestamp if not provided
    if (!orderData.orderDate) {
        orderData.orderDate = new Date().toISOString();
    }
    
    // Add order to array
    orders.push(orderData);
    
    // Save back to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Also save individual order file (for backup)
    saveOrderToFile(orderData);
    
    return orderData;
}

// Save order as downloadable file
function saveOrderToFile(orderData) {
    // Create a blob with the order data
    const dataStr = JSON.stringify(orderData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Store reference in localStorage for download later
    const orderFiles = JSON.parse(localStorage.getItem('orderFiles')) || [];
    orderFiles.push({
        orderNumber: orderData.orderNumber,
        fileName: `order_${orderData.orderNumber}.json`,
        data: dataStr,
        date: orderData.orderDate
    });
    localStorage.setItem('orderFiles', JSON.stringify(orderFiles));
}

// Get order by order number
function getOrderByNumber(orderNumber) {
    const orders = getAllOrders();
    return orders.find(order => order.orderNumber === orderNumber);
}

// Get orders by customer email
function getOrdersByEmail(email) {
    const orders = getAllOrders();
    return orders.filter(order => order.customer.email === email);
}

// Export all orders as JSON
function exportAllOrders() {
    const orders = getAllOrders();
    const dataStr = JSON.stringify(orders, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_orders_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Export all orders as CSV
function exportOrdersAsCSV() {
    const orders = getAllOrders();
    
    if (orders.length === 0) {
        alert('No orders to export');
        return;
    }
    
    // CSV Headers
    const headers = [
        'Order Number',
        'Order Date',
        'Customer Name',
        'Email',
        'Phone',
        'Shipping Address',
        'City',
        'State',
        'ZIP',
        'Country',
        'Payment Method',
        'Shipping Method',
        'Subtotal',
        'Shipping Cost',
        'Tax',
        'Total',
        'Items Count',
        'Items Details'
    ];
    
    // Convert orders to CSV rows
    const csvRows = [headers.join(',')];
    
    orders.forEach(order => {
        const row = [
            order.orderNumber,
            new Date(order.orderDate).toLocaleString(),
            `"${order.customer.firstName} ${order.customer.lastName}"`,
            order.customer.email,
            order.customer.phone,
            `"${order.shipping.address}"`,
            order.shipping.city,
            order.shipping.state,
            order.shipping.zip,
            order.shipping.country,
            order.payment.method,
            order.shipping.method,
            order.orderSummary.subtotal,
            order.orderSummary.shipping,
            order.orderSummary.tax,
            order.orderSummary.total,
            order.items.length,
            `"${order.items.map(item => `${item.name} (Qty: ${item.quantity})`).join('; ')}"`
        ];
        csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Delete order
function deleteOrder(orderNumber) {
    const orders = getAllOrders();
    const filteredOrders = orders.filter(order => order.orderNumber !== orderNumber);
    localStorage.setItem('orders', JSON.stringify(filteredOrders));
    return filteredOrders.length < orders.length;
}

// Get order statistics
function getOrderStatistics() {
    const orders = getAllOrders();
    
    if (orders.length === 0) {
        return {
            totalOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            totalItems: 0
        };
    }
    
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.orderSummary.total), 0);
    const totalItems = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    
    return {
        totalOrders: orders.length,
        totalRevenue: totalRevenue.toFixed(2),
        averageOrderValue: (totalRevenue / orders.length).toFixed(2),
        totalItems: totalItems
    };
}

// Format order data for display
function formatOrderForDisplay(order) {
    return {
        orderNumber: order.orderNumber,
        date: new Date(order.orderDate).toLocaleString(),
        customer: `${order.customer.firstName} ${order.customer.lastName}`,
        email: order.customer.email,
        phone: order.customer.phone,
        address: `${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}`,
        paymentMethod: order.payment.method,
        shippingMethod: order.shipping.method,
        total: `$${parseFloat(order.orderSummary.total).toFixed(2)}`,
        items: order.items.map(item => `${item.name} x${item.quantity}`).join(', ')
    };
}

// Make functions globally available
window.saveOrder = saveOrder;
window.getAllOrders = getAllOrders;
window.getOrderByNumber = getOrderByNumber;
window.getOrdersByEmail = getOrdersByEmail;
window.exportAllOrders = exportAllOrders;
window.exportOrdersAsCSV = exportOrdersAsCSV;
window.deleteOrder = deleteOrder;
window.getOrderStatistics = getOrderStatistics;
window.formatOrderForDisplay = formatOrderForDisplay;



