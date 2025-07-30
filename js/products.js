// Vida Tea - Products & Cart Module

class ProductManager {
    constructor() {
        this.db = window.firebaseDB;
        this.products = [];
        this.cart = this.loadCart();
        this.currentFilter = 'all';
        
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
        
        cartBtn.addEventListener('click', () => {
            this.showCartModal();
        });
        
        closeCart.addEventListener('click', () => {
            this.hideCartModal();
        });
        
        clearCart.addEventListener('click', () => {
            this.clearCart();
        });
        
        checkoutBtn.addEventListener('click', () => {
            this.checkout();
        });
        
        // Modal backdrop click
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                this.hideCartModal();
            }
        });
    }
    
    async loadProducts() {
        try {
            // For demo purposes, using static data instead of Firebase
            // In production, this would fetch from Firestore
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
                    benefits: ['Sleep', 'Relaxation', 'Calm'],
                    inStock: true
                },
                {
                    id: '6',
                    name: 'Ginger Immunity',
                    description: 'Spicy ginger blend to boost immunity and energy',
                    price: 21.00,
                    category: 'herbal',
                    image: '🫚',
                    benefits: ['Immunity', 'Energy', 'Digestive Health'],
                    inStock: true
                }
            ];
            
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showToast('Error loading products', 'error');
        }
    }
    
    renderProducts() {
        const teaGrid = document.getElementById('teaGrid');
        if (!teaGrid) return;
        
        const filteredProducts = this.currentFilter === 'all' 
            ? this.products 
            : this.products.filter(p => p.category === this.currentFilter);
        
        teaGrid.innerHTML = filteredProducts.map(product => `
            <div class="tea-card" data-product-id="${product.id}">
                <div class="tea-image">
                    ${product.image}
                </div>
                <h3 class="tea-title">${product.name}</h3>
                <p class="tea-description">${product.description}</p>
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
}

// Initialize product manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productManager = new ProductManager();
});

console.log('Products module loaded'); 