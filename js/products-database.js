// Vida-Tea Wellness - Product Database
// Curated selection from QTradeTeas catalogs for premium wellness positioning

const vidaTeaProducts = [
  // Premium Black Teas
  {
    id: "BLK-001",
    name: "Organic Earl Grey Pekoe",
    category: "Black Tea",
    subcategory: "Classic Blends",
    description: "Bergamot-infused organic black tea from Sri Lanka",
    healthBenefits: ["antioxidants", "energy", "mental clarity"],
    origin: "Sri Lanka",
    itemCode: "C10018",
    price: 28.00,
    servingSize: "1 tsp per 8oz",
    brewTime: "3-5 minutes",
    brewTemp: "200°F",
    caffeine: "high",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: true,
    imageUrl: "",
    sku: "QT-BLK-001"
  },
  {
    id: "BLK-002",
    name: "Organic Darjeeling TGOF",
    category: "Black Tea",
    subcategory: "Premium Single Origin",
    description: "First flush Darjeeling with floral notes and bright character",
    healthBenefits: ["antioxidants", "digestive support", "mental alertness"],
    origin: "India",
    itemCode: "C10058",
    price: 35.00,
    servingSize: "1 tsp per 8oz",
    brewTime: "3-4 minutes",
    brewTemp: "200°F",
    caffeine: "high",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: false,
    imageUrl: "",
    sku: "QT-BLK-002"
  },
  {
    id: "BLK-003",
    name: "Organic Assam FOP",
    category: "Black Tea",
    subcategory: "Premium Single Origin",
    description: "Full-bodied Assam with malty notes and rich flavor",
    healthBenefits: ["antioxidants", "energy", "digestive support"],
    origin: "India",
    itemCode: "C10040",
    price: 32.00,
    servingSize: "1 tsp per 8oz",
    brewTime: "4-5 minutes",
    brewTemp: "200°F",
    caffeine: "high",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: false,
    imageUrl: "",
    sku: "QT-BLK-003"
  },

  // Premium Green Teas
  {
    id: "GRN-001",
    name: "Organic Dragonwell 7401",
    category: "Green Tea",
    subcategory: "Premium Single Origin",
    description: "Pan-fired green tea with chestnut notes and smooth finish",
    healthBenefits: ["antioxidants", "metabolism", "mental clarity"],
    origin: "China",
    itemCode: "C10032",
    price: 38.00,
    servingSize: "1 tsp per 8oz",
    brewTime: "2-3 minutes",
    brewTemp: "175°F",
    caffeine: "medium",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: true,
    imageUrl: "",
    sku: "QT-GRN-001"
  },
  {
    id: "GRN-002",
    name: "Organic Sencha 8911",
    category: "Green Tea",
    subcategory: "Premium Single Origin",
    description: "Steamed Japanese green tea with fresh, grassy notes",
    healthBenefits: ["antioxidants", "metabolism", "immune support"],
    origin: "China",
    itemCode: "C10089",
    price: 30.00,
    servingSize: "1 tsp per 8oz",
    brewTime: "2-3 minutes",
    brewTemp: "175°F",
    caffeine: "medium",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: false,
    imageUrl: "",
    sku: "QT-GRN-002"
  },
  {
    id: "GRN-003",
    name: "Organic Matcha Powder",
    category: "Green Tea",
    subcategory: "Powder",
    description: "Stone-ground green tea powder for traditional preparation",
    healthBenefits: ["antioxidants", "energy", "focus", "metabolism"],
    origin: "China",
    itemCode: "C10086",
    price: 45.00,
    servingSize: "1/2 tsp per 8oz",
    brewTime: "Whisk until frothy",
    brewTemp: "175°F",
    caffeine: "high",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: true,
    imageUrl: "",
    sku: "QT-GRN-003"
  },

  // Premium White Teas
  {
    id: "WHT-001",
    name: "Organic Silver Needle",
    category: "White Tea",
    subcategory: "Premium Single Origin",
    description: "Delicate white tea with subtle sweetness and floral notes",
    healthBenefits: ["antioxidants", "gentle energy", "skin health"],
    origin: "China",
    itemCode: "C10092",
    price: 42.00,
    servingSize: "1 tsp per 8oz",
    brewTime: "3-5 minutes",
    brewTemp: "160°F",
    caffeine: "low",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: true,
    imageUrl: "",
    sku: "QT-WHT-001"
  },

  // Premium Oolong Teas
  {
    id: "OOL-001",
    name: "Organic Tie Kuan Yin C",
    category: "Oolong Tea",
    subcategory: "Premium Single Origin",
    description: "Semi-oxidized tea with orchid notes and smooth finish",
    healthBenefits: ["antioxidants", "digestive support", "mental clarity"],
    origin: "China",
    itemCode: "C10079",
    price: 36.00,
    servingSize: "1 tsp per 8oz",
    brewTime: "3-4 minutes",
    brewTemp: "185°F",
    caffeine: "medium",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: false,
    imageUrl: "",
    sku: "QT-OOL-001"
  },

  // Wellness Herbal Blends
  {
    id: "HERB-001",
    name: "Organic Chamomile Whole",
    category: "Herbal Tea",
    subcategory: "Wellness Blends",
    description: "Calming chamomile flowers for relaxation and sleep support",
    healthBenefits: ["relaxation", "sleep support", "digestive comfort"],
    origin: "Egypt",
    itemCode: "H10001",
    price: 22.00,
    servingSize: "1 tsp per 8oz",
    brewTime: "5-7 minutes",
    brewTemp: "200°F",
    caffeine: "none",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: true,
    imageUrl: "",
    sku: "QT-HERB-001"
  },
  {
    id: "HERB-002",
    name: "Organic Peppermint C/S",
    category: "Herbal Tea",
    subcategory: "Wellness Blends",
    description: "Refreshing peppermint for digestive support and mental clarity",
    healthBenefits: ["digestive support", "mental clarity", "fresh breath"],
    origin: "USA",
    itemCode: "H10017",
    price: 24.00,
    servingSize: "1 tsp per 8oz",
    brewTime: "5-7 minutes",
    brewTemp: "200°F",
    caffeine: "none",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: false,
    imageUrl: "",
    sku: "QT-HERB-002"
  },
  {
    id: "HERB-003",
    name: "Organic Rooibos Choice",
    category: "Herbal Tea",
    subcategory: "Wellness Blends",
    description: "South African red tea with natural sweetness and antioxidants",
    healthBenefits: ["antioxidants", "digestive support", "skin health"],
    origin: "South Africa",
    itemCode: "H10075",
    price: 26.00,
    servingSize: "1 tsp per 8oz",
    brewTime: "5-7 minutes",
    brewTemp: "200°F",
    caffeine: "none",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: false,
    imageUrl: "",
    sku: "QT-HERB-003"
  },
  {
    id: "HERB-004",
    name: "Organic Tulsi Krishna",
    category: "Herbal Tea",
    subcategory: "Wellness Blends",
    description: "Sacred basil for stress relief and immune support",
    healthBenefits: ["stress relief", "immune support", "adaptogenic"],
    origin: "India",
    itemCode: "H10095",
    price: 28.00,
    servingSize: "1 tsp per 8oz",
    brewTime: "5-7 minutes",
    brewTemp: "200°F",
    caffeine: "none",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: true,
    imageUrl: "",
    sku: "QT-HERB-004"
  },
  {
    id: "HERB-005",
    name: "Organic Yerba Mate Green",
    category: "Herbal Tea",
    subcategory: "Wellness Blends",
    description: "South American energizing herb with natural caffeine",
    healthBenefits: ["energy", "mental focus", "antioxidants"],
    origin: "Brazil",
    itemCode: "H10098",
    price: 30.00,
    servingSize: "1 tsp per 8oz",
    brewTime: "3-5 minutes",
    brewTemp: "175°F",
    caffeine: "medium",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: false,
    imageUrl: "",
    sku: "QT-HERB-005"
  },

  // Custom Arrangement Ingredients
  {
    id: "ING-001",
    name: "Organic Rose Petals",
    category: "Custom Ingredients",
    subcategory: "Flowers",
    description: "Edible rose petals for elegant tea arrangements",
    healthBenefits: ["skin health", "mood enhancement", "antioxidants"],
    origin: "India",
    itemCode: "H10074",
    price: 32.00,
    servingSize: "1/2 tsp per arrangement",
    brewTime: "Infuse with tea",
    brewTemp: "200°F",
    caffeine: "none",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: true,
    imageUrl: "",
    sku: "QT-ING-001"
  },
  {
    id: "ING-002",
    name: "Organic Lavender Flowers",
    category: "Custom Ingredients",
    subcategory: "Flowers",
    description: "Calming lavender for relaxation tea arrangements",
    healthBenefits: ["relaxation", "sleep support", "stress relief"],
    origin: "France",
    itemCode: "H10096",
    price: 34.00,
    servingSize: "1/2 tsp per arrangement",
    brewTime: "Infuse with tea",
    brewTemp: "200°F",
    caffeine: "none",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: false,
    imageUrl: "",
    sku: "QT-ING-002"
  },
  {
    id: "ING-003",
    name: "Organic Goji Berries",
    category: "Custom Ingredients",
    subcategory: "Fruits",
    description: "Superfruit berries for antioxidant-rich arrangements",
    healthBenefits: ["antioxidants", "immune support", "eye health"],
    origin: "China",
    itemCode: "F10007",
    price: 38.00,
    servingSize: "1/4 cup per arrangement",
    brewTime: "Infuse with tea",
    brewTemp: "200°F",
    caffeine: "none",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: true,
    imageUrl: "",
    sku: "QT-ING-003"
  },
  {
    id: "ING-004",
    name: "Organic Hibiscus C/S",
    category: "Custom Ingredients",
    subcategory: "Flowers",
    description: "Tart hibiscus for vibrant color and vitamin C",
    healthBenefits: ["vitamin C", "antioxidants", "digestive support"],
    origin: "Egypt",
    itemCode: "H10073",
    price: 26.00,
    servingSize: "1 tsp per arrangement",
    brewTime: "Infuse with tea",
    brewTemp: "200°F",
    caffeine: "none",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: false,
    imageUrl: "",
    sku: "QT-ING-004"
  },
  {
    id: "ING-005",
    name: "Organic Ginger Root C/S",
    category: "Custom Ingredients",
    subcategory: "Spices",
    description: "Warming ginger for digestive support and energy",
    healthBenefits: ["digestive support", "immune support", "energy"],
    origin: "China",
    itemCode: "H10006",
    price: 28.00,
    servingSize: "1/2 tsp per arrangement",
    brewTime: "Infuse with tea",
    brewTemp: "200°F",
    caffeine: "none",
    organic: true,
    fairTrade: true,
    certifications: ["Organic", "Fair Trade"],
    customArrangement: true,
    featured: false,
    imageUrl: "",
    sku: "QT-ING-005"
  }
];

// Product categories for filtering
const productCategories = [
  "Black Tea",
  "Green Tea", 
  "White Tea",
  "Oolong Tea",
  "Herbal Tea",
  "Custom Ingredients"
];

// Health benefits for filtering
const healthBenefits = [
  "antioxidants",
  "energy",
  "mental clarity",
  "digestive support",
  "relaxation",
  "sleep support",
  "immune support",
  "stress relief",
  "metabolism",
  "skin health",
  "focus"
];

// Initialize products in Firebase
async function initializeProductDatabase() {
  if (window.firebaseDB) {
    try {
      const batch = window.firebaseDB.batch();
      
      vidaTeaProducts.forEach(product => {
        const productRef = window.firebaseDB.collection('products').doc(product.id);
        batch.set(productRef, {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
      
      await batch.commit();
      console.log('Vida-Tea product database initialized successfully');
    } catch (error) {
      console.error('Error initializing product database:', error);
    }
  }
}

// Get products with filtering
async function getProducts(filters = {}) {
  if (window.firebaseDB) {
    try {
      let query = window.firebaseDB.collection('products');
      
      if (filters.category) {
        query = query.where('category', '==', filters.category);
      }
      
      if (filters.healthBenefits && filters.healthBenefits.length > 0) {
        query = query.where('healthBenefits', 'array-contains-any', filters.healthBenefits);
      }
      
      if (filters.featured) {
        query = query.where('featured', '==', true);
      }
      
      if (filters.customArrangement) {
        query = query.where('customArrangement', '==', true);
      }
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }
  return [];
}

// Get product by ID
async function getProductById(productId) {
  if (window.firebaseDB) {
    try {
      const doc = await window.firebaseDB.collection('products').doc(productId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }
  return null;
}

// Search products
async function searchProducts(searchTerm) {
  if (window.firebaseDB) {
    try {
      const snapshot = await window.firebaseDB.collection('products')
        .where('name', '>=', searchTerm)
        .where('name', '<=', searchTerm + '\uf8ff')
        .get();
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
  return [];
}

// Export functions for use in other modules
window.vidaTeaProducts = {
  initializeProductDatabase,
  getProducts,
  getProductById,
  searchProducts,
  productCategories,
  healthBenefits,
  products: vidaTeaProducts
};

console.log('Vida-Tea product database module loaded'); 