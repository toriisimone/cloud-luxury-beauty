import { useEffect, useRef } from 'react';
import styles from './BrandBanner.module.css';

const BrandBanner = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const brands = [
    'Ulta Beauty',
    'Sephora',
    'Cult Beauty',
    'Glossier',
    'Fenty Beauty',
    'Rare Beauty',
    'Drunk Elephant',
    'The Ordinary',
    'Kiehl\'s',
    'MAC Cosmetics',
    'NARS',
    'Urban Decay',
    'Too Faced',
    'Tarte',
    'Anastasia Beverly Hills',
  ];

  // Duplicate brands for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Smooth infinite scroll - luxury slow speed
    let scrollPosition = 0;
    const scrollSpeed = 0.15; // Slower, more luxury feel - half the previous speed

    const scroll = () => {
      scrollPosition += scrollSpeed;
      const containerWidth = scrollContainer.scrollWidth / 3; // Divide by 3 since we duplicated 3 times
      
      if (scrollPosition >= containerWidth) {
        scrollPosition = 0;
      }
      
      scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className={styles.brandBanner}>
      <div className={styles.brandBannerContainer}>
        <div className={styles.brandScrollWrapper} ref={scrollContainerRef}>
          {duplicatedBrands.map((brand, index) => (
            <span key={index} className={styles.brandItem}>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandBanner;
