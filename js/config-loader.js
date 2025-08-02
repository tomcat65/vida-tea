// Vida-Tea Wellness - Configuration Loader
// This script loads environment variables from .env file for vanilla JavaScript

class ConfigLoader {
    constructor() {
        this.config = {};
        this.ready = false;
        this.loadConfig();
    }

    // Load configuration from .env file or fallback to defaults
    async loadConfig() {
        try {
            // Try to load from .env file
            const envResponse = await fetch('/.env');
            if (envResponse.ok) {
                const envText = await envResponse.text();
                this.parseEnvFile(envText);
            } else {
                // Fallback to localStorage or defaults
                this.loadFromLocalStorage();
            }
        } catch (error) {
            console.log('Could not load .env file, using localStorage or defaults');
            this.loadFromLocalStorage();
        }
        this.ready = true;
        console.log('Config loader ready with config:', this.config);
    }

    // Parse .env file content
    parseEnvFile(envText) {
        const lines = envText.split('\n');
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, value] = trimmed.split('=');
                if (key && value) {
                    this.config[key.trim()] = value.trim();
                }
            }
        });
    }

    // Load from localStorage as fallback
    loadFromLocalStorage() {
        this.config = {
            FIREBASE_API_KEY: localStorage.getItem('FIREBASE_API_KEY') || 'AIzaSyBh4BNjpxfY_dgt3FojKFMD7KEIisf1iWg',
            FIREBASE_AUTH_DOMAIN: localStorage.getItem('FIREBASE_AUTH_DOMAIN') || 'vida-tea.firebaseapp.com',
            FIREBASE_PROJECT_ID: localStorage.getItem('FIREBASE_PROJECT_ID') || 'vida-tea',
            FIREBASE_STORAGE_BUCKET: localStorage.getItem('FIREBASE_STORAGE_BUCKET') || 'vida-tea.firebasestorage.app',
            FIREBASE_MESSAGING_SENDER_ID: localStorage.getItem('FIREBASE_MESSAGING_SENDER_ID') || '669969532716',
            FIREBASE_APP_ID: localStorage.getItem('FIREBASE_APP_ID') || '1:669969532716:web:02d938f0e13f73575f0e89',
            FIREBASE_MEASUREMENT_ID: localStorage.getItem('FIREBASE_MEASUREMENT_ID') || 'G-SS8PB0TT8D'
        };
    }

    // Get Firebase configuration object
    getFirebaseConfig() {
        return {
            apiKey: this.config.FIREBASE_API_KEY,
            authDomain: this.config.FIREBASE_AUTH_DOMAIN,
            projectId: this.config.FIREBASE_PROJECT_ID,
            storageBucket: this.config.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: this.config.FIREBASE_MESSAGING_SENDER_ID,
            appId: this.config.FIREBASE_APP_ID,
            measurementId: this.config.FIREBASE_MEASUREMENT_ID
        };
    }

    // Set configuration in localStorage (for development)
    setConfig(key, value) {
        localStorage.setItem(key, value);
        this.config[key] = value;
    }

    // Clear all configuration
    clearConfig() {
        localStorage.clear();
        this.loadFromLocalStorage();
    }

    // Get current configuration
    getConfig() {
        return this.config;
    }
}

// Create global config loader instance
window.configLoader = new ConfigLoader();

console.log('Configuration loader initialized - will load from .env file or localStorage'); 