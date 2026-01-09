import { useState } from 'react';
import styles from './Products.module.css';

// All 82 Skincare Products - Hardcoded, No API
interface SkincareProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  amazonUrl: string;
  affiliateUrl: string;
  promoText: string;
}

const ALL_82_SKINCARE_PRODUCTS: SkincareProduct[] = [
  { id: '1', name: 'Grass-Fed Beef Tallow for Skin', price: 10.00, originalPrice: 19.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0G4QVNGSR', affiliateUrl: 'https://www.amazon.com/dp/B0G4QVNGSR/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '2', name: '10 Pack Hydrating Sheet Mask', price: 4.99, originalPrice: 9.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0D1XQGXG8', affiliateUrl: 'https://www.amazon.com/dp/B0D1XQGXG8/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '3', name: 'AH-8 Firming Neck Cream', price: 3.99, originalPrice: 7.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0F43M9PXF', affiliateUrl: 'https://www.amazon.com/dp/B0F43M9PXF/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '4', name: 'Body Firming Oil', price: 7.99, originalPrice: 25.99, discount: 69, amazonUrl: 'https://www.amazon.com/dp/B0G2PLRGW5', affiliateUrl: 'https://www.amazon.com/dp/B0G2PLRGW5/?tag=victoria0cdb-20', promoText: '69% OFF' },
  { id: '5', name: 'Alcura Nerve Cream', price: 9.00, originalPrice: 17.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0G292W74Y', affiliateUrl: 'https://www.amazon.com/dp/B0G292W74Y/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '6', name: 'Breast Enhancement Patch', price: 8.42, originalPrice: 16.83, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0G3N7LWX3', affiliateUrl: 'https://www.amazon.com/dp/B0G3N7LWX3/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '7', name: 'Salmon DNA PDRN Serum', price: 15.00, originalPrice: 29.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0FT8DWLXN', affiliateUrl: 'https://www.amazon.com/dp/B0FT8DWLXN/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '8', name: '5-in-1 Vitamin C Serum', price: 5.99, originalPrice: 9.99, discount: 40, amazonUrl: 'https://www.amazon.com/dp/B0G29G5MXV', affiliateUrl: 'https://www.amazon.com/dp/B0G29G5MXV/?tag=victoria0cdb-20', promoText: '40% OFF' },
  { id: '9', name: 'Revolution Balm Glow', price: 3.25, originalPrice: 12.00, discount: 73, amazonUrl: 'https://www.amazon.com/dp/B0BTMCH534', affiliateUrl: 'https://www.amazon.com/dp/B0BTMCH534/?tag=victoria0cdb-20', promoText: '73% OFF' },
  { id: '10', name: 'Salmon DNA PDRN Anti-Aging Serum', price: 9.49, originalPrice: 29.99, discount: 68, amazonUrl: 'https://www.amazon.com/dp/B0FYF8CX7R', affiliateUrl: 'https://www.amazon.com/dp/B0FYF8CX7R/?tag=victoria0cdb-20', promoText: '68% OFF' },
  { id: '11', name: 'Orange Exfoliating Gel', price: 6.49, originalPrice: 12.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0G2S1M266', affiliateUrl: 'https://www.amazon.com/dp/B0G2S1M266/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '12', name: 'PDRN Pink Collagen Capsule Cream', price: 9.85, originalPrice: 16.99, discount: 42, amazonUrl: 'https://www.amazon.com/dp/B0F9XYWFZ8', affiliateUrl: 'https://www.amazon.com/dp/B0F9XYWFZ8/?tag=victoria0cdb-20', promoText: '42% OFF' },
  { id: '13', name: 'Beaupretty Mini Cosmetic Spatulas', price: 4.81, originalPrice: 8.01, discount: 40, amazonUrl: 'https://www.amazon.com/dp/B094DGZV56', affiliateUrl: 'https://www.amazon.com/dp/B094DGZV56/?tag=victoria0cdb-20', promoText: '40% OFF' },
  { id: '14', name: 'Salmon DNA PDRN Facial Serum', price: 25.51, originalPrice: 43.99, discount: 42, amazonUrl: 'https://www.amazon.com/dp/B0FRFNFGW7', affiliateUrl: 'https://www.amazon.com/dp/B0FRFNFGW7/?tag=victoria0cdb-20', promoText: '42% OFF' },
  { id: '15', name: 'Advanced Retinol Firming Serum Stick', price: 7.99, originalPrice: 15.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0F6T9KBWM', affiliateUrl: 'https://www.amazon.com/dp/B0F6T9KBWM/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '16', name: 'Cetaphil Sheer Mineral Sunscreen', price: 7.44, originalPrice: 10.99, discount: 32, amazonUrl: 'https://www.amazon.com/dp/B08HJKQP7X', affiliateUrl: 'https://www.amazon.com/dp/B08HJKQP7X/?tag=victoria0cdb-20', promoText: '32% OFF' },
  { id: '17', name: 'Rejuvenating Facial Night Cream', price: 13.33, originalPrice: 22.22, discount: 40, amazonUrl: 'https://www.amazon.com/dp/B0CSM3Q54Z', affiliateUrl: 'https://www.amazon.com/dp/B0CSM3Q54Z/?tag=victoria0cdb-20', promoText: '40% OFF' },
  { id: '18', name: 'Centella Sunscreen', price: 7.99, originalPrice: 15.98, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0F9WXBT5D', affiliateUrl: 'https://www.amazon.com/dp/B0F9WXBT5D/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '19', name: 'Niacinamide 5% Pore Refining Serum', price: 11.99, originalPrice: 19.99, discount: 40, amazonUrl: 'https://www.amazon.com/dp/B0CW61QCPZ', affiliateUrl: 'https://www.amazon.com/dp/B0CW61QCPZ/?tag=victoria0cdb-20', promoText: '40% OFF' },
  { id: '20', name: 'Natural Amor Vanilla Rose Body Butter', price: 7.49, originalPrice: 14.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0FHJPQ44T', affiliateUrl: 'https://www.amazon.com/dp/B0FHJPQ44T/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '21', name: 'Breast Enhancement Cream', price: 8.89, originalPrice: 17.77, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0G393G8XL', affiliateUrl: 'https://www.amazon.com/dp/B0G393G8XL/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '22', name: 'Medicube Hyaluronic Acid Jelly Cream', price: 14.90, originalPrice: 16.90, discount: 12, amazonUrl: 'https://www.amazon.com/dp/B0FPQ3Z16S', affiliateUrl: 'https://www.amazon.com/dp/B0FPQ3Z16S/?tag=victoria0cdb-20', promoText: '12% OFF' },
  { id: '23', name: 'eos Cashmere Pre-Shave Scrub', price: 5.00, originalPrice: 8.99, discount: 44, amazonUrl: 'https://www.amazon.com/dp/B0CPD1JDKF', affiliateUrl: 'https://www.amazon.com/dp/B0CPD1JDKF/?tag=victoria0cdb-20', promoText: '44% OFF' },
  { id: '24', name: 'Ice Face Mask', price: 7.99, originalPrice: 15.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0CZS7XGVW', affiliateUrl: 'https://www.amazon.com/dp/B0CZS7XGVW/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '25', name: 'Irish Spring Bar Soap', price: 16.74, originalPrice: 25.99, discount: 36, amazonUrl: 'https://www.amazon.com/dp/B07FY17L3N', affiliateUrl: 'https://www.amazon.com/dp/B07FY17L3N/?tag=victoria0cdb-20', promoText: '36% OFF' },
  { id: '26', name: 'Deep Collagen Face Mask', price: 9.43, originalPrice: 15.99, discount: 41, amazonUrl: 'https://www.amazon.com/dp/B0DJ737LXP', affiliateUrl: 'https://www.amazon.com/dp/B0DJ737LXP/?tag=victoria0cdb-20', promoText: '41% OFF' },
  { id: '27', name: 'New Beef Tallow for Face', price: 11.94, originalPrice: 23.89, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0F386N56J', affiliateUrl: 'https://www.amazon.com/dp/B0F386N56J/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '28', name: 'CLIO Glazing Milky Essence', price: 16.79, originalPrice: 27.99, discount: 40, amazonUrl: 'https://www.amazon.com/dp/B0FLXK5HVL', affiliateUrl: 'https://www.amazon.com/dp/B0FLXK5HVL/?tag=victoria0cdb-20', promoText: '40% OFF' },
  { id: '29', name: 'Rice Exfoliating Ampoule Set', price: 7.99, originalPrice: 15.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0FND3SWL5', affiliateUrl: 'https://www.amazon.com/dp/B0FND3SWL5/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '30', name: '2% Salicylic Acid Serum', price: 9.92, originalPrice: 18.71, discount: 47, amazonUrl: 'https://www.amazon.com/dp/B0FN3J729X', affiliateUrl: 'https://www.amazon.com/dp/B0FN3J729X/?tag=victoria0cdb-20', promoText: '47% OFF' },
  { id: '31', name: 'Snail Mucin Toning Pads', price: 15.50, originalPrice: 33.88, discount: 54, amazonUrl: 'https://www.amazon.com/dp/B0FFY6F1FK', affiliateUrl: 'https://www.amazon.com/dp/B0FFY6F1FK/?tag=victoria0cdb-20', promoText: '54% OFF' },
  { id: '32', name: 'AH-8 Firming Neck Cream (Chamomile)', price: 4.94, originalPrice: 9.89, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0G1Y79CSJ', affiliateUrl: 'https://www.amazon.com/dp/B0G1Y79CSJ/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '33', name: 'Salmon DNA PDRN Peptide Serum', price: 19.99, originalPrice: 45.99, discount: 57, amazonUrl: 'https://www.amazon.com/dp/B0FMX8BM4L', affiliateUrl: 'https://www.amazon.com/dp/B0FMX8BM4L/?tag=victoria0cdb-20', promoText: '57% OFF' },
  { id: '34', name: 'Neck Lift Tape', price: 8.66, originalPrice: 17.33, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0G5WVB8Z3', affiliateUrl: 'https://www.amazon.com/dp/B0G5WVB8Z3/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '35', name: 'Acne Patches', price: 3.99, originalPrice: 7.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0CKMY3CS9', affiliateUrl: 'https://www.amazon.com/dp/B0CKMY3CS9/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '36', name: 'Hyaluronic Acid Powder', price: 6.49, originalPrice: 12.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0G5YD2MZW', affiliateUrl: 'https://www.amazon.com/dp/B0G5YD2MZW/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '37', name: 'Collagen Face Mask', price: 4.99, originalPrice: 9.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0DXFCS75L', affiliateUrl: 'https://www.amazon.com/dp/B0DXFCS75L/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '38', name: 'Retinol Serum', price: 9.97, originalPrice: 18.82, discount: 47, amazonUrl: 'https://www.amazon.com/dp/B0F62QBWKN', affiliateUrl: 'https://www.amazon.com/dp/B0F62QBWKN/?tag=victoria0cdb-20', promoText: '47% OFF' },
  { id: '39', name: 'Blue Lagoon GHK-Cu Serum', price: 17.49, originalPrice: 34.98, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0G445XBLQ', affiliateUrl: 'https://www.amazon.com/dp/B0G445XBLQ/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '40', name: 'Turmeric Vitamin C Clay Mask', price: 4.49, originalPrice: 8.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0FMK7WDSQ', affiliateUrl: 'https://www.amazon.com/dp/B0FMK7WDSQ/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '41', name: 'Retinol B5 Resurfacing Serum', price: 11.00, originalPrice: 21.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0FJFLK22X', affiliateUrl: 'https://www.amazon.com/dp/B0FJFLK22X/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '42', name: 'Tallow Glow Balm', price: 5.49, originalPrice: 9.99, discount: 45, amazonUrl: 'https://www.amazon.com/dp/B0FSWKKY67', affiliateUrl: 'https://www.amazon.com/dp/B0FSWKKY67/?tag=victoria0cdb-20', promoText: '45% OFF' },
  { id: '43', name: 'Vitamin C Serum', price: 29.90, originalPrice: 46.00, discount: 35, amazonUrl: 'https://www.amazon.com/dp/B0FT71JLYF', affiliateUrl: 'https://www.amazon.com/dp/B0FT71JLYF/?tag=victoria0cdb-20', promoText: '35% OFF' },
  { id: '44', name: 'PDRN Skin Care Set', price: 43.55, originalPrice: 67.00, discount: 35, amazonUrl: 'https://www.amazon.com/dp/B0FX7SYL6K', affiliateUrl: 'https://www.amazon.com/dp/B0FX7SYL6K/?tag=victoria0cdb-20', promoText: '35% OFF' },
  { id: '45', name: 'BANOBAGI Milk Thistle Repair Cream', price: 18.90, originalPrice: 27.00, discount: 30, amazonUrl: 'https://www.amazon.com/dp/B08JQF78VV', affiliateUrl: 'https://www.amazon.com/dp/B08JQF78VV/?tag=victoria0cdb-20', promoText: '30% OFF' },
  { id: '46', name: 'Beef Tallow for Skin', price: 10.00, originalPrice: 19.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0FR59XDFD', affiliateUrl: 'https://www.amazon.com/dp/B0FR59XDFD/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '47', name: 'Fed Beef Tallow Balm', price: 12.50, originalPrice: 24.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0FSWQZL4S', affiliateUrl: 'https://www.amazon.com/dp/B0FSWQZL4S/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '48', name: 'Medicube Wrapping Mask', price: 16.14, originalPrice: 21.80, discount: 26, amazonUrl: 'https://www.amazon.com/dp/B0FLQ3DCH2', affiliateUrl: 'https://www.amazon.com/dp/B0FLQ3DCH2/?tag=victoria0cdb-20', promoText: '26% OFF' },
  { id: '49', name: 'HKY Acne Serum', price: 12.50, originalPrice: 24.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0FHJRHXP7', affiliateUrl: 'https://www.amazon.com/dp/B0FHJRHXP7/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '50', name: 'Prickly Pear Seed Oil', price: 18.00, originalPrice: 30.00, discount: 40, amazonUrl: 'https://www.amazon.com/dp/B08R2FSPLL', affiliateUrl: 'https://www.amazon.com/dp/B08R2FSPLL/?tag=victoria0cdb-20', promoText: '40% OFF' },
  { id: '51', name: 'FRCOLOR Facial Roller', price: 5.45, originalPrice: 9.09, discount: 40, amazonUrl: 'https://www.amazon.com/dp/B0CDF83QRR', affiliateUrl: 'https://www.amazon.com/dp/B0CDF83QRR/?tag=victoria0cdb-20', promoText: '40% OFF' },
  { id: '52', name: 'CeraVe Skin Renewing Gel Oil', price: 12.99, originalPrice: 25.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B01LZAN652', affiliateUrl: 'https://www.amazon.com/dp/B01LZAN652/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '53', name: 'Hyaluronic Acid Overnight Mask', price: 5.99, originalPrice: 11.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0F28YLSN8', affiliateUrl: 'https://www.amazon.com/dp/B0F28YLSN8/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '54', name: 'Neutrogena Hydro Boost Serum', price: 12.56, originalPrice: 26.79, discount: 53, amazonUrl: 'https://www.amazon.com/dp/B01HOHBS7K', affiliateUrl: 'https://www.amazon.com/dp/B01HOHBS7K/?tag=victoria0cdb-20', promoText: '53% OFF' },
  { id: '55', name: 'TreeActiv Body & Back Acne Spray', price: 9.79, originalPrice: 19.59, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0DBRH4D1G', affiliateUrl: 'https://www.amazon.com/dp/B0DBRH4D1G/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '56', name: 'Spa Gift Set', price: 8.50, originalPrice: 16.99, discount: 50, amazonUrl: 'https://www.amazon.com/dp/B0DMNV3X3L', affiliateUrl: 'https://www.amazon.com/dp/B0DMNV3X3L/?tag=victoria0cdb-20', promoText: '50% OFF' },
  { id: '57', name: 'Peel Shot Glow Rice Ampoule Duo', price: 9.99, originalPrice: 15.96, discount: 37, amazonUrl: 'https://www.amazon.com/dp/B0FX3MH5BX', affiliateUrl: 'https://www.amazon.com/dp/B0FX3MH5BX/?tag=victoria0cdb-20', promoText: '37% OFF' },
  { id: '58', name: 'Aveeno Daily Moisturizing Lotion', price: 13.95, originalPrice: 22.00, discount: 37, amazonUrl: 'https://www.amazon.com/dp/B0BLY1CWJ4', affiliateUrl: 'https://www.amazon.com/dp/B0BLY1CWJ4/?tag=victoria0cdb-20', promoText: '37% OFF' },
  { id: '59', name: 'FRCOLOR Cotton Facial Mask Sheets', price: 27.43, originalPrice: 34.29, discount: 20, amazonUrl: 'https://www.amazon.com/dp/B0BYD879V4', affiliateUrl: 'https://www.amazon.com/dp/B0BYD879V4/?tag=victoria0cdb-20', promoText: '20% OFF' },
  { id: '60', name: 'Black & White Rice Peeling Set', price: 8.00, originalPrice: 18.99, discount: 58, amazonUrl: 'https://www.amazon.com/dp/B0FVX2WQ41', affiliateUrl: 'https://www.amazon.com/dp/B0FVX2WQ41/?tag=victoria0cdb-20', promoText: '58% OFF' },
];

const Skincare = () => {
  const [products] = useState<SkincareProduct[]>(ALL_82_SKINCARE_PRODUCTS);

  const handleBuyOnAmazon = (affiliateUrl: string) => {
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  // Generate rating for display
  const getRating = (productId: string) => {
    // Use product ID to generate consistent rating
    const seed = productId.charCodeAt(0) + productId.charCodeAt(productId.length - 1);
    return (4.0 + (seed % 10) / 10).toFixed(1);
  };

  const getReviewCount = (productId: string) => {
    const seed = productId.charCodeAt(0) * productId.charCodeAt(productId.length - 1);
    return Math.floor(seed % 500) + 50;
  };

  console.log('[SKINCARE PAGE] Rendering', products.length, 'hardcoded products');
  console.log('[SKINCARE PAGE] No API calls - all products are hardcoded');

  return (
    <div className={styles.products}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Skincare</h1>
          <p className={styles.subtitle}>
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <div className={styles.grid}>
          {products.map((product) => {
            const rating = getRating(product.id);
            const reviewCount = getReviewCount(product.id);
            const stars = Math.floor(parseFloat(rating));
            const hasHalfStar = parseFloat(rating) % 1 >= 0.5;

            return (
              <div key={product.id} className={styles.card} style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}>
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '1/1', 
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  color: '#999',
                  fontSize: '14px'
                }}>
                  Product Image
                </div>
                
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '400', 
                  marginBottom: '0.5rem',
                  color: '#000'
                }}>
                  {product.name}
                </h3>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <span>{'★'.repeat(stars)}{hasHalfStar ? '☆' : ''}</span>
                  <span>{rating} ({reviewCount})</span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'baseline', 
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{ 
                    fontSize: '18px', 
                    fontWeight: '500',
                    color: '#000'
                  }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#999',
                    textDecoration: 'line-through'
                  }}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#d32f2f',
                    fontWeight: '500'
                  }}>
                    {product.promoText}
                  </span>
                </div>

                <button
                  onClick={() => handleBuyOnAmazon(product.affiliateUrl)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                    marginTop: 'auto'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Buy on Amazon
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', color: '#666', fontSize: '14px' }}>
          <p>Showing all {products.length} skincare products</p>
        </div>
      </div>
    </div>
  );
};

export default Skincare;
