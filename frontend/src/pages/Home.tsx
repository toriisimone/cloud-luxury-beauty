import { useEffect, useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import Loader from '../components/Loader';
import { Category } from '../types/global';
import * as categoriesApi from '../api/categoriesApi';
import styles from './Home.module.css';

// Import skincare products data
interface SkincareProduct {
  id: string;
  title: string;
  image: string;
  asin: string;
  affiliate: string;
}

// All skincare products (imported from Skincare.tsx)
const ALL_SKINCARE_PRODUCTS: SkincareProduct[] = [
  { id: '51', title: 'Dr.Melaxin Peel Shot Kojic Acid Turmeric Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/71FIL4QFAHL._AC_UL600_SR600,400_.jpg', asin: 'B0FXTGD7LC', affiliate: 'https://www.amazon.com/dp/B0FXTGD7LC/?tag=victoria0cdb-20' },
  { id: '52', title: 'Dr.Althea PDRN Reju 5000 Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/419qAvG77UL._AC_UL600_SR600,400_.jpg', asin: 'B0G26XC6KT', affiliate: 'https://www.amazon.com/dp/B0G26XC6KT/?tag=victoria0cdb-20' },
  { id: '53', title: 'Head & Shoulders Anti-Dandruff Shampoo BARE', image: 'https://images-na.ssl-images-amazon.com/images/I/71QJ6y6v99L._AC_UL600_SR600,400_.jpg', asin: 'B0DMT1CJ2Q', affiliate: 'https://www.amazon.com/dp/B0DMT1CJ2Q/?tag=victoria0cdb-20' },
  { id: '61', title: 'Saltair Hyaluronic Acid Body Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/51mZFbRKa+L._AC_UL600_SR600,400_.jpg', asin: 'B0FX39VLRL', affiliate: 'https://www.amazon.com/dp/B0FX39VLRL/?tag=victoria0cdb-20' },
  { id: '63', title: 'grace & stella Hypochlorous Acid Spray', image: 'https://images-na.ssl-images-amazon.com/images/I/719x7jMja2L._AC_UL600_SR600,400_.jpg', asin: 'B0F6TS5HVH', affiliate: 'https://www.amazon.com/dp/B0F6TS5HVH/?tag=victoria0cdb-20' },
  { id: '67', title: 'Lash Serum for Eyelashes & Eyebrows', image: 'https://images-na.ssl-images-amazon.com/images/I/61UQjAx4z5L._AC_UL600_SR600,400_.jpg', asin: 'B0GD12FCYQ', affiliate: 'https://www.amazon.com/dp/B0GD12FCYQ/?tag=victoria0cdb-20' },
  { id: '69', title: 'eos Cashmere Body Mist', image: 'https://images-na.ssl-images-amazon.com/images/I/61KlSccHHpL._AC_UL600_SR600,400_.jpg', asin: 'B0FRLXNTB2', affiliate: 'https://www.amazon.com/dp/B0FRLXNTB2/?tag=victoria0cdb-20' },
  { id: '71', title: "L'Oreal Elvive Glycolic + Gloss Hair Serum", image: 'https://images-na.ssl-images-amazon.com/images/I/61l15UtTN1L._AC_UL600_SR600,400_.jpg', asin: 'B0FWKX1QMC', affiliate: 'https://www.amazon.com/dp/B0FWKX1QMC/?tag=victoria0cdb-20' },
  { id: '72', title: 'Wavytalk Steam Hair Straightener', image: 'https://images-na.ssl-images-amazon.com/images/I/61-HItePnWL._AC_UL600_SR600,400_.jpg', asin: 'B0FVXPLCKX', affiliate: 'https://www.amazon.com/dp/B0FVXPLCKX/?tag=victoria0cdb-20' },
  { id: '92', title: 'VFD 30X/1X Makeup Mirror with Lights', image: 'https://images-na.ssl-images-amazon.com/images/I/618O2BajQIL._AC_UL300_SR300,200_.jpg', asin: 'B0FVBFHLHW', affiliate: 'https://www.amazon.com/dp/B0FVBFHLHW/?tag=victoria0cdb-20' },
  { id: '93', title: 'NYX Buttermelt Highlighter', image: 'https://images-na.ssl-images-amazon.com/images/I/81Of4mXdNeL._AC_UL300_SR300,200_.jpg', asin: 'B0DZ2M8BNF', affiliate: 'https://www.amazon.com/dp/B0DZ2M8BNF/?tag=victoria0cdb-20' },
  { id: '94', title: "L'Oreal Paris Extensionist Mascara", image: 'https://images-na.ssl-images-amazon.com/images/I/61v7CPtyOHL._AC_UL600_SR600,400_.jpg', asin: 'B0FSSPR9C1', affiliate: 'https://www.amazon.com/dp/B0FSSPR9C1/?tag=victoria0cdb-20' },
  { id: '95', title: 'COVERGIRL TruBlend Skin Enhancer Baked Luminous Blush - Rose Latte', image: 'https://images-na.ssl-images-amazon.com/images/I/91ggsrn-rOL._AC_UL600_SR600,400_.jpg', asin: 'B0FJNDCRB8', affiliate: 'https://www.amazon.com/dp/B0FJNDCRB8/?tag=victoria0cdb-20' },
  { id: '96', title: 'e.l.f. Glow Reviver Slipstick - Jam Packed', image: 'https://images-na.ssl-images-amazon.com/images/I/51zSzhrA4kL._AC_UL600_SR600,400_.jpg', asin: 'B0G1H1NQY8', affiliate: 'https://www.amazon.com/dp/B0G1H1NQY8/?tag=victoria0cdb-20' },
];

// Curated featured products - ONLY these 14 products should be displayed
const FEATURED_SKINCARE_ASINS = [
  'B0FXTGD7LC', // Dr.Melaxin Peel Shot Kojic Acid Turmeric Serum
  'B0G26XC6KT', // Dr.Althea PDRN Reju 5000 Cream
  'B0DMT1CJ2Q', // Head & Shoulders Anti-Dandruff Shampoo BARE
  'B0FX39VLRL', // Saltair Hyaluronic Acid Body Serum
  'B0F6TS5HVH', // grace & stella Hypochlorous Acid Spray
  'B0GD12FCYQ', // Lash Serum for Eyelashes & Eyebrows
  'B0FRLXNTB2', // eos Cashmere Body Mist
  'B0FWKX1QMC', // L'Oreal Elvive Glycolic + Gloss Hair Serum
  'B0FVXPLCKX', // Wavytalk Steam Hair Straightener
  'B0FVBFHLHW', // VFD 30X/1X Makeup Mirror with Lights
  'B0DZ2M8BNF', // NYX Buttermelt Highlighter
  'B0FSSPR9C1', // L'Oreal Paris Extensionist Mascara
  'B0FJNDCRB8', // COVERGIRL TruBlend Skin Enhancer Blush - Rose Latte
  'B0G1H1NQY8', // e.l.f. Glow Reviver Slipstick - Jam Packed
];

// Filter to only the curated featured products
const FEATURED_SKINCARE_PRODUCTS = ALL_SKINCARE_PRODUCTS.filter(product => 
  FEATURED_SKINCARE_ASINS.includes(product.asin)
);

// AMAZON API DISABLED: Always use database products
// import AmazonProductCard from '../components/AmazonProductCard';
// import { AmazonProduct } from '../api/amazonApi';
// import * as amazonApi from '../api/amazonApi';

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
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

  // Log rendering state for debugging
  console.log('[HOME RENDER] ========== RENDERING HOME PAGE ==========');
  console.log('[HOME RENDER] Loading:', loading);
  console.log('[HOME RENDER] Categories:', categories.length);

  // Show loader only if categories are loading
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

      {/* Cloud Divider - Between sections */}
      <div className={styles.cloudDivider}></div>

      {/* Featured Skincare Section - Directly under banner */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredContainer}>
          {/* Section Title */}
          <h2 className={styles.featuredTitle}>Featured Skincare</h2>

          {/* Top Bar - Breadcrumb and Controls */}
          <div className={styles.topBar}>
            <div className={styles.breadcrumb}>
              <span>Home</span>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span>Featured Skincare</span>
            </div>
            <div className={styles.topControls}>
              <div className={styles.sortControl}>
                <span className={styles.controlLabel}>SORT BY</span>
                <select className={styles.sortSelect}>
                  <option>FEATURED</option>
                  <option>PRICE: LOW TO HIGH</option>
                  <option>PRICE: HIGH TO LOW</option>
                  <option>NEWEST</option>
                </select>
              </div>
              <div className={styles.showControl}>
                <span className={styles.controlLabel}>SHOW</span>
                <button className={styles.showButton}>60</button>
                <button className={styles.showButton}>120</button>
              </div>
            </div>
          </div>

          {/* Featured Content - Sidebar, Grid, Promo Banner */}
          <div className={styles.featuredContent}>
            {/* Left Sidebar */}
            <aside className={styles.sidebar}>
              <h3 className={styles.sidebarTitle}>Category</h3>
              <ul className={styles.categoryList}>
                <li className={styles.categoryItem}>
                  <input type="checkbox" id="cleansers" />
                  <label htmlFor="cleansers">Cleansers</label>
                </li>
                <li className={styles.categoryItem}>
                  <input type="checkbox" id="toners" />
                  <label htmlFor="toners">Toners</label>
                </li>
                <li className={styles.categoryItem}>
                  <input type="checkbox" id="serums" />
                  <label htmlFor="serums">Serums</label>
                </li>
                <li className={styles.categoryItem}>
                  <input type="checkbox" id="moisturizers" />
                  <label htmlFor="moisturizers">Moisturizers</label>
                </li>
                <li className={styles.categoryItem}>
                  <input type="checkbox" id="masks" />
                  <label htmlFor="masks">Masks</label>
                </li>
                <li className={styles.categoryItem}>
                  <input type="checkbox" id="spf" />
                  <label htmlFor="spf">SPF</label>
                </li>
                <li className={styles.categoryItem}>
                  <input type="checkbox" id="eyecare" />
                  <label htmlFor="eyecare">Eye Care</label>
                </li>
                <li className={styles.categoryItem}>
                  <input type="checkbox" id="tools" />
                  <label htmlFor="tools">Tools</label>
                </li>
                <li className={styles.categoryItem}>
                  <input type="checkbox" id="sets" />
                  <label htmlFor="sets">Sets</label>
                </li>
                <li className={styles.categoryItem}>
                  <a href="#" className={styles.viewMoreLink}>View More</a>
                </li>
              </ul>
            </aside>

            {/* Main Product Grid */}
            <div className={styles.gridArea}>
              <div className={styles.productsGrid}>
                {FEATURED_SKINCARE_PRODUCTS.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.productImageWrapper}>
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className={styles.productImage}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className={styles.productBadge}>NEW!</span>
                    </div>
                    <h3 className={styles.productTitle}>{product.title}</h3>
                    <button 
                      className={styles.buyButton}
                      onClick={() => window.open(product.affiliate, '_blank', 'noopener,noreferrer')}
                    >
                      Shop Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Promo Banner */}
            <div className={styles.promoBanner}>
              <div className={styles.promoContent}>
                <div className={styles.promoText}>GET 30% OFF!</div>
                <div className={styles.promoArrow}>↓</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
