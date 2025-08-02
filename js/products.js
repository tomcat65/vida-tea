// Vida Tea - Products & Cart Module

class ProductManager {
    constructor() {
        this.db = null;
        this.products = [];
        this.cart = this.loadCart();
        this.currentFilter = 'all';
        
        this.waitForFirebase();
    }
    
    async waitForFirebase() {
        // Wait for Firebase to be initialized
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        
        while (!window.firebaseDB && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        this.db = window.firebaseDB;
        console.log('Firebase ready:', !!this.db);
        
        if (!this.db) {
            console.warn('Firebase not available after 5 seconds, proceeding with fallback');
        }
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadProducts();
        this.updateCartUI();
    }
    
    bindEvents() {
        // Cart button
        const cartBtn = document.getElementById('cartBtn');
        const cartModal = document.getElementById('cartModal');
        const closeCart = document.getElementById('closeCart');
        const clearCart = document.getElementById('clearCart');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.showCartModal();
            });
        }
        
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                this.hideCartModal();
            });
        }
        
        if (clearCart) {
            clearCart.addEventListener('click', () => {
                this.clearCart();
            });
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
        
        // Modal backdrop click
        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    this.hideCartModal();
                }
            });
        }
    }
    
    async loadProducts() {
        try {
            console.log('🔄 Loading products from Firebase...');
            console.log('Firebase DB available:', !!this.db);
            this.showLoadingState();
            
            // Check if Firebase is available
            if (!this.db) {
                console.warn('⚠️ Firebase not available, using fallback data');
                this.loadFallbackProducts();
                return;
            }
            
            // Additional check for Firebase services
            if (!firebase || !firebase.firestore) {
                console.warn('⚠️ Firebase SDK not available, using fallback data');
                this.loadFallbackProducts();
                return;
            }
            
            // Fetch products from Firestore
            console.log('🔍 Fetching products from Firestore...');
            const productsSnapshot = await this.db.collection('products').get();
            console.log('📊 Products snapshot:', productsSnapshot.size, 'documents');
            
            if (productsSnapshot.empty) {
                console.log('📭 No products found in Firebase, using fallback data');
                this.loadFallbackProducts();
                return;
            }
            
            // Convert Firestore data to product objects
            this.products = productsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: data.id || doc.id,
                    name: data.name || 'Unknown Product',
                    description: data.description || 'Premium organic tea',
                    price: data.price || this.calculatePrice(data), // Use actual price from Firebase, fallback to calculation
                    category: data.category || 'tea',
                    type: data.type || 'black',
                    origin: data.origin || 'Unknown',
                    image: this.getProductEmoji(data.category, data.type),
                    benefits: this.getProductBenefits(data.category, data.type),
                    organic: data.organic || true,
                    supplier: data.supplier || 'QTrade',
                    inStock: data.status === 'active',
                    code: data.code,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt
                };
            });
            
            console.log(`✅ Loaded ${this.products.length} products from Firebase`);
            this.hideLoadingState();
            this.renderProducts();
            
        } catch (error) {
            console.error('❌ Error loading products from Firebase:', error);
            console.log('🔄 Falling back to static data...');
            this.loadFallbackProducts();
        }
    }
    
    calculatePrice(product) {
        // Calculate price based on product type and origin
        let basePrice = 20.00;
        
        if (product.category === 'tea') {
            switch (product.type) {
                case 'green':
                    basePrice = 22.00;
                    break;
                case 'black':
                    basePrice = 24.00;
                    break;
                case 'white':
                    basePrice = 26.00;
                    break;
                case 'oolong':
                    basePrice = 25.00;
                    break;
                case 'herbal':
                    basePrice = 18.50;
                    break;
                case 'rooibos':
                    basePrice = 19.50;
                    break;
            }
        } else if (product.category === 'herb') {
            basePrice = 16.00;
        } else if (product.category === 'spice') {
            basePrice = 14.00;
        }
        
        // Premium origin adjustment
        if (product.origin === 'Sri Lanka' || product.origin === 'India') {
            basePrice += 2.00;
        }
        
        return basePrice;
    }
    
    getProductEmoji(category, type) {
        const emojis = {
            tea: {
                green: '🍃',
                black: '☕',
                white: '🌱',
                oolong: '🍵',
                herbal: '🌿',
                rooibos: '🌺'
            },
            herb: '🌿',
            spice: '🌶️',
            fruit: '🍊',
            blend: '🌸'
        };
        
        if (category === 'tea' && type) {
            return emojis.tea[type] || '🍵';
        }
        
        return emojis[category] || '🍵';
    }
    
    getProductBenefits(category, type) {
        const benefits = {
            tea: {
                green: ['Antioxidants', 'Energy', 'Focus'],
                black: ['Energy', 'Focus', 'Antioxidants'],
                white: ['Antioxidants', 'Calm', 'Immunity'],
                oolong: ['Weight Loss', 'Energy', 'Focus'],
                herbal: ['Wellness', 'Calm', 'Immunity'],
                rooibos: ['Calm', 'Sleep', 'Antioxidants']
            },
            herb: ['Wellness', 'Immunity', 'Calm'],
            spice: ['Digestive Health', 'Energy', 'Immunity'],
            fruit: ['Vitamin C', 'Immunity', 'Energy'],
            blend: ['Wellness', 'Balance', 'Harmony']
        };
        
        if (category === 'tea' && type) {
            return benefits.tea[type] || ['Wellness', 'Balance'];
        }
        
        return benefits[category] || ['Wellness', 'Balance'];
    }
    
    loadFallbackProducts() {
        // Fallback static data for when Firebase is not available
        this.products = [
            {
                id: '1',
                name: 'Organic Green Tea',
                description: 'Premium organic green tea with antioxidant properties',
                price: 22.00,
                category: 'green',
                image: '🍃',
                benefits: ['Antioxidants', 'Energy', 'Focus'],
                inStock: true
            },
            {
                id: '2',
                name: 'Chamomile Calm',
                description: 'Soothing chamomile blend for stress relief and relaxation',
                price: 18.50,
                category: 'herbal',
                image: '🌼',
                benefits: ['Stress Relief', 'Sleep', 'Calm'],
                inStock: true
            },
            {
                id: '3',
                name: 'Peppermint Digestive',
                description: 'Refreshing peppermint tea for digestive health',
                price: 20.00,
                category: 'herbal',
                image: '🌿',
                benefits: ['Digestive Health', 'Fresh Breath', 'Energy'],
                inStock: true
            },
            {
                id: '4',
                name: 'Earl Grey Supreme',
                description: 'Classic Earl Grey with bergamot for a sophisticated taste',
                price: 24.00,
                category: 'black',
                image: '☕',
                benefits: ['Focus', 'Energy', 'Antioxidants'],
                inStock: true
            },
            {
                id: '5',
                name: 'Lavender Dream',
                description: 'Lavender-infused herbal tea for peaceful sleep',
                price: 19.50,
                category: 'herbal',
                image: '💜',
                benefits: ['Sleep', 'Calm', 'Stress Relief'],
                inStock: true
            }
        ];
        
        console.log('✅ Loaded fallback products');
        this.renderProducts();
    }
    
    renderProducts() {
        console.log('🔄 renderProducts called');
        const teaGrid = document.getElementById('teaGrid');
        if (!teaGrid) {
            console.error('❌ teaGrid element not found');
            return;
        }
        console.log('✅ teaGrid element found');
        
        const filteredProducts = this.currentFilter === 'all' 
            ? this.products 
            : this.products.filter(p => p.category === this.currentFilter);
        
        console.log(`📊 Rendering ${filteredProducts.length} products (filter: ${this.currentFilter})`);
        
        teaGrid.innerHTML = filteredProducts.map(product => `
            <div class="tea-card" data-product-id="${product.id}">
                <div class="tea-image">
                    ${product.image}
                </div>
                <h3 class="tea-title">${product.name}</h3>
                <p class="tea-description">${product.description}</p>
                <div class="product-meta">
                    <span class="origin-tag">🌍 ${product.origin}</span>
                    ${product.organic ? '<span class="organic-tag">🌱 Organic</span>' : ''}
                    <span class="category-tag">${product.category} ${product.type}</span>
                </div>
                <div class="wellness-tags">
                    ${product.benefits.map(benefit => 
                        `<span class="wellness-tag">${benefit}</span>`
                    ).join('')}
                </div>
                <div class="price-display">
                    <span class="price-currency">$</span>
                    <span class="price-amount">${product.price.toFixed(2)}</span>
                    <span class="price-unit">/oz</span>
                </div>
                <div class="tea-actions">
                    <div class="tea-quantity">
                        <button class="quantity-btn" onclick="productManager.updateQuantity('${product.id}', -1)">-</button>
                        <input type="number" value="1" min="1" max="10" 
                               onchange="productManager.updateQuantityInput('${product.id}', this.value)">
                        <button class="quantity-btn" onclick="productManager.updateQuantity('${product.id}', 1)">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="productManager.addToCart('${product.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    updateQuantity(productId, change) {
        const input = document.querySelector(`[data-product-id="${productId}"] input`);
        if (input) {
            const newValue = Math.max(1, Math.min(10, parseInt(input.value) + change));
            input.value = newValue;
        }
    }
    
    updateQuantityInput(productId, value) {
        const newValue = Math.max(1, Math.min(10, parseInt(value) || 1));
        const input = document.querySelector(`[data-product-id="${productId}"] input`);
        if (input) {
            input.value = newValue;
        }
    }
    
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const quantityInput = document.querySelector(`[data-product-id="${productId}"] input`);
        const quantity = parseInt(quantityInput.value) || 1;
        
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showToast(`${product.name} added to cart`, 'success');
        
        // Reset quantity input
        quantityInput.value = 1;
    }
    
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.renderCartItems();
    }
    
    updateCartItemQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, item.quantity + change);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
                this.renderCartItems();
            }
        }
    }
    
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.renderCartItems();
        this.showToast('Cart cleared', 'info');
    }
    
    checkout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty', 'error');
            return;
        }
        
        if (!window.authManager.isAuthenticated()) {
            this.showToast('Please sign in to checkout', 'error');
            window.authManager.showAuthModal();
            return;
        }
        
        // In a real app, this would integrate with a payment processor
        this.showToast('Checkout functionality coming soon!', 'info');
    }
    
    renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems) return;
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🛒</div>
                    <div class="empty-state-text">Your cart is empty</div>
                </div>
            `;
            cartTotal.textContent = '0.00';
            return;
        }
        
        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${item.image}
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}/oz</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="productManager.updateCartItemQuantity('${item.id}', -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="productManager.updateCartItemQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }
    
    showCartModal() {
        const cartModal = document.getElementById('cartModal');
        cartModal.classList.add('active');
        this.renderCartItems();
    }
    
    hideCartModal() {
        const cartModal = document.getElementById('cartModal');
        cartModal.classList.remove('active');
    }
    
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart button appearance
        const cartBtn = document.getElementById('cartBtn');
        if (totalItems > 0) {
            cartBtn.classList.add('has-items');
        } else {
            cartBtn.classList.remove('has-items');
        }
    }
    
    loadCart() {
        try {
            const saved = localStorage.getItem('vida-tea-cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }
    
    saveCart() {
        try {
            localStorage.setItem('vida-tea-cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }
    
    showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.remove();
        });
    }
    
    // Filter products by category
    filterProducts(category) {
        this.currentFilter = category;
        this.renderProducts();
    }
    
    // Search products
    searchProducts(query) {
        const teaGrid = document.getElementById('teaGrid');
        if (!teaGrid) return;
        
        const filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.benefits.some(benefit => 
                benefit.toLowerCase().includes(query.toLowerCase())
            )
        );
        
        teaGrid.innerHTML = filteredProducts.map(product => `
            <div class="tea-card" data-product-id="${product.id}">
                <div class="tea-image">
                    ${product.image}
                </div>
                <h3 class="tea-title">${product.name}</h3>
                <p class="tea-description">${product.description}</p>
                <div class="product-meta">
                    <span class="origin-tag">🌍 ${product.origin}</span>
                    ${product.organic ? '<span class="organic-tag">🌱 Organic</span>' : ''}
                    <span class="category-tag">${product.category} ${product.type}</span>
                </div>
                <div class="wellness-tags">
                    ${product.benefits.map(benefit => 
                        `<span class="wellness-tag">${benefit}</span>`
                    ).join('')}
                </div>
                <div class="price-display">
                    <span class="price-currency">$</span>
                    <span class="price-amount">${product.price.toFixed(2)}</span>
                    <span class="price-unit">/oz</span>
                </div>
                <div class="tea-actions">
                    <div class="tea-quantity">
                        <button class="quantity-btn" onclick="productManager.updateQuantity('${product.id}', -1)">-</button>
                        <input type="number" value="1" min="1" max="10" 
                               onchange="productManager.updateQuantityInput('${product.id}', this.value)">
                        <button class="quantity-btn" onclick="productManager.updateQuantity('${product.id}', 1)">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="productManager.addToCart('${product.id}')">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Loading state management
    showLoadingState() {
        const teaGrid = document.getElementById('teaGrid');
        if (teaGrid) {
            teaGrid.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner">🔄</div>
                    <p>Loading premium organic teas...</p>
                </div>
            `;
        }
    }
    
    hideLoadingState() {
        // Loading state is cleared when products are rendered
    }
}

// Initialize product manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
});

console.log('Products module loaded'); 