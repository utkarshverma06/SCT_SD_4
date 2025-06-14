// Global variables
let extractedProducts = [];
let filteredProducts = [];

// DOM elements
const websiteUrlInput = document.getElementById('website-url');
const extractBtn = document.getElementById('extract-btn');
const demoBtn = document.getElementById('demo-btn');
const clearBtn = document.getElementById('clear-btn');
const loadingSection = document.getElementById('loading');
const resultsSection = document.getElementById('results-section');
const errorSection = document.getElementById('error-section');
const statsPanel = document.getElementById('stats-panel');
const productsTable = document.getElementById('products-table');
const productsTbody = document.getElementById('products-tbody');
const productCount = document.getElementById('product-count');
const searchFilter = document.getElementById('search-filter');
const sortFilter = document.getElementById('sort-filter');
const exportCsvBtn = document.getElementById('export-csv');
const exportJsonBtn = document.getElementById('export-json');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    extractBtn.addEventListener('click', handleExtractData);
    demoBtn.addEventListener('click', loadDemoData);
    clearBtn.addEventListener('click', clearAllData);
    exportCsvBtn.addEventListener('click', exportToCSV);
    exportJsonBtn.addEventListener('click', exportToJSON);
    searchFilter.addEventListener('input', filterProducts);
    sortFilter.addEventListener('change', sortProducts);
    
    // Enter key support for URL input
    websiteUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleExtractData();
        }
    });
}

// Handle data extraction
async function handleExtractData() {
    const url = websiteUrlInput.value.trim();
    
    if (!url) {
        showError('Please enter a valid website URL.');
        return;
    }
    
    if (!isValidUrl(url)) {
        showError('Please enter a valid URL format (e.g., https://example.com).');
        return;
    }
    
    showLoading();
    hideError();
    
    try {
        // Simulate API call or web scraping
        const products = await simulateWebScraping(url);
        extractedProducts = products;
        filteredProducts = [...products];
        
        displayResults();
        updateStatistics();
        showSuccess(`Successfully extracted ${products.length} products from ${url}`);
        
    } catch (error) {
        showError(`Failed to extract data: ${error.message}`);
        console.error('Extraction error:', error);
    } finally {
        hideLoading();
    }
}

// Simulate web scraping (in real implementation, this would be actual scraping)
async function simulateWebScraping(url) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate sample product data based on URL
    const sampleProducts = generateSampleProducts(url);
    
    return sampleProducts;
}

// Generate sample product data
function generateSampleProducts(url) {
    const productNames = [
        'Wireless Bluetooth Headphones',
        'Smart Watch Series 7',
        'Laptop Computer 15.6"',
        'Smartphone 128GB',
        'Gaming Mechanical Keyboard',
        'Wireless Mouse RGB',
        'Portable Bluetooth Speaker',
        '4K Webcam for Streaming',
        'USB-C Hub 10-in-1',
        'Wireless Charging Pad',
        'Noise Cancelling Earbuds',
        'Tablet 10.1" Android',
        'Gaming Headset Pro',
        'Wireless Keyboard & Mouse Combo',
        'Power Bank 20000mAh'
    ];
    
    const categories = ['Electronics', 'Computers', 'Audio', 'Mobile', 'Gaming', 'Accessories'];
    const availabilityOptions = ['In Stock', 'Out of Stock', 'Limited Stock'];
    
    const products = [];
    const productCount = Math.floor(Math.random() * 10) + 8; // 8-17 products
    
    for (let i = 0; i < productCount; i++) {
        const product = {
            id: i + 1,
            name: productNames[Math.floor(Math.random() * productNames.length)],
            price: (Math.random() * 500 + 20).toFixed(2),
            rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
            reviews: Math.floor(Math.random() * 2000) + 10,
            availability: availabilityOptions[Math.floor(Math.random() * availabilityOptions.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            image: `https://picsum.photos/200/200?random=${i + 1}`,
            url: `${url}/product/${i + 1}`,
            extractedAt: new Date().toISOString()
        };
        products.push(product);
    }
    
    return products;
}

// Load demo data
function loadDemoData() {
    const demoProducts = [
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            price: '199.99',
            rating: '4.5',
            reviews: 1250,
            availability: 'In Stock',
            category: 'Audio',
            image: 'https://picsum.photos/200/200?random=1',
            url: 'https://demo-store.com/product/1'
        },
        {
            id: 2,
            name: 'Smart Fitness Watch',
            price: '299.99',
            rating: '4.3',
            reviews: 890,
            availability: 'Limited Stock',
            category: 'Electronics',
            image: 'https://picsum.photos/200/200?random=2',
            url: 'https://demo-store.com/product/2'
        },
        {
            id: 3,
            name: 'Gaming Laptop Pro',
            price: '1299.99',
            rating: '4.7',
            reviews: 445,
            availability: 'In Stock',
            category: 'Computers',
            image: 'https://picsum.photos/200/200?random=3',
            url: 'https://demo-store.com/product/3'
        },
        {
            id: 4,
            name: 'Wireless Charging Station',
            price: '79.99',
            rating: '4.2',
            reviews: 567,
            availability: 'Out of Stock',
            category: 'Accessories',
            image: 'https://picsum.photos/200/200?random=4',
            url: 'https://demo-store.com/product/4'
        },
        {
            id: 5,
            name: 'Bluetooth Speaker Portable',
            price: '89.99',
            rating: '4.6',
            reviews: 723,
            availability: 'In Stock',
            category: 'Audio',
            image: 'https://picsum.photos/200/200?random=5',
            url: 'https://demo-store.com/product/5'
        }
    ];
    
    extractedProducts = demoProducts;
    filteredProducts = [...demoProducts];
    websiteUrlInput.value = 'https://demo-store.com';
    
    displayResults();
    updateStatistics();
    showSuccess('Demo data loaded successfully!');
}

// Display results in table
function displayResults() {
    if (filteredProducts.length === 0) {
        productsTbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No products found</td></tr>';
        resultsSection.classList.remove('hidden');
        return;
    }
    
    productsTbody.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const row = createProductRow(product);
        productsTbody.appendChild(row);
    });
    
    productCount.textContent = `${filteredProducts.length} products found`;
    resultsSection.classList.remove('hidden');
}

// Create product table row
function createProductRow(product) {
    const row = document.createElement('tr');
    
    const availabilityClass = product.availability.toLowerCase().replace(' ', '-');
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    row.innerHTML = `
        <td><img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'"></td>
        <td><div class="product-name" title="${product.name}">${product.name}</div></td>
        <td><span class="price">$${product.price}</span></td>
        <td>
            <div class="rating">
                <span class="stars" title="${product.rating}/5">${stars}</span>
                <span>${product.rating}</span>
            </div>
        </td>
        <td>${product.reviews.toLocaleString()}</td>
        <td><span class="availability ${availabilityClass}">${product.availability}</span></td>
        <td>${product.category}</td>
    `;
    
    return row;
}

// Filter products based on search
function filterProducts() {
    const searchTerm = searchFilter.value.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredProducts = [...extractedProducts];
    } else {
        filteredProducts = extractedProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.availability.toLowerCase().includes(searchTerm)
        );
    }
    
    displayResults();
    updateStatistics();
}

// Sort products
function sortProducts() {
    const sortValue = sortFilter.value;
    
    if (!sortValue) return;
    
    filteredProducts.sort((a, b) => {
        switch (sortValue) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'price-asc':
                return parseFloat(a.price) - parseFloat(b.price);
            case 'price-desc':
                return parseFloat(b.price) - parseFloat(a.price);
            case 'rating-desc':
                return parseFloat(b.rating) - parseFloat(a.rating);
            default:
                return 0;
        }
    });
    
    displayResults();
}

// Update statistics
function updateStatistics() {
    if (extractedProducts.length === 0) {
        statsPanel.classList.add('hidden');
        return;
    }
    
    const totalProducts = extractedProducts.length;
    const avgPrice = extractedProducts.reduce((sum, product) => sum + parseFloat(product.price), 0) / totalProducts;
    const avgRating = extractedProducts.reduce((sum, product) => sum + parseFloat(product.rating), 0) / totalProducts;
    const uniqueCategories = new Set(extractedProducts.map(product => product.category)).size;
    
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('avg-price').textContent = `$${avgPrice.toFixed(2)}`;
    document.getElementById('avg-rating').textContent = avgRating.toFixed(1);
    document.getElementById('categories-count').textContent = uniqueCategories;
    
    statsPanel.classList.remove('hidden');
}

// Export to CSV
function exportToCSV() {
    if (extractedProducts.length === 0) {
        showError('No data to export');
        return;
    }
    
    const headers = ['ID', 'Product Name', 'Price', 'Rating', 'Reviews', 'Availability', 'Category', 'Image URL', 'Product URL', 'Extracted At'];
    const csvContent = [
        headers.join(','),
        ...extractedProducts.map(product => [
            product.id,
            `"${product.name}"`,
            product.price,
            product.rating,
            product.reviews,
            `"${product.availability}"`,
            `"${product.category}"`,
            `"${product.image}"`,
            `"${product.url || ''}"`,
            `"${product.extractedAt || new Date().toISOString()}"`
        ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, 'products.csv', 'text/csv');
    showSuccess('CSV file downloaded successfully!');
}

// Export to JSON
function exportToJSON() {
    if (extractedProducts.length === 0) {
        showError('No data to export');
        return;
    }
    
    const jsonContent = JSON.stringify({
        extractedAt: new Date().toISOString(),
        totalProducts: extractedProducts.length,
        products: extractedProducts
    }, null, 2);
    
    downloadFile(jsonContent, 'products.json', 'application/json');
    showSuccess('JSON file downloaded successfully!');
}

// Download file utility
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Clear all data
function clearAllData() {
    extractedProducts = [];
    filteredProducts = [];
    websiteUrlInput.value = '';
    searchFilter.value = '';
    sortFilter.value = '';
    
    hideResults();
    hideError();
    hideStats();
    
    showSuccess('All data cleared successfully!');
}

// Utility functions
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function showLoading() {
    loadingSection.classList.remove('hidden');
    hideResults();
    hideError();
}

function hideLoading() {
    loadingSection.classList.add('hidden');
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
    errorSection.classList.remove('hidden');
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    errorSection.classList.add('hidden');
}

function hideResults() {
    resultsSection.classList.add('hidden');
}

function hideStats() {
    statsPanel.classList.add('hidden');
}

function showSuccess(message) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Advanced scraping simulation (for educational purposes)
function simulateAdvancedScraping(url) {
    // This would typically use techniques like:
    // - Puppeteer for JavaScript-heavy sites
    // - BeautifulSoup for Python-based scraping
    // - Selenium for dynamic content
    // - API endpoints when available
    
    console.log(`Simulating advanced scraping for: ${url}`);
    
    // Common selectors used in real scraping
    const commonSelectors = {
        productName: ['.product-title', '.item-name', 'h1', '.product-name'],
        price: ['.price', '.cost', '.amount', '.product-price'],
        rating: ['.rating', '.stars', '.review-score'],
        availability: ['.stock', '.availability', '.in-stock'],
        image: ['.product-image img', '.item-photo img', '.main-image img']
    };
    
    return commonSelectors;
}

// Handle different e-commerce platforms
function detectEcommercePlatform(url) {
    const platforms = {
        'amazon.com': 'Amazon',
        'ebay.com': 'eBay',
        'etsy.com': 'Etsy',
        'shopify.com': 'Shopify',
        'woocommerce.com': 'WooCommerce',
        'magento.com': 'Magento'
    };
    
    for (const [domain, platform] of Object.entries(platforms)) {
        if (url.includes(domain)) {
            return platform;
        }
    }
    
    return 'Generic';
}

// Rate limiting for responsible scraping
class RateLimiter {
    constructor(requestsPerSecond = 1) {
        this.delay = 1000 / requestsPerSecond;
        this.lastRequestTime = 0;
    }
    
    async waitIfNeeded() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.delay) {
            await new Promise(resolve => 
                setTimeout(resolve, this.delay - timeSinceLastRequest)
            );
        }
        
        this.lastRequestTime = Date.now();
    }
}

// Initialize rate limiter
const rateLimiter = new RateLimiter(2); // 2 requests per second

// Data validation and cleaning
function validateAndCleanProductData(product) {
    const cleaned = {
        id: product.id || Math.random().toString(36).substr(2, 9),
        name: (product.name || 'Unknown Product').trim(),
        price: parseFloat(product.price) || 0,
        rating: Math.min(Math.max(parseFloat(product.rating) || 0, 0), 5),
        reviews: parseInt(product.reviews) || 0,
        availability: product.availability || 'Unknown',
        category: (product.category || 'Uncategorized').trim(),
        image: product.image || 'https://via.placeholder.com/200x200?text=No+Image',
        url: product.url || '',
        extractedAt: new Date().toISOString()
    };
    
    // Additional validation
    if (cleaned.price < 0) cleaned.price = 0;
    if (cleaned.rating < 0) cleaned.rating = 0;
    if (cleaned.rating > 5) cleaned.rating = 5;
    if (cleaned.reviews < 0) cleaned.reviews = 0;
    
    return cleaned;
}

// Batch processing for large datasets
function processBatch(items, batchSize = 10) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
    }
    return batches;
}

// Error handling and retry logic
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            
            console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
        }
    }
}

// Local storage for caching (Note: This is just for demonstration)
function cacheData(key, data, expirationMinutes = 30) {
    const item = {
        data: data,
        timestamp: Date.now(),
        expiration: expirationMinutes * 60 * 1000
    };
    
    // In a real application, you might use localStorage or IndexedDB
    // For this demo, we'll use a simple in-memory cache
    window.dataCache = window.dataCache || {};
    window.dataCache[key] = item;
}

function getCachedData(key) {
    if (!window.dataCache || !window.dataCache[key]) {
        return null;
    }
    
    const item = window.dataCache[key];
    const now = Date.now();
    
    if (now - item.timestamp > item.expiration) {
        delete window.dataCache[key];
        return null;
    }
    
    return item.data;
}

// Performance monitoring
function measurePerformance(name, fn) {
    return async function(...args) {
        const start = performance.now();
        try {
            const result = await fn.apply(this, args);
            const end = performance.now();
            console.log(`${name} took ${(end - start).toFixed(2)}ms`);
            return result;
        } catch (error) {
            const end = performance.now();
            console.error(`${name} failed after ${(end - start).toFixed(2)}ms:`, error);
            throw error;
        }
    };
}

// Initialize performance monitoring for key functions
const monitoredExtractData = measurePerformance('Data Extraction', handleExtractData);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'e':
                e.preventDefault();
                websiteUrlInput.focus();
                break;
            case 's':
                e.preventDefault();
                if (extractedProducts.length > 0) {
                    exportToCSV();
                }
                break;
            case 'd':
                e.preventDefault();
                loadDemoData();
                break;
        }
    }
});

// Add keyboard shortcut hints
function addKeyboardHints() {
    const hints = document.createElement('div');
    hints.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 8px; font-size: 12px; z-index: 1000;">
            <div><strong>Keyboard Shortcuts:</strong></div>
            <div>Ctrl+E - Focus URL input</div>
            <div>Ctrl+S - Export CSV</div>
            <div>Ctrl+D - Load demo data</div>
        </div>
    `;
    document.body.appendChild(hints);
    
    // Hide hints after 5 seconds
    setTimeout(() => {
        hints.style.opacity = '0';
        hints.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            if (document.body.contains(hints)) {
                document.body.removeChild(hints);
            }
        }, 500);
    }, 5000);
}

// Show keyboard hints on load
setTimeout(addKeyboardHints, 2000);

console.log('E-commerce Product Data Extractor initialized successfully!');