// Vida Tea - API Service Module
// Connects frontend to backend API at localhost:3002/api/v1

class APIService {
    constructor() {
        this.baseURL = 'http://localhost:3002/api/v1';
        this.token = localStorage.getItem('vida_tea_token');
        this.currentUser = null;
        
        this.init();
    }
    
    init() {
        // Check for existing token on load
        this.checkAuthStatus();
    }
    
    // Authentication Methods
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Store token and user info
            this.token = data.token;
            this.currentUser = data.user;
            localStorage.setItem('vida_tea_token', this.token);
            localStorage.setItem('vida_tea_user', JSON.stringify(data.user));
            
            return { success: true, user: data.user };
            
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }
    
    async logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('vida_tea_token');
        localStorage.removeItem('vida_tea_user');
    }
    
    checkAuthStatus() {
        const token = localStorage.getItem('vida_tea_token');
        const user = localStorage.getItem('vida_tea_user');
        
        if (token && user) {
            this.token = token;
            this.currentUser = JSON.parse(user);
            return true;
        }
        
        return false;
    }
    
    isAuthenticated() {
        return !!this.token;
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    // API Request Helper
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        // Add auth token if available
        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid
                    this.logout();
                    throw new Error('Authentication required');
                }
                throw new Error(`API request failed: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }
    
    // Product Methods
    async getProducts(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (filters.category) {
                queryParams.append('category', filters.category);
            }
            
            if (filters.search) {
                queryParams.append('search', filters.search);
            }
            
            const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
            return await this.makeRequest(endpoint);
            
        } catch (error) {
            console.error('Error fetching products:', error);
            // Fallback to static data if API is unavailable
            return this.getFallbackProducts();
        }
    }
    
    async getProduct(id) {
        try {
            return await this.makeRequest(`/products/${id}`);
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }
    
    async createProduct(productData) {
        try {
            return await this.makeRequest('/products', {
                method: 'POST',
                body: JSON.stringify(productData)
            });
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }
    
    async updateProduct(id, productData) {
        try {
            return await this.makeRequest(`/products/${id}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }
    
    async deleteProduct(id) {
        try {
            return await this.makeRequest(`/products/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
    
    // Category Methods
    async getCategories() {
        try {
            return await this.makeRequest('/categories');
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback categories
            return [
                { id: 'teas', name: 'Teas', description: 'Premium tea varieties' },
                { id: 'herbs', name: 'Herbs', description: 'Medicinal herbs and spices' },
                { id: 'spices', name: 'Spices', description: 'Aromatic spices' },
                { id: 'accessories', name: 'Accessories', description: 'Tea accessories' }
            ];
        }
    }
    
    // Inventory Methods
    async getInventory() {
        try {
            return await this.makeRequest('/inventory');
        } catch (error) {
            console.error('Error fetching inventory:', error);
            return [];
        }
    }
    
    // Order Methods
    async createOrder(orderData) {
        try {
            return await this.makeRequest('/orders', {
                method: 'POST',
                body: JSON.stringify(orderData)
            });
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
    
    async getOrders() {
        try {
            return await this.makeRequest('/orders');
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    }
    
    // Fallback Data (for when API is unavailable)
    getFallbackProducts() {
        return [
            {
                id: '1',
                name: 'Organic Green Tea',
                description: 'Premium organic green tea with antioxidant properties',
                price: 22.00,
                category: 'teas',
                image: '🍃',
                benefits: ['Antioxidants', 'Energy', 'Focus'],
                inStock: true,
                stock: 50
            },
            {
                id: '2',
                name: 'Chamomile Calm',
                description: 'Soothing chamomile blend for stress relief and relaxation',
                price: 18.50,
                category: 'herbs',
                image: '🌼',
                benefits: ['Stress Relief', 'Sleep', 'Calm'],
                inStock: true,
                stock: 30
            },
            {
                id: '3',
                name: 'Peppermint Digestive',
                description: 'Refreshing peppermint tea for digestive health',
                price: 20.00,
                category: 'herbs',
                image: '🌿',
                benefits: ['Digestive Health', 'Fresh Breath', 'Energy'],
                inStock: true,
                stock: 45
            },
            {
                id: '4',
                name: 'Earl Grey Supreme',
                description: 'Classic Earl Grey with bergamot for a sophisticated taste',
                price: 24.00,
                category: 'teas',
                image: '☕',
                benefits: ['Focus', 'Energy', 'Antioxidants'],
                inStock: true,
                stock: 25
            },
            {
                id: '5',
                name: 'Lavender Dream',
                description: 'Lavender-infused herbal tea for peaceful sleep',
                price: 19.50,
                category: 'herbs',
                image: '💜',
                benefits: ['Sleep', 'Relaxation', 'Calm'],
                inStock: true,
                stock: 35
            }
        ];
    }
    
    // Utility Methods
    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
    
    // Health Check
    async checkAPIHealth() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return response.ok;
        } catch (error) {
            console.error('API health check failed:', error);
            return false;
        }
    }
}

// Initialize API service
window.apiService = new APIService();

// Add CSS animations for toasts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('Vida Tea API Service initialized'); 