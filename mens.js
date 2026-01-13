// Men's Page Filtering and Functionality

document.addEventListener('DOMContentLoaded', () => {
    setupFilters();
    updateCartCount();
});

// Setup filter functionality
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const sortFilter = document.getElementById('sortFilter');

    [categoryFilter, priceFilter, sortFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}

// Apply all filters
function applyFilters() {
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const price = document.getElementById('priceFilter')?.value || 'all';
    const sort = document.getElementById('sortFilter')?.value || 'default';

    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.dataset.category;
        const productPrice = parseFloat(product.dataset.price);
        
        let show = true;

        // Category filter
        if (category !== 'all' && productCategory !== category) {
            show = false;
        }

        // Price filter
        if (price !== 'all') {
            if (price === 'low' && productPrice >= 50) {
                show = false;
            } else if (price === 'medium' && (productPrice < 50 || productPrice > 100)) {
                show = false;
            } else if (price === 'high' && productPrice <= 100) {
                show = false;
            }
        }

        // Show/hide product
        if (show) {
            product.classList.remove('hidden');
        } else {
            product.classList.add('hidden');
        }
    });

    // Sort products
    if (sort !== 'default') {
        sortProducts(sort);
    }
}

// Sort products
function sortProducts(sortType) {
    const productsGrid = document.getElementById('productsGrid');
    const products = Array.from(productsGrid.querySelectorAll('.product-card:not(.hidden)'));

    products.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);

        if (sortType === 'price-low') {
            return priceA - priceB;
        } else if (sortType === 'price-high') {
            return priceB - priceA;
        } else if (sortType === 'rating') {
            // Sort by rating (you can add rating data attributes if needed)
            return 0;
        }
        return 0;
    });

    // Re-append sorted products
    products.forEach(product => {
        productsGrid.appendChild(product);
    });
}

