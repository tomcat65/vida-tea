// Vida-Tea Wellness - Development Setup Script
// This script helps set up environment variables for local development

class DevSetup {
    constructor() {
        this.setupConfig();
    }

    // Set up configuration for development
    setupConfig() {
        // Check if we're in development mode
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.setupDevelopmentConfig();
        }
    }

    // Set up development configuration
    setupDevelopmentConfig() {
        console.log('Setting up development configuration...');
        
        // Set default Firebase configuration for development
        const devConfig = {
            FIREBASE_API_KEY: 'AIzaSyBh4BNjpxfY_dgt3FojKFMD7KEIisf1iWg',
            FIREBASE_AUTH_DOMAIN: 'vida-tea.firebaseapp.com',
            FIREBASE_PROJECT_ID: 'vida-tea',
            FIREBASE_STORAGE_BUCKET: 'vida-tea.firebasestorage.app',
            FIREBASE_MESSAGING_SENDER_ID: '669969532716',
            FIREBASE_APP_ID: '1:669969532716:web:02d938f0e13f73575f0e89',
            FIREBASE_MEASUREMENT_ID: 'G-SS8PB0TT8D'
        };

        // Set configuration in localStorage
        Object.keys(devConfig).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, devConfig[key]);
                console.log(`Set ${key} for development`);
            }
        });

        console.log('Development configuration ready!');
    }

    // Clear development configuration
    clearDevConfig() {
        const keys = [
            'FIREBASE_API_KEY',
            'FIREBASE_AUTH_DOMAIN',
            'FIREBASE_PROJECT_ID',
            'FIREBASE_STORAGE_BUCKET',
            'FIREBASE_MESSAGING_SENDER_ID',
            'FIREBASE_APP_ID',
            'FIREBASE_MEASUREMENT_ID'
        ];

        keys.forEach(key => {
            localStorage.removeItem(key);
        });

        console.log('Development configuration cleared!');
    }

    // Show current configuration
    showConfig() {
        const config = {
            FIREBASE_API_KEY: localStorage.getItem('FIREBASE_API_KEY'),
            FIREBASE_AUTH_DOMAIN: localStorage.getItem('FIREBASE_AUTH_DOMAIN'),
            FIREBASE_PROJECT_ID: localStorage.getItem('FIREBASE_PROJECT_ID'),
            FIREBASE_STORAGE_BUCKET: localStorage.getItem('FIREBASE_STORAGE_BUCKET'),
            FIREBASE_MESSAGING_SENDER_ID: localStorage.getItem('FIREBASE_MESSAGING_SENDER_ID'),
            FIREBASE_APP_ID: localStorage.getItem('FIREBASE_APP_ID'),
            FIREBASE_MEASUREMENT_ID: localStorage.getItem('FIREBASE_MEASUREMENT_ID')
        };

        console.log('Current Firebase Configuration:', config);
        return config;
    }
}

// Create global dev setup instance
window.devSetup = new DevSetup();

// Add to window for console access
window.setupDev = () => window.devSetup.setupDevelopmentConfig();
window.clearDev = () => window.devSetup.clearDevConfig();
window.showConfig = () => window.devSetup.showConfig();

console.log('Development setup initialized. Use setupDev(), clearDev(), or showConfig() in console.'); 