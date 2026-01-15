import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { getCategoryStructure, TopCategory, getProductsByCategory, loadAllProducts, Product } from '../data/productData';
import styles from './Navbar.module.css';
import megaMenuStyles from './MegaMenu.module.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<TopCategory | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load products on mount
  useEffect(() => {
    const loadProducts = async () => {
      const products = await loadAllProducts();
      setAllProducts(products);
    };
    loadProducts();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Helper function to capitalize first letter of each word
  const capitalizeWords = (str: string): string => {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Get menu items from category structure
  const categories = getCategoryStructure();
  const menuItems = categories.map(cat => ({
    name: cat.topCategory,
    displayName: capitalizeWords(cat.topCategory),
    href: `/category/${cat.topCategory.toLowerCase().replace(/\s+/g, '-')}`,
    category: cat.topCategory
  }));

  // Helper functions for mega menu
  const getCategoryImagePath = (category: TopCategory, subCategory?: string): string => {
    if (subCategory) {
      const topSlug = category.toLowerCase().replace(/\s+/g, '-');
      const subSlug = subCategory.toLowerCase().replace(/\s+/g, '-');
      return `/assets/images/menu/${topSlug}/${subSlug}.jpg`;
    }
    return `/assets/images/menu/${category.toLowerCase().replace(/\s+/g, '-')}/tile.jpg`;
  };

  const getBannerImagePath = (category: TopCategory): string => {
    return `/assets/images/menu/${category.toLowerCase().replace(/\s+/g, '-')}/banner.jpg`;
  };

  const getCategoryUrl = (category: TopCategory): string => {
    return `/category/${category.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const getSubCategoryUrl = (topCategory: TopCategory, subCategory: string): string => {
    const topSlug = topCategory.toLowerCase().replace(/\s+/g, '-');
    const subSlug = subCategory.toLowerCase().replace(/\s+/g, '-');
    return `/category/${topSlug}/${subSlug}`;
  };

  const getSubCategoryProducts = (topCategory: TopCategory, subCategory: string, limit: number = 4): Product[] => {
    const products = getProductsByCategory(allProducts, topCategory, subCategory);
    return products.slice(0, limit);
  };

  const categoryNames: Record<TopCategory, string> = {
    'Skincare': 'Skincare',
    'Makeup': 'Makeup',
    'Hair': 'Hair',
    'Fragrance': 'Fragrance',
    'Body': 'Body'
  };

  return (
    <>
      {/* Main Header */}
      <header className={styles.siteHeader}>
        <div className={styles.siteHeaderWrapper}>
          {/* Top Banner - Logo, Shipping, Icons */}
          <div className={styles.siteHeaderAnnouncement}>
            {/* Shipping to US - Left */}
            <form className={styles.localizationForm} method="post" action="/localization" id="localization_form" acceptCharset="UTF-8" encType="multipart/form-data">
              <input type="hidden" name="form_type" value="localization" />
              <input type="hidden" name="utf8" value="✓" />
              <input type="hidden" name="_method" value="put" />
              <input type="hidden" name="return_to" value="/" />
              <label htmlFor="LocalizationForm-Select" className={styles.localizationLabel}>Shipping to:</label>
              <div className={styles.countryPicker} tabIndex={0}>
                <span className={styles.countryPickerCurrent}>
                  US <span className={styles.countryPickerSymbol}>$</span>
                </span>
                <select 
                  id="LocalizationForm-Select" 
                  name="country_code" 
                  className={styles.countryPickerSelect}
                  defaultValue="US"
                >
                  <option value="US">united states  (USD $)</option>
                  <option value="CA">canada  (CAD $)</option>
                  <option value="GB">united kingdom  (GBP £)</option>
                  <option value="AU">australia  (AUD $)</option>
                  <option value="DE">germany german (EUR €)</option>
                  <option value="FR">france  (EUR €)</option>
                  <option value="IT">italy  (EUR €)</option>
                  <option value="ES">spain  (EUR €)</option>
                  <option value="NL">netherlands  (EUR €)</option>
                  <option value="BE">belgium  (EUR €)</option>
                  <option value="AT">austria  (EUR €)</option>
                  <option value="CH">switzerland  (CHF CHF)</option>
                  <option value="SE">sweden  (SEK kr)</option>
                  <option value="NO">norway  (NOK kr)</option>
                  <option value="DK">denmark  (DKK kr.)</option>
                  <option value="FI">finland  (EUR €)</option>
                  <option value="PL">poland  (PLN zł)</option>
                  <option value="CZ">czechia  (CZK Kč)</option>
                  <option value="IE">ireland  (EUR €)</option>
                  <option value="PT">portugal  (EUR €)</option>
                  <option value="GR">greece  (EUR €)</option>
                  <option value="MX">mexico  (MXN $)</option>
                  <option value="BR">brazil  (BRL R$)</option>
                  <option value="JP">japan  (JPY ¥)</option>
                  <option value="KR">south korea  (KRW ₩)</option>
                  <option value="CN">china  (CNY ¥)</option>
                  <option value="IN">india  (INR ₹)</option>
                  <option value="AE">united arab emirates  (AED د.إ)</option>
                  <option value="SA">saudi arabia  (SAR ر.س)</option>
                  <option value="IL">israel  (ILS ₪)</option>
                  <option value="SG">singapore  (SGD $)</option>
                  <option value="NZ">new zealand  (NZD $)</option>
                </select>
          </div>
            </form>

            {/* Logo - Center */}
            <div className={styles.siteHeaderLogo}>
              <h1 className={styles.siteLogo}>
                <Link to="/" rel="follow" title="AURAPOP home page">
                  AURAPOP
                </Link>
              </h1>
      </div>

            {/* Desktop Utilities - Icons Right */}
            <div className={`${styles.siteHeaderUtilities} ${styles.siteHeaderUtilitiesDesktop}`}>
              {/* Search */}
              <Link
                to="/search"
                className={`${styles.siteHeaderAction} ${styles.siteHeaderActionSearch}`}
                title="Search"
                rel="nofollow"
                role="button"
              >
                <svg width="20" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M17 17l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
          </Link>
              {/* Account */}
              <Link
                to="/account"
                className={`${styles.siteHeaderAction} ${styles.siteHeaderActionAccount}`}
                aria-label="Account Login"
                title="Account"
                rel="nofollow"
              >
                <svg width="20" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M6 20c0-3.33 2.67-6 6-6s6 2.67 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </Link>
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className={`${styles.siteHeaderAction} ${styles.siteHeaderActionWishlist}`}
                aria-label="Product Added in Wishlist"
                title="Wishlist"
                rel="nofollow"
              >
                <svg width="21" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              </Link>
              {/* Cart */}
              <Link
                to="/cart"
                className={`${styles.siteHeaderAction} ${styles.siteHeaderActionCart}`}
                title="cart"
                rel="nofollow"
                role="button"
                data-cart-count={getItemCount()}
                aria-label={`${getItemCount()} items in cart`}
              >
                <svg width="21" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L4 20H20L18 9H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M4 9H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 9C6 8 6.5 7 7.5 7C8.5 7 9 8 9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M15 9C15 8 15.5 7 16.5 7C17.5 7 18 8 18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              {getItemCount() > 0 && (
                <span className={styles.cartBadge}>{getItemCount()}</span>
              )}
                <span className={styles.visuallyHidden}>Cart with {getItemCount()} items</span>
            </Link>
            </div>
            
            {/* Mobile Menu Toggle */}
            <div className={`${styles.siteHeaderUtilities} ${styles.siteHeaderUtilitiesMenu}`}>
              <Link
                to="/collections"
                className={`${styles.siteHeaderAction} ${styles.siteHeaderActionMenu}`}
                title="Main Menu"
                role="button"
                aria-haspopup="true"
                aria-expanded={mobileMenuOpen}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Second Row - Navigation Menu */}
          <div className={styles.siteHeaderMain}>
            <nav className={styles.siteHeaderNav}>
              <div className={styles.siteHeaderMenuDesktop}>
                <div id="shopify-section-header-menu--desktop" className={styles.shopifySection}>
                  <nav 
                    id="Linklist-main-menu" 
                    className={`${styles.linklist} ${styles.linklistMainMenu} ${styles.linklistDesktop}`}
                    aria-label="Main [Desktop]"
                    data-handle="main-menu"
                    data-levels="3"
                    data-title="Main [Desktop]"
                  >
                    <ul className={`${styles.linklistLinks} ${styles.linklistLinksLevel1}`}>
                      {menuItems.map((item) => {
                        const categoryData = categories.find(cat => cat.topCategory === item.category);
                        const hasChildren = categoryData ? categoryData.subCategories.length > 0 : false;
                        const isFragrance = item.category === 'Fragrance';
                        const isHovered = megaMenuOpen && hoveredCategory === item.category;
                        
                        return (
                          <li
                            key={item.name}
                            className={`${styles.link} ${hasChildren ? styles.linkHasChildren : ''} ${hasChildren ? styles.linkHasMegaMenu : ''} ${styles.linkLevel1} ${styles.linkCollectionLink} ${isFragrance ? styles.linkSparkles : ''}`}
                            data-level="1"
                            data-levels={hasChildren ? "2" : "1"}
                            data-title={item.name}
                            data-type="collection_link"
                            data-url={item.href}
                            onMouseEnter={() => {
                              if (closeTimeoutRef.current) {
                                clearTimeout(closeTimeoutRef.current);
                                closeTimeoutRef.current = null;
                              }
                              setHoveredCategory(item.category);
                              setMegaMenuOpen(true);
                            }}
                            onMouseLeave={() => {
                              closeTimeoutRef.current = setTimeout(() => {
                                setHoveredCategory(null);
                                setMegaMenuOpen(false);
                              }, 200);
                            }}
                          >
                            <Link
                              to={item.href}
                              rel="follow"
                              className={`${styles.linkAnchor} ${styles.linkAnchorLevel1} ${isFragrance ? styles.linkAnchorSparkles : ''}`}
                              role="button"
                              aria-haspopup={hasChildren ? "true" : undefined}
                              aria-expanded={isHovered ? "true" : "false"}
                            >
                              {isFragrance && (
                                <div className={styles.linkSparkleTop}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none">
                                    <path fill="currentColor" fillRule="evenodd" d="M6.512.563A.527.527 0 0 1 7.26.047a.53.53 0 0 1 .308.52c-.009 1.466-.008 2.529.08 3.314.088.792.257 1.22.515 1.479.26.26.686.434 1.479.534.788.098 1.857.116 3.334.13a.527.527 0 0 1 .37.897.528.528 0 0 1-.373.154h-.002c-1.477-.009-2.547-.008-3.337.08-.793.088-1.22.257-1.48.516-.262.26-.436.687-.536 1.478-.098.785-.116 1.85-.13 3.32a.523.523 0 0 1-.537.53.527.527 0 0 1-.52-.525v-.002c.008-1.475.008-2.543-.08-3.331-.088-.793-.257-1.22-.516-1.479-.26-.261-.689-.435-1.48-.535-.789-.1-1.858-.116-3.334-.13h-.004a.527.527 0 0 1 .01-1.054h.002c1.477.01 2.547.009 3.337-.079.793-.088 1.22-.256 1.481-.514.261-.259.435-.685.535-1.477.098-.784.116-1.846.13-3.31Zm.446 12.049.006-.135v-.002h-.005v.137Zm0-.137h.006l.01-.251h-.016v.25Zm.03-4.996c.11-.207.245-.39.409-.553.165-.164.352-.296.561-.405a2.294 2.294 0 0 1-.554-.41 2.296 2.296 0 0 1-.403-.559c-.111.207-.246.392-.412.555a2.296 2.296 0 0 1-.56.403c.208.11.393.246.556.411.163.165.295.35.403.558Z" clipRule="evenodd"></path>
                                  </svg>
                                </div>
                              )}
                              {item.displayName}
                            </Link>
                            
                            {/* Nested Mega Menu - Kylie's Structure */}
                            {hasChildren && categoryData && (
                              <div 
                                className={`${megaMenuStyles.megaMenu} ${isHovered ? megaMenuStyles.open : ''}`}
                                onMouseEnter={() => {
                                  if (closeTimeoutRef.current) {
                                    clearTimeout(closeTimeoutRef.current);
                                    closeTimeoutRef.current = null;
                                  }
                                }}
                                onMouseLeave={() => {
                                  closeTimeoutRef.current = setTimeout(() => {
                                    setHoveredCategory(null);
                                    setMegaMenuOpen(false);
                                  }, 200);
                                }}
                              >
                                <div className={megaMenuStyles.megaMenuWrapper}>
                                  <div className={megaMenuStyles.megaMenuGrid}>
                                    <div className={megaMenuStyles.megaMenuMain}>
                                      {/* Dropdown Header Image - Place your image here */}
                                      <div className={megaMenuStyles.megaMenuHeaderImageContainer}>
                                        <img 
                                          src={`/assets/images/menu/${item.category.toLowerCase().replace(/\s+/g, '-')}/header.jpg`}
                                          alt={`${item.category} Header`}
                                          className={megaMenuStyles.megaMenuHeaderImage}
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                          }}
                                        />
                                      </div>
                                      
                                      {/* Shop All Link - Only for non-Fragrance categories */}
                                      {!isFragrance && (
                                        <div className={megaMenuStyles.megaMenuShopAll}>
                                          <Link
                                            to={getCategoryUrl(item.category as TopCategory)}
                                            className={megaMenuStyles.megaMenuShopAllLink}
                                            onClick={() => setMegaMenuOpen(false)}
                                            rel="follow"
                                          >
                                            Shop All {item.category}
                                          </Link>
                                        </div>
                                      )}
                                      <div className={megaMenuStyles.megaMenuImageMenuBlocks}>
                                        {(categoryData.imageMenuBlocks || []).map((imageMenuBlock: string) => {
                                          const formatTitle = (title: string): string => {
                                            if (item.category === 'Makeup') {
                                              if (title === 'Complexion/Face') {
                                                return 'Face';
                                              }
                                              if (title === 'Eyes & Brows') {
                                                return 'Eyes & Brows';
                                              }
                                              if (title === 'Best Sellers') {
                                                return 'Best Sellers ';
                                              }
                                            }
                                            if (isFragrance && title.includes(' ')) {
                                              const parts = title.split(' ');
                                              if (parts.length > 1) {
                                                return `${parts[0]} <br>${parts.slice(1).join(' ')}`;
                                              }
                                            }
                                            return title;
                                          };
                                          
                                          const formattedTitle = formatTitle(imageMenuBlock);
                                          
                                          return (
                                            <div key={imageMenuBlock} className={megaMenuStyles.imageMenuBlock}>
                                              <Link
                                                to={getSubCategoryUrl(item.category as TopCategory, imageMenuBlock)}
                                                className={megaMenuStyles.imageMenuBlockTitleLink}
                                                onClick={() => setMegaMenuOpen(false)}
                                                rel="follow"
                                                data-level="2"
                                                data-track-title={formattedTitle.replace(/<br>/g, ' ')}
                                                data-parent-title={imageMenuBlock}
                                                data-grand-title={item.category}
                                              >
                                                <div 
                                                  className={megaMenuStyles.responsiveImage}
                                                  style={{
                                                    '--aspect-ratio': '100.0%',
                                                    '--max-height': '200px',
                                                    '--max-width': '200px',
                                                    '--object-fit': 'cover',
                                                    '--object-position': 'center'
                                                  } as React.CSSProperties}
                                                  tabIndex={0}
                                                >
                                                  <img
                                                    src={getCategoryImagePath(item.category as TopCategory, imageMenuBlock)}
                                                    alt={imageMenuBlock}
                                                    className={`${megaMenuStyles.responsiveImageImage} ${megaMenuStyles.imageMenuBlockImage} lazyautosizes lazyloaded`}
                                                    loading="lazy"
                                                    data-src={getCategoryImagePath(item.category as TopCategory, imageMenuBlock)}
                                                    data-widths="[200,200]"
                                                    data-aspectratio="1.0"
                                                    data-sizes="auto"
                                                    width="200"
                                                    height="200"
                                                    tabIndex={-1}
                                                    style={{ width: '100%', height: '100%' }}
                                                    sizes="104px"
                                                    onError={(e) => {
                                                      const target = e.target as HTMLImageElement;
                                                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f5f5f5"/%3E%3C/svg%3E';
                                                    }}
                                                  />
                                                </div>
                                                <h2 
                                                  className={megaMenuStyles.imageMenuBlockTitle}
                                                  dangerouslySetInnerHTML={{ __html: formattedTitle }}
                                                />
                                              </Link>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      <div className={megaMenuStyles.megaMenuButtons}></div>
                                      <div className={megaMenuStyles.megaMenuSecondaryLinksBlocks}></div>
                                    </div>
                                    <div className={megaMenuStyles.megaMenuAside}>
                                      <div className={megaMenuStyles.bannerBlock}>
                                        <Link
                                          to={getCategoryUrl(item.category as TopCategory)}
                                          className={megaMenuStyles.bannerBlockLink}
                                          onClick={() => setMegaMenuOpen(false)}
                                          rel="follow"
                                        >
                                          <div 
                                            className={megaMenuStyles.bannerResponsiveImage}
                                            style={{
                                              '--aspect-ratio': '108.19672131147541%',
                                              '--max-height': '660px',
                                              '--max-width': '610px',
                                              '--object-fit': 'cover',
                                              '--object-position': 'center'
                                            } as React.CSSProperties}
                                            tabIndex={0}
                                          >
                                            <img
                                              src={getBannerImagePath(item.category as TopCategory)}
                                              alt={categoryNames[item.category as TopCategory]}
                                              className={`${megaMenuStyles.responsiveImageImage} ${megaMenuStyles.bannerBlockImage}`}
                                              loading="eager"
                                              fetchPriority="high"
                                              width="610"
                                              height="660"
                                              tabIndex={-1}
                                              style={{ width: '100%', height: '100%' }}
                                              onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="610" height="660"%3E%3Crect width="610" height="660" fill="%23f5f5f5"/%3E%3C/svg%3E';
                                              }}
                                            />
                                          </div>
                                          <div className={megaMenuStyles.bannerBlockTitle}>
                                            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                                            {(() => {
                                              const bannerTitles: Record<TopCategory, string> = {
                                                'Skincare': categoryNames['Skincare'].toLowerCase(),
                                                'Makeup': 'best sellers',
                                                'Hair': categoryNames['Hair'].toLowerCase(),
                                                'Fragrance': 'new <br>hair &amp; body mists',
                                                'Body': categoryNames['Body'].toLowerCase()
                                              };
                                              
                                              const bannerTitle = bannerTitles[item.category as TopCategory];
                                              
                                              if (isFragrance || bannerTitle.includes('<br>')) {
                                                return (
                                                  <span style={{ color: '#B3848F' }} dangerouslySetInnerHTML={{ __html: bannerTitle }} />
                                                );
                                              } else {
                                                return (
                                                  <span style={{ color: '#B3848F' }}>
                                                    {bannerTitle}
                                                  </span>
                                                );
                                              }
                                            })()}
                                          </div>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                  {/* Schema.org JSON-LD for Navigation */}
                  <script type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify(menuItems.map(item => ({
                      "@context": "http://schema.org",
                      "@type": "siteNavigationElement",
                      "name": item.name,
                      "url": typeof window !== 'undefined' ? `${window.location.origin}${item.href}` : item.href
                    })))
                  }} />
          </div>
        </div>
      </nav>
          </div>
        </div>

        
        {/* Mini Cart Section */}
        <div id="shopify-section-mini-cart" className={styles.shopifySection}>
          <div className={styles.flyoutOverlay} style={{ display: 'none' }}></div>
        </div>
        
        {/* Live Helper Component */}
        <fw-live-helper className="needsclick"></fw-live-helper>
      </header>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {menuItems.map((item) => (
            <div key={item.name} className={styles.mobileMenuItem}>
              <Link 
                to={item.href} 
                className={styles.mobileMenuLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name.toLowerCase()}
              </Link>
            </div>
          ))}
        </div>
      )}

    </>
  );
};

export default Navbar;
