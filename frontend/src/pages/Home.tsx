import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Loader from '../components/Loader';
import { Product, Category } from '../types/global';
import * as productsApi from '../api/productsApi';
import * as categoriesApi from '../api/categoriesApi';
import styles from './Home.module.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.home}>
      {/* Hero Banner Section - Single Image */}
      <section className={styles.heroSection}>
        <div 
          className={styles.heroBanner}
          style={{ backgroundImage: `url('/images/hero-banner.jpg')` }}
        >
          {/* Cloud Overlay */}
          <div className={styles.cloudOverlay}></div>
          
          {/* Brand Name Overlay */}
          <div className={styles.brandName}>
            <h1 className={styles.brandTitle}>AURAPOP</h1>
            <p className={styles.brandSubline}>Tori Edition</p>
          </div>
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
                <Link to={`/products?category=${categoryName}`} className={styles.viewAllLink}>
                  View All →
                </Link>
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
                <Link to="/products" className={styles.viewMoreButton}>
                  View All {allProducts.length} Products
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
