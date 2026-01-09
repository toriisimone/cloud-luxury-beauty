import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Product } from '../types/global';
import * as productsApi from '../api/productsApi';
import styles from './Products.module.css';

const Skincare = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkincareProducts = async () => {
      try {
        console.log('[SKINCARE PAGE] ========== FETCHING PRODUCTS ==========');
        console.log('[SKINCARE PAGE] Backend URL: https://cloud-luxury-backend-production.up.railway.app/api/products?category=Skincare');
        setLoading(true);
        setError(null);

        const response = await productsApi.getProducts({
          category: 'Skincare',
          limit: 100, // Get all products
        });

        console.log('[SKINCARE PAGE] ========== RAW RESPONSE ==========');
        console.log('[SKINCARE PAGE] Full response:', JSON.stringify(response, null, 2));
        console.log('[SKINCARE PAGE] Response type:', typeof response);
        console.log('[SKINCARE PAGE] Response keys:', Object.keys(response || {}));
        console.log('[SKINCARE PAGE] Products array:', response.products);
        console.log('[SKINCARE PAGE] Products is array:', Array.isArray(response.products));
        console.log('[SKINCARE PAGE] Products length:', response.products?.length || 0);
        console.log('[SKINCARE PAGE] Total:', response.total || 0);
        console.log('[SKINCARE PAGE] ========================================');

        if (!response || !response.products) {
          console.error('[SKINCARE PAGE] ❌ ERROR: Response or products is missing!');
          console.error('[SKINCARE PAGE] Response:', response);
          setError('Failed to load products: Invalid response structure');
          setProducts([]);
          return;
        }

        if (!Array.isArray(response.products)) {
          console.error('[SKINCARE PAGE] ❌ ERROR: Products is not an array!');
          console.error('[SKINCARE PAGE] Products type:', typeof response.products);
          console.error('[SKINCARE PAGE] Products value:', response.products);
          setError('Failed to load products: Products is not an array');
          setProducts([]);
          return;
        }

        console.log('[SKINCARE PAGE] ✅ SUCCESS: Products array verified');
        console.log('[SKINCARE PAGE] Setting products:', response.products.length, 'products');
        
        if (response.products.length > 0) {
          console.log('[SKINCARE PAGE] ✅✅✅ WILL RENDER', response.products.length, 'PRODUCTS ✅✅✅');
          console.log('[SKINCARE PAGE] First product:', {
            id: response.products[0].id,
            name: response.products[0].name,
            price: response.products[0].price,
            hasImage: !!response.products[0].images && response.products[0].images.length > 0,
          });
        } else {
          console.warn('[SKINCARE PAGE] ⚠️ WARNING: Products array is empty!');
        }

        setProducts(response.products);
      } catch (err: any) {
        console.error('[SKINCARE PAGE] ❌ ERROR FETCHING PRODUCTS:', err);
        console.error('[SKINCARE PAGE] Error message:', err.message);
        console.error('[SKINCARE PAGE] Error response:', err.response?.data);
        console.error('[SKINCARE PAGE] Error status:', err.response?.status);
        setError(`Failed to load products: ${err.message || 'Unknown error'}`);
        setProducts([]);
      } finally {
        setLoading(false);
        console.log('[SKINCARE PAGE] ✅ Loading complete');
      }
    };

    fetchSkincareProducts();
  }, []);

  console.log('[SKINCARE PAGE RENDER] ========== RENDERING ==========');
  console.log('[SKINCARE PAGE RENDER] Loading:', loading);
  console.log('[SKINCARE PAGE RENDER] Error:', error);
  console.log('[SKINCARE PAGE RENDER] Products:', products.length);
  console.log('[SKINCARE PAGE RENDER] Will render products:', products.length > 0);
  console.log('[SKINCARE PAGE RENDER] ===============================');

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={styles.products}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Skincare</h1>
            <p className={styles.subtitle}>Error loading products</p>
          </div>
          <div className={styles.emptyState}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className={styles.backBtn}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.products}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Skincare</h1>
          <p className={styles.subtitle}>
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <div className={styles.grid}>
              {products.map((product) => {
                console.log('[SKINCARE PAGE RENDER] Rendering product:', product.id, product.name);
                return (
                  <ProductCard key={product.id} product={product} />
                );
              })}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
              <p>Showing {products.length} products</p>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>No products found in Skincare category.</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              Please check back later or try refreshing the page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Skincare;
