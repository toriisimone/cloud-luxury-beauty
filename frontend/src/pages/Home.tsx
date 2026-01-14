import { useEffect, useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import Loader from '../components/Loader';
import { Category } from '../types/global';
import * as categoriesApi from '../api/categoriesApi';
import styles from './Home.module.css';

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
          
          {/* Hero Content - Exact Kylie Structure with AURAPOP Content */}
          <div className="hero__content hero__content--desktop hero__content--h-left hero__content--v-center hero__content--false hero__content--mobile-h-left hero__content--mobile-v-" style={{ backgroundColor: 'transparent' }}>
            {/* Desktop Heading */}
            <h2 className="hero__content__desktop_heading hero__heading hero__heading--h1" style={{ color: 'rgb(255, 255, 255)' }}>
              <font size="3">ARRIVING THIS SPRING</font>
              <br />AURAPOP LUMINOUS ESSENCE
            </h2>
            
            {/* Mobile Heading */}
            <h2 className="hero__content__mobile_heading hero__heading hero__heading--h1" style={{ color: 'rgb(57, 57, 57)' }}>
              <font size="3">ARRIVING THIS SPRING</font>
              <br />AURAPOP LUMINOUS ESSENCE
            </h2>
            
            {/* Desktop Paragraph */}
            <div className="hero__content__desktop_paragraph hero__paragraph hero__paragraph--20-17" style={{ color: 'rgb(255, 255, 255)' }}>
              <p>
                a modern reinvention of our signature,<br /> most‑loved beauty formula
              </p>
            </div>
            
            {/* Mobile Paragraph */}
            <div className="hero__content__mobile_paragraph hero__paragraph hero__paragraph--20-17" style={{ color: 'rgb(0, 0, 0)' }}>
              <p>
                a modern reinvention of our signature,<br /> most‑loved beauty formula
              </p>
            </div>
            
            {/* Desktop Button */}
            <div className="hero__buttons hero_button">
              <button 
                data-placement="button 1" 
                className="hero__content__desktop_button action action--primary"
              >
                join waitlist
              </button>
            </div>
            
            {/* Mobile Button */}
            <div className="hero__buttons hero_button">
              <button 
                data-placement="button 1" 
                className="hero__content__mobile_button action action--primary"
              >
                join waitlist
              </button>
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
