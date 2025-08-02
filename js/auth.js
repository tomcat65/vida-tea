// Vida Tea - Authentication Module

class AuthManager {
    constructor() {
        this.auth = null;
        this.currentUser = null;
        this.isSignUp = false;
        
        this.waitForFirebase();
    }
    
    async waitForFirebase() {
        // Wait for Firebase to be initialized
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        
        while (!window.firebaseAuth && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        this.auth = window.firebaseAuth;
        console.log('Firebase Auth ready:', !!this.auth);
        
        if (!this.auth) {
            console.warn('Firebase Auth not available after 5 seconds');
            return;
        }
        
        this.init();
    }
    
    init() {
        // Check if auth is available
        if (!this.auth) {
            console.warn('Auth not available, skipping initialization');
            return;
        }
        
        // Auth state listener
        this.auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            this.updateUI();
        });
        
        // Modal elements
        this.authModal = document.getElementById('authModal');
        this.authTitle = document.getElementById('authTitle');
        this.authForm = document.getElementById('authForm');
        this.authSwitchBtn = document.getElementById('authSwitchBtn');
        this.authSwitchText = document.getElementById('authSwitchText');
        this.closeAuth = document.getElementById('closeAuth');
        this.authBtn = document.getElementById('authBtn');
        
        // Form elements
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.authSubmit = document.getElementById('authSubmit');
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Auth button click
        this.authBtn.addEventListener('click', () => {
            this.showAuthModal();
        });
        
        // Close modal
        this.closeAuth.addEventListener('click', () => {
            this.hideAuthModal();
        });
        
        // Modal backdrop click
        this.authModal.addEventListener('click', (e) => {
            if (e.target === this.authModal) {
                this.hideAuthModal();
            }
        });
        
        // Form submission
        this.authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuth();
        });
        
        // Switch between sign in/sign up
        this.authSwitchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthMode();
        });
    }
    
    showAuthModal() {
        this.authModal.classList.add('active');
        this.emailInput.focus();
    }
    
    hideAuthModal() {
        this.authModal.classList.remove('active');
        this.authForm.reset();
    }
    
    toggleAuthMode() {
        this.isSignUp = !this.isSignUp;
        
        if (this.isSignUp) {
            this.authTitle.textContent = 'Sign Up';
            this.authSubmit.textContent = 'Sign Up';
            this.authSwitchText.textContent = 'Already have an account? ';
            this.authSwitchBtn.textContent = 'Sign In';
        } else {
            this.authTitle.textContent = 'Sign In';
            this.authSubmit.textContent = 'Sign In';
            this.authSwitchText.textContent = 'Don\'t have an account? ';
            this.authSwitchBtn.textContent = 'Sign Up';
        }
    }
    
    async handleAuth() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value.trim();
        
        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        this.authSubmit.disabled = true;
        this.authSubmit.innerHTML = '<span class="loading"></span> Processing...';
        
        try {
            if (this.isSignUp) {
                await this.auth.createUserWithEmailAndPassword(email, password);
                this.showToast('Account created successfully!', 'success');
            } else {
                await this.auth.signInWithEmailAndPassword(email, password);
                this.showToast('Signed in successfully!', 'success');
            }
            
            this.hideAuthModal();
        } catch (error) {
            console.error('Auth error:', error);
            this.showToast(this.getErrorMessage(error.code), 'error');
        } finally {
            this.authSubmit.disabled = false;
            this.authSubmit.textContent = this.isSignUp ? 'Sign Up' : 'Sign In';
        }
    }
    
    async signOut() {
        try {
            await this.auth.signOut();
            this.showToast('Signed out successfully', 'info');
        } catch (error) {
            console.error('Sign out error:', error);
            this.showToast('Error signing out', 'error');
        }
    }
    
    updateUI() {
        if (this.currentUser) {
            this.authBtn.textContent = 'Sign Out';
            this.authBtn.onclick = () => this.signOut();
            this.authBtn.classList.add('signed-in');
        } else {
            this.authBtn.textContent = 'Sign In';
            this.authBtn.onclick = () => this.showAuthModal();
            this.authBtn.classList.remove('signed-in');
        }
    }
    
    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'No account found with this email',
            'auth/wrong-password': 'Incorrect password',
            'auth/email-already-in-use': 'An account with this email already exists',
            'auth/weak-password': 'Password is too weak',
            'auth/invalid-email': 'Invalid email address',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later',
            'auth/network-request-failed': 'Network error. Please check your connection'
        };
        
        return errorMessages[errorCode] || 'An error occurred. Please try again.';
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
    
    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }
    
    // Get user ID
    getUserId() {
        return this.currentUser ? this.currentUser.uid : null;
    }
    
    // Get user email
    getUserEmail() {
        return this.currentUser ? this.currentUser.email : null;
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

console.log('Auth module loaded'); 