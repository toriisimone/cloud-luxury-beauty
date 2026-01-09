import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Product } from '../types/global';
import * as productsApi from '../api/productsApi';
import * as categoriesApi from '../api/categoriesApi';
import { Category } from '../types/global';
import styles from './Products.module.css';

// AMAZON API DISABLED: Always use database products
// import AmazonProductCard from '../components/AmazonProductCard';
// import { AmazonProduct } from '../api/amazonApi';
// import * as amazonApi from '../api/amazonApi';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  // AMAZON API DISABLED: Always use database products
  // const [amazonProducts, setAmazonProducts] = useState<AmazonProduct[]>([]);
  // const [isAmazonSource, setIsAmazonSource] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const categoryName = searchParams.get('category') || 'Shop All';
  const sortBy = searchParams.get('sort') || 'featured';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await categoriesApi.getCategories();
        setCategories(categoriesRes);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const categoryParam = searchParams.get('category');
        console.log('[FRONTEND] ========== FETCHING PRODUCTS ==========');
        console.log('[FRONTEND] Category param:', categoryParam);
        console.log('[FRONTEND] Categories loaded:', categories.length);
        
        // AMAZON API DISABLED: Always fetch from database for all categories including Skincare
        const search = searchParams.get('search');
        const featured = searchParams.get('featured');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const sort = searchParams.get('sort') || 'featured';

        // Find category by name if category param exists
        let categoryId: string | undefined;
        if (categoryParam) {
          // Try to find category in loaded categories first
          let category = categories.find(c => 
            c.name === categoryParam || 
            c.name.toLowerCase() === categoryParam.toLowerCase()
          );
          
          // If not found, fetch categories
          if (!category) {
            try {
              console.log('[FRONTEND] Category not in loaded list, fetching categories...');
              const categoriesRes = await categoriesApi.getCategories();
              setCategories(categoriesRes);
              category = categoriesRes.find(c => 
                c.name === categoryParam || 
                c.name.toLowerCase() === categoryParam.toLowerCase()
              );
            } catch (error: any) {
              console.error('[FRONTEND] Failed to fetch categories:', error);
            }
          }
          
          if (category) {
            categoryId = category.id;
          }
        }

        // Use category NAME parameter - backend will handle lookup and return database products
        console.log('[FRONTEND] Fetching products from database...');
        const params: productsApi.GetProductsParams = {
          category: categoryParam || undefined, // Use category name - backend will lookup
          categoryId: categoryId || undefined,
          search: search || undefined,
          featured: featured === 'true' ? true : undefined,
          page,
          limit: 48,
        };

        console.log('[FRONTEND] ========== FETCHING DATABASE PRODUCTS ==========');
        console.log('[FRONTEND] Params:', JSON.stringify(params, null, 2));
        console.log('[FRONTEND] Expected URL: https://cloud-luxury-backend-production.up.railway.app/api/products');
        if (categoryParam) {
          console.log('[FRONTEND] Expected URL with category: https://cloud-luxury-backend-production.up.railway.app/api/products?category=' + categoryParam);
        }
        
        const response = await productsApi.getProducts(params);
        
        console.log('[FRONTEND] ========== DATABASE PRODUCTS RESPONSE ==========');
        console.log('[FRONTEND] RAW RESPONSE:', JSON.stringify(response, null, 2));
        console.log('[FRONTEND] Response type:', typeof response);
        console.log('[FRONTEND] Response keys:', Object.keys(response || {}));
        console.log('[FRONTEND] Response.products type:', typeof response.products);
        console.log('[FRONTEND] Response.products is array:', Array.isArray(response.products));
        console.log('[FRONTEND] Response status: OK');
        console.log('[FRONTEND] Products returned:', response.products?.length || 0);
        console.log('[FRONTEND] Total:', response.total || 0);
        console.log('[FRONTEND] Page:', response.page || 0);
        console.log('[FRONTEND] Total pages:', response.totalPages || 0);
        
        // CRITICAL: Verify products array exists and is not empty
        if (!response.products) {
          console.error('[FRONTEND] ❌ ERROR: response.products is undefined or null!');
          console.error('[FRONTEND] Response structure:', response);
          setProducts([]);
          setTotalPages(1);
          setCurrentPage(1);
          setTotal(0);
          return;
        }
        
        if (!Array.isArray(response.products)) {
          console.error('[FRONTEND] ❌ ERROR: response.products is not an array!');
          console.error('[FRONTEND] Response.products type:', typeof response.products);
          console.error('[FRONTEND] Response.products value:', response.products);
          setProducts([]);
          setTotalPages(1);
          setCurrentPage(1);
          setTotal(0);
          return;
        }
        
        console.log('[FRONTEND] ✅ Products array verified: length =', response.products.length);
        console.log('[FRONTEND] First product:', response.products[0] ? {
          id: response.products[0].id,
          name: response.products[0].name,
          price: response.products[0].price,
          categoryId: response.products[0].categoryId,
          hasImage: !!response.products[0].images && response.products[0].images.length > 0,
        } : 'N/A');
        
        if (response.products.length > 0) {
          console.log('[FRONTEND] ✅✅✅ PRODUCTS FOUND: Will render', response.products.length, 'products ✅✅✅');
        } else {
          console.warn('[FRONTEND] ⚠️ WARNING: Products array is empty!');
        }
        console.log('[FRONTEND] ===============================================');
        
        // Sort products
        let sortedProducts = [...response.products];
        if (sort === 'price-low') {
          sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
          sortedProducts.sort((a, b) => b.price - a.price);
        } else if (sort === 'name-asc') {
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'name-desc') {
          sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        }
        // 'featured' and 'newest' use default order from API

        console.log('[FRONTEND] Setting products state:', sortedProducts.length, 'products');
        setProducts(sortedProducts);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.page || 1);
        setTotal(response.total || 0);
      } catch (error: any) {
        console.error('[FRONTEND] ❌ Failed to fetch products:', error);
        console.error('[FRONTEND] Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          fullURL: `${error.config?.baseURL}${error.config?.url}`,
        });
        setProducts([]);
      } finally {
        setLoading(false);
        console.log('[FRONTEND] ✅ Loading complete');
      }
    };

    fetchProducts();
  }, [searchParams, categories]);

  // Log rendering state for debugging
  console.log('[FRONTEND RENDER] ========== RENDERING PRODUCTS PAGE ==========');
  console.log('[FRONTEND RENDER] Loading:', loading);
  console.log('[FRONTEND RENDER] Products:', products.length);
  console.log('[FRONTEND RENDER] Categories:', categories.length);
  console.log('[FRONTEND RENDER] Total:', total);
  console.log('[FRONTEND RENDER] Page:', currentPage, 'of', totalPages);

  const handleFilterChange = (filterType: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      newParams.delete(filterType);
    } else {
      newParams.set(filterType, value);
    }
    newParams.set('page', '1'); // Reset to first page
    setSearchParams(newParams);
  };

  const handleSortChange = (sortValue: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sortValue);
    newParams.set('page', '1'); // Reset to first page
    setSearchParams(newParams);
    setSortOpen(false);
  };

  // Show loader ONLY when loading is true
  if (loading) {
    console.log('[FRONTEND RENDER] Showing loader...');
    return <Loader />;
  }

  // Determine if we have products to show - check both products array and total
  const hasProducts = Array.isArray(products) && products.length > 0;

  console.log('[FRONTEND RENDER] ========== RENDERING DECISION ==========');
  console.log('[FRONTEND RENDER] Loading:', loading);
  console.log('[FRONTEND RENDER] Products array:', products);
  console.log('[FRONTEND RENDER] Products is array:', Array.isArray(products));
  console.log('[FRONTEND RENDER] Products length:', products?.length || 0);
  console.log('[FRONTEND RENDER] Total:', total);
  console.log('[FRONTEND RENDER] Has products (will render):', hasProducts);
  console.log('[FRONTEND RENDER] ========================================');

  return (
    <div className={styles.products}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            {categoryName === 'Shop All' ? 'Shop All Products' : categoryName}
          </h1>
          <p className={styles.subtitle}>
            {total > 0 ? `${total} ${total === 1 ? 'product' : 'products'}` : 'No products found'}
          </p>
        </div>

        {/* Filter and Sort Bar */}
        {(categories.length > 0 || hasProducts) && (
          <div className={styles.controls}>
            <div className={styles.filterGroup}>
              <button
                className={`${styles.filterBtn} ${filterOpen ? styles.active : ''}`}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                Filter
              </button>
              {filterOpen && (
                <div className={styles.filterDropdown}>
                  <button
                    className={`${styles.filterOption} ${!searchParams.get('category') ? styles.active : ''}`}
                    onClick={() => handleFilterChange('category', 'all')}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`${styles.filterOption} ${searchParams.get('category') === category.name ? styles.active : ''}`}
                      onClick={() => handleFilterChange('category', category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.sortGroup}>
              <button
                className={`${styles.sortBtn} ${sortOpen ? styles.active : ''}`}
                onClick={() => setSortOpen(!sortOpen)}
              >
                Sort: {sortBy === 'featured' ? 'Featured' : sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : sortBy === 'name-asc' ? 'Name: A-Z' : sortBy === 'name-desc' ? 'Name: Z-A' : 'Newest'}
              </button>
              {sortOpen && (
                <div className={styles.sortDropdown}>
                  <button className={`${styles.sortOption} ${sortBy === 'featured' ? styles.active : ''}`} onClick={() => handleSortChange('featured')}>
                    Featured
                  </button>
                  <button className={`${styles.sortOption} ${sortBy === 'newest' ? styles.active : ''}`} onClick={() => handleSortChange('newest')}>
                    Newest
                  </button>
                  <button className={`${styles.sortOption} ${sortBy === 'price-low' ? styles.active : ''}`} onClick={() => handleSortChange('price-low')}>
                    Price: Low to High
                  </button>
                  <button className={`${styles.sortOption} ${sortBy === 'price-high' ? styles.active : ''}`} onClick={() => handleSortChange('price-high')}>
                    Price: High to Low
                  </button>
                  <button className={`${styles.sortOption} ${sortBy === 'name-asc' ? styles.active : ''}`} onClick={() => handleSortChange('name-asc')}>
                    Name: A-Z
                  </button>
                  <button className={`${styles.sortOption} ${sortBy === 'name-desc' ? styles.active : ''}`} onClick={() => handleSortChange('name-desc')}>
                    Name: Z-A
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Grid - Render products if they exist */}
        {hasProducts ? (
          <>
            <div className={styles.grid}>
              {products.map((product) => {
                console.log('[FRONTEND RENDER] Rendering product:', product.id, product.name);
                return (
                  <ProductCard key={product.id} product={product} />
                );
              })}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
              <p>Showing {products.length} of {total} products</p>
            </div>
            
            {totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('page', page.toString());
                      setSearchParams(newParams);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>No products found.</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              {total === 0 ? 'The database appears to be empty.' : `Expected ${total} products but none were returned.`}
            </p>
            <button onClick={() => navigate('/')} className={styles.backBtn}>
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
