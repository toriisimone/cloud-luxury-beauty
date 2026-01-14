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

  // Get menu items from category structure
  const categories = getCategoryStructure();
  const menuItems = categories.map(cat => ({
    name: cat.topCategory,
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
      {/* Main Header - Kylie's Exact Structure */}
      <header className={styles.siteHeader}>
        <div className={styles.siteHeaderWrapper}>
          {/* Announcement Bar */}
          <div className={styles.siteHeaderAnnouncement}>
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
          </div>

          {/* Main Header Row */}
          <div className={styles.siteHeaderMain}>
            {/* Logo */}
            <div className={styles.siteHeaderLogo}>
              <h1 className={styles.siteLogo}>
                <Link to="/" rel="follow" title="AURAPOP home page">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 194 51" role="img" aria-labelledby="AURAPOP Logo">
                    <title id="svgTitle">AURAPOP Homepage</title>
                    <path fill="currentColor" d="M50.427 35.174v4.015l3.23-4.015h1.316l-3.336 4.13 3.524 5.02h-1.496l-3.247-4.775v4.775H49.25v-9.15h1.178ZM58.718 35.174l1.8 4.424 1.84-4.424h1.193l-2.51 5.479v3.671h-1.153V40.62l-2.47-5.454h1.308l-.008.008ZM67.893 35.174v8.136h3.344v1.014h-4.513v-9.15h1.169ZM75.71 35.174v9.15h-1.177v-9.15h1.178ZM84.657 35.174v1.014h-3.55v2.944h3.296v1.006h-3.295v3.18h3.639v1.014h-4.808v-9.15h4.718v-.008ZM97.332 35.174v6.812c0 1.61-.81 2.518-2.47 2.518-1.512 0-2.346-.826-2.346-2.6 0-.188 0-.303.008-.442h1.218c-.008.09-.008.213-.008.352 0 .769.074 1.7 1.145 1.7.875 0 1.292-.645 1.292-1.733v-6.607h1.17-.009ZM106.253 35.174v1.014h-3.548v2.944H106v1.006h-3.295v3.18h3.638v1.014h-4.808v-9.15h4.718v-.008ZM111.609 35.174l3.598 7.834v-7.834h1.039v9.15h-1.586l-3.639-7.932v7.932h-1.055v-9.15h1.643ZM122.101 35.174l3.598 7.834v-7.834h1.038v9.15h-1.586l-3.639-7.932v7.932h-1.055v-9.15h1.644ZM135.61 35.174v1.014h-3.549v2.944h3.295v1.006h-3.295v3.18h3.639v1.014h-4.808v-9.15h4.718v-.008ZM142.479 35.174c1.194 0 2.142.785 2.142 2.273 0 1.129-.605 1.914-1.676 2.118.989.164 1.472.622 1.496 2.355.017.85.115 1.62.303 2.404h-1.219a3.2 3.2 0 0 1-.212-1.038c-.025-.597-.09-1.48-.098-1.71-.09-1.332-.687-1.455-1.791-1.455h-.99v4.211h-1.177v-9.15h3.222v-.008Zm-2.045 1.014v2.944h1.423c1.088 0 1.57-.556 1.57-1.538 0-.981-.482-1.406-1.316-1.406h-1.677ZM14.275 6.807h4.17l-5.078 8.144 5.078 10.01h-4.277l-4.35-9.307h-.05v9.306H5.976V6.807h3.794v7.768h.049l4.457-7.768Zm8.823 18.153h3.794v-6.288L31.97 6.807h-3.876l-2.895 7.67-2.706-7.67h-4.146l4.75 11.865v6.288Zm20.304 0v-3.017H37.72V6.807h-3.794V24.96h9.477Zm1.832 0h3.794V6.807h-3.794V24.96Zm15.733 0v-2.788h-6.313v-5.307h5.634v-2.789h-5.634v-4.48h6.109v-2.79h-9.911V24.96H60.967Zm54.616 0V10.952h.049l3.32 14h3.623l3.492-14h.049v14h3.696V6.807h-5.904l-3.018 12.34h-.049l-2.837-12.34h-6.109V24.96h3.697-.009Zm26.168 0v-2.788h-6.313v-5.307h5.634v-2.789h-5.634v-4.48h6.108v-2.79h-9.902V24.96h10.107Zm1.643-18.153v3.017h4.228V24.96h3.794V9.824h4.228V6.807h-12.25Zm17.868 18.153V6.807h-3.794V24.96h3.794Zm-84.112.295c3.54 0 5.479-1.562 5.479-6.411h-3.745c-.05 1.43.024 3.696-1.734 3.696-2.134 0-2.412-2.012-2.412-6.665 0-4.653.278-6.664 2.412-6.664 1.128 0 1.562.907 1.562 3.32h3.72c.148-3.893-1.406-6.035-5.282-6.035-6.264 0-6.264 4.571-6.264 9.38 0 4.807 0 9.379 6.264 9.379Zm13.435 0c6.256 0 6.256-4.629 6.256-9.38 0-4.75 0-9.38-6.256-9.38-6.255 0-6.263 4.572-6.263 9.38 0 4.808 0 9.38 6.263 9.38Zm0-2.715c-2.134 0-2.412-2.012-2.412-6.665 0-4.653.278-6.664 2.412-6.664 2.135 0 2.413 2.011 2.413 6.664s-.278 6.665-2.413 6.665Zm19.65-2.535c0-5.708-7.645-5.405-7.645-8.848 0-1.26.727-1.938 1.962-1.938 1.529 0 1.758 1.382 1.758 2.74h3.696c.254-3.795-1.586-5.455-5.282-5.455-4.628 0-5.986 2.265-5.986 5.103 0 5.405 7.646 5.61 7.646 8.872 0 1.235-.63 2.06-1.914 2.06-2.085 0-2.158-1.455-2.158-3.197h-3.795c-.204 3.14.679 5.913 5.381 5.913 2.887 0 6.337-.556 6.337-5.25Zm59.122 5.25c3.541 0 5.479-1.562 5.479-6.411h-3.745c-.049 1.43.025 3.696-1.734 3.696-2.134 0-2.412-2.012-2.412-6.665 0-4.653.278-6.664 2.412-6.664 1.129 0 1.562.907 1.562 3.32h3.721c.147-3.893-1.407-6.035-5.283-6.035-6.263 0-6.263 4.571-6.263 9.38 0 4.807 0 9.379 6.263 9.379Zm18.669-5.25c0-5.708-7.646-5.405-7.646-8.848 0-1.26.728-1.938 1.963-1.938 1.529 0 1.758 1.382 1.758 2.74h3.696c.254-3.795-1.586-5.455-5.282-5.455-4.629 0-5.986 2.265-5.986 5.103 0 5.405 7.646 5.61 7.646 8.872 0 1.235-.63 2.06-1.914 2.06-2.085 0-2.159-1.455-2.159-3.197h-3.794c-.204 3.14.679 5.913 5.381 5.913 2.886 0 6.337-.556 6.337-5.25Z"></path>
                  </svg>
                </Link>
              </h1>
            </div>

            {/* Navigation */}
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
                              {item.name}
                              {isFragrance && (
                                <div className={styles.linkSparkleBottom}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none">
                                    <path fill="currentColor" fillRule="evenodd" d="M6.512.563A.527.527 0 0 1 7.26.047a.53.53 0 0 1 .308.52c-.009 1.466-.008 2.529.08 3.314.088.792.257 1.22.515 1.479.26.26.686.434 1.479.534.788.098 1.857.116 3.334.13a.527.527 0 0 1 .37.897.528.528 0 0 1-.373.154h-.002c-1.477-.009-2.547-.008-3.337.08-.793.088-1.22.257-1.48.516-.262.26-.436.687-.536 1.478-.098.785-.116 1.85-.13 3.32a.523.523 0 0 1-.537.53.527.527 0 0 1-.52-.525v-.002c.008-1.475.008-2.543-.08-3.331-.088-.793-.257-1.22-.516-1.479-.26-.261-.689-.435-1.48-.535-.789-.1-1.858-.116-3.334-.13h-.004a.527.527 0 0 1 .01-1.054h.002c1.477.01 2.547.009 3.337-.079.793-.088 1.22-.256 1.481-.514.261-.259.435-.685.535-1.477.098-.784.116-1.846.13-3.31Zm.446 12.049.006-.135v-.002h-.005v.137Zm0-.137h.006l.01-.251h-.016v.25Zm.03-4.996c.11-.207.245-.39.409-.553.165-.164.352-.296.561-.405a2.294 2.294 0 0 1-.554-.41 2.296 2.296 0 0 1-.403-.559c-.111.207-.246.392-.412.555a2.296 2.296 0 0 1-.56.403c.208.11.393.246.556.411.163.165.295.35.403.558Z" clipRule="evenodd"></path>
                                  </svg>
                                </div>
                              )}
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

            {/* Desktop Utilities - All Icons */}
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
                <svg width="19" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
