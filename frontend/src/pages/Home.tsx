import { useEffect, useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Category, Product } from '../types/global';
import * as categoriesApi from '../api/categoriesApi';
import * as productsApi from '../api/productsApi';
import styles from './Home.module.css';

// Import the same skincare products data from Skincare page
const ALL_SKINCARE_PRODUCTS = [
  { id: '51', title: 'Dr.Melaxin Peel Shot Kojic Acid Turmeric Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/71FIL4QFAHL._AC_UL600_SR600,400_.jpg', asin: 'B0FXTGD7LC', affiliate: 'https://www.amazon.com/dp/B0FXTGD7LC/?tag=victoria0cdb-20' },
  { id: '52', title: 'Dr.Althea PDRN Reju 5000 Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/419qAvG77UL._AC_UL600_SR600,400_.jpg', asin: 'B0G26XC6KT', affiliate: 'https://www.amazon.com/dp/B0G26XC6KT/?tag=victoria0cdb-20' },
  { id: '53', title: 'Head & Shoulders Anti-Dandruff Shampoo BARE', image: 'https://images-na.ssl-images-amazon.com/images/I/71QJ6y6v99L._AC_UL600_SR600,400_.jpg', asin: 'B0DMT1CJ2Q', affiliate: 'https://www.amazon.com/dp/B0DMT1CJ2Q/?tag=victoria0cdb-20' },
  { id: '54', title: 'AEEHFENG Timilk ChillErase Bump Renewal Spray', image: 'https://images-na.ssl-images-amazon.com/images/I/71XnLCYLNTL._AC_UL600_SR600,400_.jpg', asin: 'B0GCK5SHXJ', affiliate: 'https://www.amazon.com/dp/B0GCK5SHXJ/?tag=victoria0cdb-20' },
  { id: '55', title: 'Lymphatic Contour Face Brush', image: 'https://images-na.ssl-images-amazon.com/images/I/71j6xfG0fkL._AC_UL600_SR600,400_.jpg', asin: 'B0FYVG98GM', affiliate: 'https://www.amazon.com/dp/B0FYVG98GM/?tag=victoria0cdb-20' },
  { id: '56', title: 'JODSONE 3-in-1 Cat Eye Magnet Nail Tool', image: 'https://images-na.ssl-images-amazon.com/images/I/61Sjj++alVL._AC_UL600_SR600,400_.jpg', asin: 'B0FX3MP3W2', affiliate: 'https://www.amazon.com/dp/B0FX3MP3W2/?tag=victoria0cdb-20' },
  { id: '57', title: 'Native Scalp Detox Shampoo and Conditioner', image: 'https://images-na.ssl-images-amazon.com/images/I/71KXpO6jHwL._AC_UL600_SR600,400_.jpg', asin: 'B0G27P2LGS', affiliate: 'https://www.amazon.com/dp/B0G27P2LGS/?tag=victoria0cdb-20' },
  { id: '58', title: 'e.l.f. SKIN Bright + Brew-tiful Eye Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/61ax411X7gL._AC_UL600_SR600,400_.jpg', asin: 'B0G1H91LGM', affiliate: 'https://www.amazon.com/dp/B0G1H91LGM/?tag=victoria0cdb-20' },
  { id: '59', title: 'Lattafa Asad Elixir EDP', image: 'https://images-na.ssl-images-amazon.com/images/I/51f4XfVZtGL._AC_UL600_SR600,400_.jpg', asin: 'B0FWYPY4FX', affiliate: 'https://www.amazon.com/dp/B0FWYPY4FX/?tag=victoria0cdb-20' },
  { id: '60', title: 'prgislew Nose Hair Trimmer', image: 'https://images-na.ssl-images-amazon.com/images/I/61Fx2TiBpeL._AC_UL600_SR600,400_.jpg', asin: 'B0G18RXVLB', affiliate: 'https://www.amazon.com/dp/B0G18RXVLB/?tag=victoria0cdb-20' },
  { id: '61', title: 'Saltair Hyaluronic Acid Body Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/51mZFbRKa+L._AC_UL600_SR600,400_.jpg', asin: 'B0FX39VLRL', affiliate: 'https://www.amazon.com/dp/B0FX39VLRL/?tag=victoria0cdb-20' },
  { id: '63', title: 'grace & stella Hypochlorous Acid Spray', image: 'https://images-na.ssl-images-amazon.com/images/I/719x7jMja2L._AC_UL600_SR600,400_.jpg', asin: 'B0F6TS5HVH', affiliate: 'https://www.amazon.com/dp/B0F6TS5HVH/?tag=victoria0cdb-20' },
  { id: '64', title: 'GODA for Her Perfume and Silk Body Oil', image: 'https://images-na.ssl-images-amazon.com/images/I/61hUIcbOjrL._AC_UL600_SR600,400_.jpg', asin: 'B0G3RN2SC7', affiliate: 'https://www.amazon.com/dp/B0G3RN2SC7/?tag=victoria0cdb-20' },
  { id: '65', title: 'Vagilelf Demon Mark Tattoos', image: 'https://images-na.ssl-images-amazon.com/images/I/71Bz-a4mo4L._AC_UL600_SR600,400_.jpg', asin: 'B0FVYGZ255', affiliate: 'https://www.amazon.com/dp/B0FVYGZ255/?tag=victoria0cdb-20' },
  { id: '66', title: 'NYX Epic Inky Stix Eyeliner', image: 'https://images-na.ssl-images-amazon.com/images/I/51yUxo+5dHL._AC_UL600_SR600,400_.jpg', asin: 'B0FZCBBVDK', affiliate: 'https://www.amazon.com/dp/B0FZCBBVDK/?tag=victoria0cdb-20' },
  { id: '67', title: 'Lash Serum for Eyelashes & Eyebrows', image: 'https://images-na.ssl-images-amazon.com/images/I/61UQjAx4z5L._AC_UL600_SR600,400_.jpg', asin: 'B0GD12FCYQ', affiliate: 'https://www.amazon.com/dp/B0GD12FCYQ/?tag=victoria0cdb-20' },
  { id: '68', title: '2 Pcs Texture Comb Set', image: 'https://images-na.ssl-images-amazon.com/images/I/61+6nIreqOL._AC_UL600_SR600,400_.jpg', asin: 'B0G39WCFG2', affiliate: 'https://www.amazon.com/dp/B0G39WCFG2/?tag=victoria0cdb-20' },
  { id: '69', title: 'eos Cashmere Body Mist', image: 'https://images-na.ssl-images-amazon.com/images/I/61KlSccHHpL._AC_UL600_SR600,400_.jpg', asin: 'B0FRLXNTB2', affiliate: 'https://www.amazon.com/dp/B0FRLXNTB2/?tag=victoria0cdb-20' },
  { id: '70', title: "L'Oreal Revitalift Triple Power Eye Bag Eraser", image: 'https://images-na.ssl-images-amazon.com/images/I/81RcZcfyRQL._AC_UL600_SR600,400_.jpg', asin: 'B0FXJ4KJZQ', affiliate: 'https://www.amazon.com/dp/B0FXJ4KJZQ/?tag=victoria0cdb-20' },
  { id: '71', title: "L'Oreal Elvive Glycolic + Gloss Hair Serum", image: 'https://images-na.ssl-images-amazon.com/images/I/61l15UtTN1L._AC_UL600_SR600,400_.jpg', asin: 'B0FWKX1QMC', affiliate: 'https://www.amazon.com/dp/B0FWKX1QMC/?tag=victoria0cdb-20' },
  { id: '72', title: 'Wavytalk Steam Hair Straightener', image: 'https://images-na.ssl-images-amazon.com/images/I/61-HItePnWL._AC_UL600_SR600,400_.jpg', asin: 'B0FVXPLCKX', affiliate: 'https://www.amazon.com/dp/B0FVXPLCKX/?tag=victoria0cdb-20' },
  { id: '73', title: 'Prequel Skin Retinaldehyde 0.1%', image: 'https://images-na.ssl-images-amazon.com/images/I/614XaVcFu8L._AC_UL600_SR600,400_.jpg', asin: 'B0FY36QKW8', affiliate: 'https://www.amazon.com/dp/B0FY36QKW8/?tag=victoria0cdb-20' },
  { id: '74', title: 'Callus Remover for Feet Electric Foot File', image: 'https://images-na.ssl-images-amazon.com/images/I/71foQ8cpEeL._AC_UL600_SR600,400_.jpg', asin: 'B0FVSVVTQK', affiliate: 'https://www.amazon.com/dp/B0FVSVVTQK/?tag=victoria0cdb-20' },
  { id: '75', title: 'COSRX Advanced Pure Vitamin C 23% Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/71LzZAsVE+L._AC_UL600_SR600,400_.jpg', asin: 'B0FWQGLTQV', affiliate: 'https://www.amazon.com/dp/B0FWQGLTQV/?tag=victoria0cdb-20' },
  { id: '76', title: 'Kitsch Strengthening Rice Water Protein Shampoo', image: 'https://images-na.ssl-images-amazon.com/images/I/71Ng-h0FaTL._AC_UL600_SR600,400_.jpg', asin: 'B0FWDDN77G', affiliate: 'https://www.amazon.com/dp/B0FWDDN77G/?tag=victoria0cdb-20' },
  { id: '77', title: 'Jawline Shaper Chin Strap', image: 'https://images-na.ssl-images-amazon.com/images/I/61ADwFfmABL._AC_UL600_SR600,400_.jpg', asin: 'B0FNQSMFTN', affiliate: 'https://www.amazon.com/dp/B0FNQSMFTN/?tag=victoria0cdb-20' },
  { id: '78', title: 'Lymphatic Contour Face Brush', image: 'https://images-na.ssl-images-amazon.com/images/I/61PoCKMjBSL._AC_UL600_SR600,400_.jpg', asin: 'B0FXTTV4NV', affiliate: 'https://www.amazon.com/dp/B0FXTTV4NV/?tag=victoria0cdb-20' },
  { id: '79', title: 'e.l.f. Soft Glam Brightening Corrector', image: 'https://images-na.ssl-images-amazon.com/images/I/61je2LPc2qL._AC_UL600_SR600,400_.jpg', asin: 'B0G1H283LW', affiliate: 'https://www.amazon.com/dp/B0G1H283LW/?tag=victoria0cdb-20' },
  { id: '80', title: 'Dove Holiday Treats Body Wash', image: 'https://images-na.ssl-images-amazon.com/images/I/61-fcISkgLL._AC_UL600_SR600,400_.jpg', asin: 'B0CNZ5YLVB', affiliate: 'https://www.amazon.com/dp/B0CNZ5YLVB/?tag=victoria0cdb-20' },
];

// AMAZON API DISABLED: Always use database products
// import AmazonProductCard from '../components/AmazonProductCard';
// import { AmazonProduct } from '../api/amazonApi';
// import * as amazonApi from '../api/amazonApi';

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [skincareProducts, setSkincareProducts] = useState<Product[]>([]);
  const [skincareLoading, setSkincareLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[HOME] Fetching categories for homepage...');
        setLoading(true);
        
        // Fetch categories
        const categoriesRes = await categoriesApi.getCategories();
        setCategories(categoriesRes);
        console.log('[HOME] Categories fetched:', categoriesRes.length);
        
      } catch (error: any) {
        console.error('[HOME] ❌ Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
        console.log('[HOME] ✅ Categories loading complete');
      }
    };

    fetchData();
  }, []);

  // Use the same static skincare products data from Skincare page
  useEffect(() => {
    console.log('[HOME] ========== LOADING SKINCARE PRODUCTS FROM STATIC DATA ==========');
    setSkincareLoading(true);
    
    // Convert static skincare products to Product format for ProductCard
    const convertedProducts: Product[] = ALL_SKINCARE_PRODUCTS.slice(0, 8).map((item) => ({
      id: item.id,
      name: item.title,
      slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: `${item.title} - Premium skincare product.`,
      price: 29.99, // Default price - can be customized
      stock: 100,
      featured: true,
      images: [item.image],
      categoryId: 'skincare', // Placeholder category ID
    }));
    
    setSkincareProducts(convertedProducts);
    setSkincareLoading(false);
    console.log('[HOME] ✅ Loaded', convertedProducts.length, 'skincare products from static data');
  }, []);

  // Log rendering state for debugging
  console.log('[HOME RENDER] ========== RENDERING HOME PAGE ==========');
  console.log('[HOME RENDER] Loading:', loading);
  console.log('[HOME RENDER] Categories:', categories.length);
  console.log('[HOME RENDER] Skincare Products:', skincareProducts.length);
  console.log('[HOME RENDER] Skincare Loading:', skincareLoading);

  // Show loader ONLY when loading is true
  if (loading) {
    console.log('[HOME RENDER] Showing loader...');
    return <Loader />;
  }

  return (
    <div className={styles.home}>
      {/* Hero Banner Section - Single Image */}
      <section className={styles.heroSection}>
        <div 
          className={styles.heroBanner}
          style={{ backgroundImage: `url(/images/edition-banner.png)` }}
        >
          {/* CRT TV Overlay */}
          <div className={styles.crtOverlay}></div>
          
          {/* Finger Smoothing Overlay */}
          <div className={styles.fingerSmoothOverlay}></div>
          
          {/* Cloud Overlay */}
          <div className={styles.cloudOverlay}></div>
          
          {/* Grain Overlay - Subtle film grain texture */}
          <div className={styles.grainOverlay}></div>
          
          {/* Brand Name Overlay */}
          <div className={styles.brandName}>
            <h1 className={styles.brandTitle}>AURAPOP</h1>
            <p className={styles.brandSubline}>Tori Edition</p>
          </div>
        </div>
      </section>

      {/* Featured Skincare Section - DIRECTLY UNDER BANNER - NO GAPS */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>featured skincare</h2>
          {skincareLoading ? (
            <div className={styles.productsGrid}>
              <p className={styles.loadingMessage}>Loading skincare products...</p>
            </div>
          ) : skincareProducts.length > 0 ? (
            <div className={styles.productsGrid}>
              {skincareProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.productsGrid}>
              <p className={styles.loadingMessage}>No skincare products found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Cloud Divider - Between sections (after Featured Skincare) */}
      <div className={styles.cloudDivider}></div>

      {/* Shop by Category Section */}
      {categories.length > 0 && (
        <section className={styles.categorySection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Shop by Category</h2>
            <div className={styles.categoriesGrid}>
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cloud Divider - Only show at bottom if we have content */}
      {categories.length > 0 && <div className={styles.cloudDivider}></div>}
    </div>
  );
};

export default Home;
