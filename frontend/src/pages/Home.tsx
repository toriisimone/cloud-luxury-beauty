import ProductCarousel from '../components/ProductCarousel';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.home}>
      {/* Hero Banner Section - Single Image */}
      <section className={styles.heroSection}>
        <div 
          className={styles.heroBanner}
          style={{ backgroundImage: `url(/images/three-banner.png)` }}
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
            
            {/* Single CTA Button (works for both desktop + mobile via shared classes) */}
            <div className="hero__buttons hero_button">
              <button
                data-placement="button 1"
                className="hero__content__desktop_button hero__content__mobile_button action action--primary"
              >
                Subscribe For New
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Carousel - Directly under hero banner */}
      <ProductCarousel />
    </div>
  );
};

export default Home;
