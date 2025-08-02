// Vida-Tea Wellness - Firebase Configuration

// Wait for config loader to be ready, then initialize Firebase
async function initializeFirebase() {
    // Wait for config loader to be ready
    if (window.configLoader) {
        // Wait for config loader to be ready
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        
        while (!window.configLoader.ready && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.configLoader.ready) {
            console.error('Config loader not ready after 5 seconds');
            return;
        }
        
        const firebaseConfig = window.configLoader.getFirebaseConfig();
        
        // Initialize Firebase
        console.log('Initializing Firebase with config:', firebaseConfig);
        
        try {
            firebase.initializeApp(firebaseConfig);
            console.log('Firebase app initialized successfully');
        } catch (error) {
            console.error('Firebase initialization error:', error);
            return;
        }

        // Initialize Firebase services
        const auth = firebase.auth();
        const db = firebase.firestore();
        // Note: Storage is not needed for this app, so we'll skip it
        // const storage = firebase.storage();

        // Enable offline persistence
        db.enablePersistence()
            .catch((err) => {
                if (err.code == 'failed-precondition') {
                    // Multiple tabs open, persistence can only be enabled in one tab at a time
                    console.log('Persistence failed - multiple tabs open');
                } else if (err.code == 'unimplemented') {
                    // Browser doesn't support persistence
                    console.log('Persistence not supported');
                }
            });

        // Export for use in other modules
        window.firebaseAuth = auth;
        window.firebaseDB = db;
        // window.firebaseStorage = storage; // Not needed for this app

        console.log('Firebase initialized successfully for Vida-Tea Wellness');
        console.log('Firebase DB available:', !!window.firebaseDB);
    } else {
        console.error('Config loader not found');
    }
}

// Initialize Firebase when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    initializeFirebase();
} 