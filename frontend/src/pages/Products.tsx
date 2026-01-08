import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import AmazonProductCard from '../components/AmazonProductCard';
import Loader from '../components/Loader';
import { Product } from '../types/global';
import { AmazonProduct } from '../api/amazonApi';
import * as productsApi from '../api/productsApi';
import * as amazonApi from '../api/amazonApi';
import * as categoriesApi from '../api/categoriesApi';
import { Category } from '../types/global';
import styles from './Products.module.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [amazonProducts, setAmazonProducts] = useState<AmazonProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [isAmazonSource, setIsAmazonSource] = useState(false);

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
        console.log('Category param:', categoryParam);
        console.log('Categories loaded:', categories.length);
        
        // If Skincare category, try Amazon API first, then fallback to regular products
        if (categoryParam && categoryParam.toLowerCase() === 'skincare') {
          let amazonSuccess = false;
          
          // Try Amazon API first
          try {
            console.log('[FRONTEND] Fetching Amazon skincare products...');
            const amazonResponse = await amazonApi.getAmazonSkincareProducts();
            console.log('[FRONTEND] Amazon API response received:', {
              productCount: amazonResponse.products?.length || 0,
              totalCount: amazonResponse.count || 0,
              source: amazonResponse.source,
              hasError: !!amazonResponse.error,
              error: amazonResponse.error,
            });
            
            if (amazonResponse.products && amazonResponse.products.length > 0) {
              console.log('[FRONTEND] Amazon products found, displaying them');
              let sortedProducts = [...amazonResponse.products];
              
              // Sort Amazon products
              const sort = searchParams.get('sort') || 'featured';
              if (sort === 'price-low') {
                sortedProducts.sort((a, b) => a.price - b.price);
              } else if (sort === 'price-high') {
                sortedProducts.sort((a, b) => b.price - a.price);
              } else if (sort === 'name-asc') {
                sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
              } else if (sort === 'name-desc') {
                sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
              }
              
              setAmazonProducts(sortedProducts);
              setProducts([]);
              setIsAmazonSource(true);
              setTotal(sortedProducts.length);
              setTotalPages(1);
              setCurrentPage(1);
              console.log('[FRONTEND] Amazon products set:', sortedProducts.length);
              amazonSuccess = true;
            } else {
              console.warn('[FRONTEND] Amazon API returned empty products array');
            }
          } catch (error: any) {
            console.error('[FRONTEND] Failed to fetch Amazon products:', error);
            console.error('[FRONTEND] Error details:', {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status,
            });
          }
          
          // If Amazon failed or returned empty, fetch regular products
          if (!amazonSuccess) {
            console.log('Falling back to regular skincare products...');
            setIsAmazonSource(false);
            
            // Wait for categories to load if not already loaded
            let skincareCategory = categories.find(c => c.name === 'Skincare' || c.name === 'skincare');
            
            // If categories not loaded yet, fetch them
            if (!skincareCategory && categories.length === 0) {
              try {
                const categoriesRes = await categoriesApi.getCategories();
                setCategories(categoriesRes);
                skincareCategory = categoriesRes.find(c => c.name === 'Skincare' || c.name === 'skincare');
              } catch (error) {
                console.error('Failed to fetch categories:', error);
              }
            }
            
            const search = searchParams.get('search');
            const featured = searchParams.get('featured');
            const page = parseInt(searchParams.get('page') || '1', 10);
            const sort = searchParams.get('sort') || 'featured';

            const params: productsApi.GetProductsParams = {
              categoryId: skincareCategory?.id || undefined,
              search: search || undefined,
              featured: featured === 'true' ? true : undefined,
              page,
              limit: 48,
            };

            const response = await productsApi.getProducts(params);
            console.log('Regular products fetched:', response.products.length);
            
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

            setProducts(sortedProducts);
            setAmazonProducts([]);
            setTotalPages(response.totalPages);
            setCurrentPage(response.page);
            setTotal(response.total);
          }
        } else {
          // Regular product fetching for other categories
          setIsAmazonSource(false);
          const search = searchParams.get('search');
          const featured = searchParams.get('featured');
          const page = parseInt(searchParams.get('page') || '1', 10);
          const sort = searchParams.get('sort') || 'featured';

          // Find category by name if category param exists
          let categoryId: string | undefined;
          if (categoryParam) {
            const category = categories.find(c => c.name === categoryParam);
            if (category) {
              categoryId = category.id;
            }
          }

          const params: productsApi.GetProductsParams = {
            categoryId: categoryId || undefined,
            search: search || undefined,
            featured: featured === 'true' ? true : undefined,
            page,
            limit: 48, // Glossier shows many products per page
          };

          const response = await productsApi.getProducts(params);
          
          // Sort products based on sort parameter
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

          setProducts(sortedProducts);
          setAmazonProducts([]);
          setTotalPages(response.totalPages);
          setCurrentPage(response.page);
          setTotal(response.total);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch products if categories are loaded (for Skincare fallback) or if not Skincare category
    if (categories.length > 0 || !searchParams.get('category') || searchParams.get('category')?.toLowerCase() !== 'skincare') {
      fetchProducts();
    }
  }, [searchParams, categories]);

  const handleSortChange = (sortValue: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sortValue);
    newParams.set('page', '1'); // Reset to first page
    setSearchParams(newParams);
    setSortOpen(false);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(filterType, value);
    } else {
      newParams.delete(filterType);
    }
    newParams.set('page', '1'); // Reset to first page
    setSearchParams(newParams);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'featured': return 'Featured';
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      case 'name-asc': return 'Name: A to Z';
      case 'name-desc': return 'Name: Z to A';
      case 'newest': return 'Newest';
      default: return 'Featured';
    }
  };

  const activeFiltersCount = Array.from(searchParams.entries()).filter(
    ([key]) => key !== 'category' && key !== 'page' && key !== 'sort'
  ).length;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.products}>
      <div className={styles.container}>
        {/* Category Title */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            {categoryName === 'Shop All' ? 'Shop All' : categoryName}
          </h1>
          {total > 0 && (
            <p className={styles.count}>
              {total} {total === 1 ? 'product' : 'products'}
            </p>
          )}
        </div>

        {/* Filter + Sort Bar - Right Side (Glossier style) */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarRight}>
            <button
              className={styles.filterButton}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            
            <div className={styles.sortContainer}>
              <button
                className={styles.sortButton}
                onClick={() => setSortOpen(!sortOpen)}
              >
                Sort ({getSortLabel()})
              </button>
              {sortOpen && (
                <div className={styles.sortDropdown}>
                  <button onClick={() => handleSortChange('featured')}>
                    Featured
                  </button>
                  <button onClick={() => handleSortChange('newest')}>
                    Newest
                  </button>
                  <button onClick={() => handleSortChange('price-low')}>
                    Price: Low to High
                  </button>
                  <button onClick={() => handleSortChange('price-high')}>
                    Price: High to Low
                  </button>
                  <button onClick={() => handleSortChange('name-asc')}>
                    Name: A to Z
                  </button>
                  <button onClick={() => handleSortChange('name-desc')}>
                    Name: Z to A
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className={styles.filterPanel}>
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Category</h3>
              <div className={styles.filterOptions}>
                <button
                  className={`${styles.filterOption} ${!searchParams.get('category') ? styles.active : ''}`}
                  onClick={() => handleFilterChange('category', '')}
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
            </div>
          </div>
        )}

        {/* Products Grid */}
        {isAmazonSource && amazonProducts.length > 0 ? (
          <div className={styles.grid}>
            {amazonProducts.map((product) => (
              <AmazonProductCard key={product.asin} product={product} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
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
          <p className={styles.empty}>No products found.</p>
        )}
      </div>

      {/* Cloud Divider */}
      <div className={styles.cloudDivider}></div>
    </div>
  );
};

export default Products;
