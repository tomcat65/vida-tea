/**
 * Vida-Tea Internationalization (i18n) System
 * Supports 6 languages with cultural authenticity and performance optimization
 * 
 * Languages: English, Spanish, Korean, Vietnamese, Chinese, Hindi
 * Features: <200ms switching, URL persistence, browser detection, accessibility
 */

class VidaTeaI18n {
    constructor() {
        this.currentLanguage = 'en';
        this.fallbackLanguage = 'en';
        this.translations = {};
        this.loadedLanguages = new Set();
        this.languageConfigs = {
            en: {
                name: 'English',
                code: 'en',
                font: 'Inter, sans-serif',
                direction: 'ltr',
                culturalContext: 'universal'
            },
            es: {
                name: 'Español',
                code: 'es',
                font: 'Inter, sans-serif',
                direction: 'ltr',
                culturalContext: 'latino'
            },
            ko: {
                name: '한국어',
                code: 'ko',
                font: 'Noto Sans KR, sans-serif',
                direction: 'ltr',
                culturalContext: 'korean'
            },
            vi: {
                name: 'Tiếng Việt',
                code: 'vi',
                font: 'Inter, sans-serif',
                direction: 'ltr',
                culturalContext: 'vietnamese'
            },
            zh: {
                name: '中文',
                code: 'zh',
                font: 'Noto Sans SC, sans-serif',
                direction: 'ltr',
                culturalContext: 'chinese'
            },
            hi: {
                name: 'हिन्दी',
                code: 'hi',
                font: 'Noto Sans Devanagari, sans-serif',
                direction: 'ltr',
                culturalContext: 'indian'
            }
        };
        
        this.init();
    }
    
    async init() {
        // Detect browser language
        this.detectBrowserLanguage();
        
        // Load saved language preference
        this.loadSavedLanguage();
        
        // Load base language immediately
        await this.loadLanguage(this.currentLanguage);
        
        // Apply initial language
        this.applyLanguage(this.currentLanguage);
        
        // Load other languages in background
        this.preloadLanguages();
        
        console.log('VidaTeaI18n initialized with language:', this.currentLanguage);
    }
    
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        // Map browser language to supported languages
        const languageMap = {
            'es': 'es',
            'ko': 'ko',
            'vi': 'vi',
            'zh': 'zh',
            'hi': 'hi',
            'default': 'en'
        };
        
        const detectedLang = languageMap[langCode] || languageMap.default;
        this.currentLanguage = detectedLang;
    }
    
    loadSavedLanguage() {
        const saved = localStorage.getItem('vidaTeaLanguage');
        if (saved && this.languageConfigs[saved]) {
            this.currentLanguage = saved;
        }
    }
    
    saveLanguagePreference(langCode) {
        localStorage.setItem('vidaTeaLanguage', langCode);
        
        // Update URL without page reload
        const url = new URL(window.location);
        url.searchParams.set('lang', langCode);
        window.history.replaceState({}, '', url);
    }
    
    async loadLanguage(langCode) {
        if (this.loadedLanguages.has(langCode)) {
            return this.translations[langCode];
        }
        
        try {
            const response = await fetch(`/translations/${langCode}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language: ${langCode}`);
            }
            
            const translations = await response.json();
            this.translations[langCode] = translations;
            this.loadedLanguages.add(langCode);
            
            console.log(`Loaded language: ${langCode}`);
            return translations;
        } catch (error) {
            console.error(`Error loading language ${langCode}:`, error);
            return this.translations[this.fallbackLanguage] || {};
        }
    }
    
    async preloadLanguages() {
        const languages = Object.keys(this.languageConfigs);
        const promises = languages.map(lang => this.loadLanguage(lang));
        await Promise.allSettled(promises);
    }
    
    async switchLanguage(langCode) {
        if (!this.languageConfigs[langCode]) {
            console.error(`Unsupported language: ${langCode}`);
            return false;
        }
        
        const startTime = performance.now();
        
        // Load language if not already loaded
        await this.loadLanguage(langCode);
        
        // Update current language
        this.currentLanguage = langCode;
        
        // Save preference
        this.saveLanguagePreference(langCode);
        
        // Apply language changes
        this.applyLanguage(langCode);
        
        const endTime = performance.now();
        console.log(`Language switch completed in ${(endTime - startTime).toFixed(2)}ms`);
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: langCode }
        }));
        
        return true;
    }
    
    applyLanguage(langCode) {
        const config = this.languageConfigs[langCode];
        const translations = this.translations[langCode];
        
        if (!config || !translations) {
            console.error(`Cannot apply language ${langCode}: missing config or translations`);
            return;
        }
        
        // Update document language and direction
        document.documentElement.lang = langCode;
        document.documentElement.dir = config.direction;
        
        // Apply cultural font
        document.documentElement.style.setProperty('--cultural-font', config.font);
        
        // Apply cultural theme
        this.applyCulturalTheme(config.culturalContext);
        
        // Translate all elements with data-i18n attribute
        this.translateElements(translations);
        
        // Update meta tags
        this.updateMetaTags(langCode, translations);
    }
    
    applyCulturalTheme(culturalContext) {
        const themes = {
            universal: {
                '--primary-color': '#228B22',
                '--accent-color': '#32CD32',
                '--cultural-accent': '#228B22'
            },
            latino: {
                '--primary-color': '#D4AF37',
                '--accent-color': '#FFD700',
                '--cultural-accent': '#D4AF37'
            },
            korean: {
                '--primary-color': '#FF6B6B',
                '--accent-color': '#FF8E8E',
                '--cultural-accent': '#FF6B6B'
            },
            vietnamese: {
                '--primary-color': '#FF6B35',
                '--accent-color': '#FF8E53',
                '--cultural-accent': '#FF6B35'
            },
            chinese: {
                '--primary-color': '#DC143C',
                '--accent-color': '#FF4D4D',
                '--cultural-accent': '#DC143C'
            },
            indian: {
                '--primary-color': '#FF9933',
                '--accent-color': '#FFB366',
                '--cultural-accent': '#FF9933'
            }
        };
        
        const theme = themes[culturalContext] || themes.universal;
        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
    }
    
    translateElements(translations) {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(translations, key);
            
            if (translation) {
                // Handle different element types
                if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                    element.placeholder = translation;
                } else if (element.tagName === 'IMG') {
                    element.alt = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }
    
    getNestedTranslation(translations, key) {
        const keys = key.split('.');
        let value = translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return value;
    }
    
    updateMetaTags(langCode, translations) {
        // Update title
        const title = translations.meta?.title || 'Vida-Tea Wellness';
        document.title = title;
        
        // Update meta description
        const description = translations.meta?.description || '';
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description);
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', title);
        }
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
            ogDesc.setAttribute('content', description);
        }
    }
    
    // Public API methods
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    getSupportedLanguages() {
        return Object.keys(this.languageConfigs);
    }
    
    getLanguageConfig(langCode) {
        return this.languageConfigs[langCode];
    }
    
    translate(key, params = {}) {
        const translation = this.getNestedTranslation(this.translations[this.currentLanguage], key);
        if (!translation) {
            return key;
        }
        
        // Simple parameter replacement
        return translation.replace(/\{(\w+)\}/g, (match, param) => {
            return params[param] || match;
        });
    }
    
    // Accessibility methods
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Initialize global instance
window.vidaTeaI18n = new VidaTeaI18n();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VidaTeaI18n;
} 