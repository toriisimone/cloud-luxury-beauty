import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Loader from '../components/Loader';
import { Product, Category } from '../types/global';
import * as productsApi from '../api/productsApi';
import * as categoriesApi from '../api/categoriesApi';
import styles from './Home.module.css';

// Hero banner images - first is user's uploaded image, rest are placeholders
// To use hero-banner.jpg: Place it in frontend/public/ and reference as '/hero-banner.jpg'
// Or import it: import heroBanner from '../assets/hero-banner.jpg' and use heroBanner
const HERO_SLIDES = [
  {
    image: '/hero-banner.jpg', // User's uploaded image - place in public/ folder
    title: 'Cloud-lit beauty, weightless finish',
    subtitle: 'Discover your radiance with our premium collection',
    cta: 'Shop Now',
    ctaLink: '/products',
  },
  {
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=800&fit=crop',
    title: 'Luxury skincare essentials',
    subtitle: 'Nourish your skin with cloud-soft formulas',
    cta: 'Explore Skin',
    ctaLink: '/products?category=Skincare',
  },
  {
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&h=800&fit=crop',
    title: 'Fragrance collection',
    subtitle: 'Captivating scents that linger like a dream',
    cta: 'Shop Fragrance',
    ctaLink: '/products?category=Fragrance',
  },
  {
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&h=800&fit=crop',
    title: 'Makeup essentials',
    subtitle: 'Flawless coverage, weightless feel',
    cta: 'Shop Cosmetics',
    ctaLink: '/products?category=Face',
  },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching products and categories...');
        
        // Fetch all products (up to 200) and categories
        const [productsRes, categoriesRes, featuredRes] = await Promise.all([
          productsApi.getProducts({ limit: 200 }),
          categoriesApi.getCategories(),
          productsApi.getProducts({ featured: true, limit: 20 }),
        ]);
        
        console.log('Products fetched:', productsRes.products.length);
        console.log('Categories fetched:', categoriesRes.length);
        console.log('Featured products:', featuredRes.products.length);
        
        setAllProducts(productsRes.products);
        setFeaturedProducts(featuredRes.products);
        setCategories(categoriesRes);

        // Group products by category
        const grouped: Record<string, Product[]> = {};
        productsRes.products.forEach((product) => {
          if (product.category) {
            const catName = product.category.name;
            if (!grouped[catName]) {
              grouped[catName] = [];
            }
            if (grouped[catName].length < 20) {
              grouped[catName].push(product);
            }
          }
        });
        setProductsByCategory(grouped);
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        setFeaturedProducts([]);
        setAllProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Loader />;
  }

  const currentSlideData = HERO_SLIDES[currentSlide];

  return (
    <div className={styles.home}>
      {/* Hero Carousel Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroCarousel}>
          {/* Brand Name - Centered near top */}
          <div className={styles.brandName}>
            <h1 className={styles.brandTitle}>AURAPOP</h1>
            <p className={styles.brandSubline}>Tori Edition</p>
          </div>

          {/* Carousel Slides */}
          <div className={styles.slidesContainer}>
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={index}
                className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Cloud Overlay */}
                <div className={styles.cloudOverlay}></div>
                
                {/* Content Overlay - Left Side */}
                {index === currentSlide && (
                  <div className={styles.slideContent}>
                    <h2 className={styles.slideTitle}>{slide.title}</h2>
                    <p className={styles.slideSubtitle}>{slide.subtitle}</p>
                    <Link to={slide.ctaLink} className={styles.slideButton}>
                      {slide.cta}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className={styles.carouselIndicators}>
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            className={styles.carouselArrow}
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className={`${styles.carouselArrow} ${styles.next}`}
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Cloud Divider */}
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

      {/* Cloud Divider */}
      <div className={styles.cloudDivider}></div>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className={styles.featuredSection}>
          <div className={styles.container}>
            <div className={styles.featuredHeader}>
              <h2 className={styles.sectionTitle}>Featured Products</h2>
              <p className={styles.featuredSubcopy}>
                Your cloud-curated edit—soft glam, luminous skin, and elevated essentials.
              </p>
            </div>
            <div className={styles.productsGrid}>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products by Category Sections */}
      {Object.entries(productsByCategory).map(([categoryName, products]) => (
        products.length > 0 && (
          <section key={categoryName} className={styles.categoryProductsSection}>
            <div className={styles.container}>
              <div className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>{categoryName}</h2>
                <a href={`/products?category=${categoryName}`} className={styles.viewAllLink}>
                  View All →
                </a>
              </div>
              <div className={styles.productsGrid}>
                {products.slice(0, 12).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
            <div className={styles.cloudDivider}></div>
          </section>
        )
      ))}

      {/* All Products Section */}
      {allProducts.length > 0 && (
        <section className={styles.allProductsSection}>
          <div className={styles.container}>
            <div className={styles.featuredHeader}>
              <h2 className={styles.sectionTitle}>Shop All Products</h2>
              <p className={styles.featuredSubcopy}>
                Discover our complete collection of cloud-luxury beauty essentials.
              </p>
            </div>
            <div className={styles.productsGrid}>
              {allProducts.slice(0, 24).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {allProducts.length > 24 && (
              <div className={styles.viewMoreContainer}>
                <a href="/products" className={styles.viewMoreButton}>
                  View All {allProducts.length} Products
                </a>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
