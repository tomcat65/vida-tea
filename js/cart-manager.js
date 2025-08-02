// Vida-Tea Cart Manager - Firebase + API Integration
// Enhanced with backend API integration while maintaining localStorage fallback

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.db = null;
        this.apiBase = 'http://localhost:8081/api';
        this.sessionId = this.generateSessionId();
        this.discoveryPreferences = this.loadDiscoveryPreferences();
        this.waitForFirebase();
    }
    
    generateSessionId() {
        // Generate a unique session ID for API calls
        return 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
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
        console.log('Cart Manager - Firebase ready:', !!this.db);
        
        if (this.db) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.updateCartUI();
        this.syncWithAPI();
        console.log('Cart Manager initialized with API integration');
    }
    
    bindEvents() {
        // Cart button click
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.showCartModal();
            });
        }
        
        // Modal close events
        const closeCart = document.getElementById('closeCart');
        const clearCart = document.getElementById('clearCart');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
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
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    this.hideCartModal();
                }
            });
        }
    }
    
    // Sync cart with API
    async syncWithAPI() {
        try {
            const response = await fetch(`${this.apiBase}/cart`, {
                headers: {
                    'X-Session-ID': this.sessionId
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data.items.length > 0) {
                    // Update local cart with API data
                    this.cart = data.data.items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: '🍵',
                        origin: 'Unknown',
                        category: 'tea'
                    }));
                    this.saveCart();
                    this.updateCartUI();
                    console.log('✅ Cart synced with API');
                }
            }
        } catch (error) {
            console.log('API sync failed, using local cart:', error.message);
        }
    }
    
    // Add item to cart
    async addToCart(productId, quantity = 1) {
        try {
            console.log(`🛒 Adding product ${productId} to cart (quantity: ${quantity})`);
            
            // Try API first
            const apiSuccess = await this.addToCartAPI(productId, quantity);
            
            if (apiSuccess) {
                // Sync with API
                await this.syncWithAPI();
            } else {
                // Fallback to local cart
                this.addToLocalCart(productId, quantity);
            }
            
        } catch (error) {
            console.error('❌ Error adding to cart:', error);
            this.addToLocalCart(productId, quantity);
        }
    }
    
    // Add to cart via API
    async addToCartAPI(productId, quantity) {
        try {
            const response = await fetch(`${this.apiBase}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': this.sessionId
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: quantity
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Item added to cart via API');
                return true;
            } else {
                console.log('API add failed, using local cart');
                return false;
            }
        } catch (error) {
            console.log('API unavailable, using local cart');
            return false;
        }
    }
    
    // Add to local cart (fallback)
    addToLocalCart(productId, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Get product details from Firebase if available
            if (this.db) {
                this.db.collection('products').doc(productId).get().then(doc => {
                    if (doc.exists) {
                        const product = doc.data();
                        const cartItem = {
                            id: productId,
                            name: product.name,
                            price: product.price || 25.00,
                            quantity: quantity,
                            image: product.image || '🍵',
                            origin: product.origin || 'Unknown',
                            category: product.category || 'tea'
                        };
                        this.cart.push(cartItem);
                    } else {
                        // Create basic cart item
                        const cartItem = {
                            id: productId,
                            name: 'Premium Tea',
                            price: 25.00,
                            quantity: quantity,
                            image: '🍵',
                            origin: 'Unknown',
                            category: 'tea'
                        };
                        this.cart.push(cartItem);
                    }
                    this.saveCart();
                    this.updateCartUI();
                });
            } else {
                // Create basic cart item
                const cartItem = {
                    id: productId,
                    name: 'Premium Tea',
                    price: 25.00,
                    quantity: quantity,
                    image: '🍵',
                    origin: 'Unknown',
                    category: 'tea'
                };
                this.cart.push(cartItem);
                this.saveCart();
                this.updateCartUI();
            }
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showToast('Item added to cart', 'success');
    }
    
    // Update cart item quantity
    async updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        
        if (item) {
            const newQuantity = item.quantity + change;
            
            if (newQuantity <= 0) {
                await this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                
                // Try API update
                try {
                    await fetch(`${this.apiBase}/cart/${item.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Session-ID': this.sessionId
                        },
                        body: JSON.stringify({ quantity: newQuantity })
                    });
                } catch (error) {
                    console.log('API update failed, using local cart');
                }
                
                this.saveCart();
                this.updateCartUI();
            }
        }
    }
    
    // Remove item from cart
    async removeFromCart(productId) {
        const index = this.cart.findIndex(item => item.id === productId);
        
        if (index !== -1) {
            const removedItem = this.cart.splice(index, 1)[0];
            
            // Try API delete
            try {
                await fetch(`${this.apiBase}/cart/${removedItem.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-Session-ID': this.sessionId
                    }
                });
            } catch (error) {
                console.log('API delete failed, using local cart');
            }
            
            this.saveCart();
            this.updateCartUI();
            this.showToast(`${removedItem.name} removed from cart`, 'info');
        }
    }
    
    // Clear entire cart
    async clearCart() {
        this.cart = [];
        
        // Try API clear
        try {
            await fetch(`${this.apiBase}/cart`, {
                method: 'DELETE',
                headers: {
                    'X-Session-ID': this.sessionId
                }
            });
        } catch (error) {
            console.log('API clear failed, using local cart');
        }
        
        this.saveCart();
        this.updateCartUI();
        this.hideCartModal();
        this.showToast('Cart cleared', 'info');
    }
    
    // Calculate cart totals
    calculateTotals() {
        let subtotal = 0;
        let itemCount = 0;
        
        for (const item of this.cart) {
            subtotal += item.price * item.quantity;
            itemCount += item.quantity;
        }
        
        return {
            subtotal: subtotal,
            total: subtotal, // No tax/shipping for now
            itemCount: itemCount
        };
    }
    
    // Render cart items in modal
    async renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems || !cartTotal) return;
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <p>Add some premium teas to get started!</p>
                </div>
            `;
            cartTotal.textContent = '0.00';
            return;
        }
        
        const totals = this.calculateTotals();
        
        const html = this.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    ${item.image}
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-meta">
                        <span class="origin">🌍 ${item.origin}</span>
                        <span class="category">${item.category}</span>
                    </p>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.id}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-btn" onclick="cartManager.removeFromCart('${item.id}')">×</button>
            </div>
        `).join('');
        
        // Add discovery-based recommendations if available
        const recommendations = await this.getDiscoveryRecommendations();
        let recommendationsHtml = '';
        
        if (recommendations.length > 0) {
            recommendationsHtml = `
                <div class="discovery-recommendations" style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 2px solid var(--primary-green);">
                    <h4 style="color: var(--primary-green); margin-bottom: var(--spacing-md);">🎯 Based on your discovery preferences:</h4>
                    <div class="recommendations-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md);">
                        ${recommendations.map(rec => `
                            <div class="recommendation-card" style="background: var(--warm-beige); padding: var(--spacing-sm); border-radius: var(--radius-md); border: 1px solid var(--primary-green);">
                                <h5 style="color: var(--primary-green); margin-bottom: var(--spacing-xs); font-size: 0.9rem;">${rec.name}</h5>
                                <p style="font-size: 0.8rem; color: var(--accent-green); margin-bottom: var(--spacing-xs);">$${rec.price.toFixed(2)}</p>
                                <button class="btn-secondary" style="font-size: 0.8rem; padding: var(--spacing-xs) var(--spacing-sm);" onclick="cartManager.addToCart('${rec.id}', 1)">Add to Cart</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        cartItems.innerHTML = html + recommendationsHtml;
        cartTotal.textContent = totals.total.toFixed(2);
    }
    
    // Show cart modal
    showCartModal() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            this.renderCartItems();
            cartModal.classList.add('active');
        }
    }
    
    // Hide cart modal
    hideCartModal() {
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.remove('active');
        }
    }
    
    // Update cart UI (cart count, etc.)
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const totals = this.calculateTotals();
        
        if (cartCount) {
            cartCount.textContent = totals.itemCount;
        }
    }
    
    // Checkout process
    checkout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty', 'error');
            return;
        }
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    }
    
    // Load cart from localStorage
    loadCart() {
        try {
            const saved = localStorage.getItem('vida-tea-cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }
    
    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('vida-tea-cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }
    
    // Discovery preferences management
    loadDiscoveryPreferences() {
        const saved = localStorage.getItem('vidaTeaDiscoveryPreferences');
        return saved ? JSON.parse(saved) : {};
    }
    
    saveDiscoveryPreferences(preferences) {
        this.discoveryPreferences = preferences;
        localStorage.setItem('vidaTeaDiscoveryPreferences', JSON.stringify(preferences));
    }
    
    // Get discovery-based recommendations
    async getDiscoveryRecommendations() {
        if (!this.discoveryPreferences || Object.keys(this.discoveryPreferences).length === 0) {
            return [];
        }
        
        try {
            // Get all products from Firebase
            const snapshot = await this.db.collection('products').get();
            const allProducts = [];
            snapshot.forEach(doc => {
                allProducts.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            // Filter products based on discovery preferences
            return this.filterProductsByDiscovery(allProducts);
        } catch (error) {
            console.error('Error getting discovery recommendations:', error);
            return [];
        }
    }
    
    // Filter products based on discovery preferences
    filterProductsByDiscovery(products) {
        const recommendations = [];
        const preferences = this.discoveryPreferences;
        
        products.forEach(product => {
            let score = 0;
            
            // Wellness path filtering
            if (preferences.wellness) {
                const wellnessBenefits = product.benefits || [];
                const wellnessKeywords = {
                    'balanced': ['balance', 'calm', 'focus'],
                    'relaxed': ['relax', 'calm', 'sleep', 'peace'],
                    'energized': ['energy', 'focus', 'vitality'],
                    'immune': ['immunity', 'health', 'wellness'],
                    'sleep': ['sleep', 'relax', 'calm']
                };
                
                const keywords = wellnessKeywords[preferences.wellness] || [];
                keywords.forEach(keyword => {
                    if (wellnessBenefits.some(benefit => 
                        benefit.toLowerCase().includes(keyword.toLowerCase()))) {
                        score += 2;
                    }
                });
            }
            
            // Cultural path filtering
            if (preferences.culture) {
                const culturalOrigin = product.origin || '';
                const culturalKeywords = {
                    'indian': ['india', 'chai', 'masala'],
                    'chinese': ['china', 'green', 'oolong'],
                    'english': ['england', 'black', 'earl grey'],
                    'japanese': ['japan', 'matcha', 'sencha'],
                    'middle eastern': ['morocco', 'mint', 'arabic'],
                    'latin american': ['south america', 'mate', 'herbal'],
                    'european': ['europe', 'herbal', 'chamomile'],
                    'world class': ['premium', 'organic', 'artisan']
                };
                
                const keywords = culturalKeywords[preferences.culture] || [];
                keywords.forEach(keyword => {
                    if (culturalOrigin.toLowerCase().includes(keyword.toLowerCase())) {
                        score += 2;
                    }
                });
            }
            
            // Preference-based filtering
            if (preferences.temperature) {
                const tempPreferences = {
                    'hot': ['black', 'herbal', 'chai'],
                    'cold': ['green', 'white', 'oolong'],
                    'both': ['all']
                };
                
                const teaTypes = tempPreferences[preferences.temperature] || [];
                const productType = product.type || '';
                
                if (teaTypes.some(type => productType.toLowerCase().includes(type))) {
                    score += 1;
                }
            }
            
            if (preferences.caffeine) {
                const caffeineLevels = {
                    'caffeinated': ['black', 'green', 'oolong'],
                    'decaf': ['herbal', 'rooibos', 'chamomile'],
                    'low': ['white', 'green']
                };
                
                const teaTypes = caffeineLevels[preferences.caffeine] || [];
                const productType = product.type || '';
                
                if (teaTypes.some(type => productType.toLowerCase().includes(type))) {
                    score += 1;
                }
            }
            
            // Add to recommendations if score is high enough
            if (score >= 2) {
                recommendations.push({
                    ...product,
                    discoveryScore: score
                });
            }
        });
        
        // Sort by discovery score and return top recommendations
        return recommendations
            .sort((a, b) => b.discoveryScore - a.discoveryScore)
            .slice(0, 6); // Return top 6 recommendations
    }
    
    // Show toast notification
    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Add to page
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.remove();
        });
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});

console.log('Cart Manager module loaded with API integration'); 