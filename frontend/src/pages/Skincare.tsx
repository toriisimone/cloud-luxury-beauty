import { useState } from 'react';
import styles from './Products.module.css';

// Static Skincare Products - No API, Just Hardcoded Data
interface SkincareProduct {
  id: string;
  title: string;
  image: string;
  asin: string;
  affiliate: string;
}

const ALL_SKINCARE_PRODUCTS: SkincareProduct[] = [
  { id: '51', title: 'Dr.Melaxin Peel Shot Kojic Acid Turmeric Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/71FIL4QFAHL._AC_UL600_SR600,400_.jpg', asin: 'B0FXTGD7LC', affiliate: 'https://www.amazon.com/dp/B0FXTGD7LC/?tag=victoria0cdb-20' },
  { id: '52', title: 'Dr.Althea PDRN Reju 5000 Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/419qAvG77UL._AC_UL600_SR600,400_.jpg', asin: 'B0G26XC6KT', affiliate: 'https://www.amazon.com/dp/B0G26XC6KT/?tag=victoria0cdb-20' },
  { id: '53', title: 'Head & Shoulders Anti-Dandruff Shampoo BARE', image: 'https://images-na.ssl-images-amazon.com/images/I/71QJ6y6v99L._AC_UL600_SR600,400_.jpg', asin: 'B0DMT1CJ2Q', affiliate: 'https://www.amazon.com/dp/B0DMT1CJ2Q/?tag=victoria0cdb-20' },
  { id: '54', title: 'AEEHFENG Timilk ChillErase Bump Renewal Spray', image: 'https://images-na.ssl-images-amazon.com/images/I/71XnLCYLNTL._AC_UL600_SR600,400_.jpg', asin: 'B0GCK5SHXJ', affiliate: 'https://www.amazon.com/dp/B0GCK5SHXJ/?tag=victoria0cdb-20' },
  { id: '55', title: 'Lymphatic Contour Face Brush', image: 'https://images-na.ssl-images-amazon.com/images/I/71j6xfG0fkL._AC_UL600_SR600,400_.jpg', asin: 'B0FYVG98GM', affiliate: 'https://www.amazon.com/dp/B0FYVG98GM/?tag=victoria0cdb-20' },
  { id: '56', title: 'JODSONE 3-in-1 Cat Eye Magnet Nail Tool', image: 'https://images-na.ssl-images-amazon.com/images/I/61Sjj++alVL._AC_UL600_SR600,400_.jpg', asin: 'B0FX3MP3W2', affiliate: 'https://www.amazon.com/dp/B0FX3MP3W2/?tag=victoria0cdb-20' },
  { id: '57', title: 'Native Scalp Detox Shampoo and Conditioner', image: 'https://images-na.ssl-images-amazon.com/images/I/71KXpO6jHwL._AC_UL600_SR600,400_.jpg', asin: 'B0G27P2LGS', affiliate: 'https://www.amazon.com/dp/B0G27P2LGS/?tag=victoria0cdb-20' },
  { id: '58', title: 'e.l.f. SKIN Bright + Brew-tiful Eye Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/61ax411X7gL._AC_UL600_SR600,400_.jpg', asin: 'B0G1H91LGM', affiliate: 'https://www.amazon.com/dp/B0G1H91LGM/?tag=victoria0cdb-20' },
  { id: '59', title: 'Lattafa Asad Elixir EDP', image: 'https://images-na.ssl-images-amazon.com/images/I/51f4XfVZtGL._AC_UL600_SR600,400_.jpg', asin: 'B0FWYPY4FX', affiliate: 'https://www.amazon.com/dp/B0FWYPY4FX/?tag=victoria0cdb-20' },
  { id: '60', title: 'prgislew Nose Hair Trimmer', image: 'https://images-na.ssl-images-amazon.com/images/I/61Fx2TiBpeL._AC_UL600_SR600,400_.jpg', asin: 'B0G18RXVLB', affiliate: 'https://www.amazon.com/dp/B0G18RXVLB/?tag=victoria0cdb-20' },
  { id: '61', title: 'Saltair Hyaluronic Acid Body Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/51mZFbRKa+L._AC_UL600_SR600,400_.jpg', asin: 'B0FX39VLRL', affiliate: 'https://www.amazon.com/dp/B0FX39VLRL/?tag=victoria0cdb-20' },
  { id: '63', title: 'grace & stella Hypochlorous Acid Spray', image: 'https://images-na.ssl-images-amazon.com/images/I/719x7jMja2L._AC_UL600_SR600,400_.jpg', asin: 'B0F6TS5HVH', affiliate: 'https://www.amazon.com/dp/B0F6TS5HVH/?tag=victoria0cdb-20' },
  { id: '64', title: 'GODA for Her Perfume and Silk Body Oil', image: 'https://images-na.ssl-images-amazon.com/images/I/61hUIcbOjrL._AC_UL600_SR600,400_.jpg', asin: 'B0G3RN2SC7', affiliate: 'https://www.amazon.com/dp/B0G3RN2SC7/?tag=victoria0cdb-20' },
  { id: '65', title: 'Vagilelf Demon Mark Tattoos', image: 'https://images-na.ssl-images-amazon.com/images/I/71Bz-a4mo4L._AC_UL600_SR600,400_.jpg', asin: 'B0FVYGZ255', affiliate: 'https://www.amazon.com/dp/B0FVYGZ255/?tag=victoria0cdb-20' },
  { id: '66', title: 'NYX Epic Inky Stix Eyeliner', image: 'https://images-na.ssl-images-amazon.com/images/I/51yUxo+5dHL._AC_UL600_SR600,400_.jpg', asin: 'B0FZCBBVDK', affiliate: 'https://www.amazon.com/dp/B0FZCBBVDK/?tag=victoria0cdb-20' },
  { id: '67', title: 'Lash Serum for Eyelashes & Eyebrows', image: 'https://images-na.ssl-images-amazon.com/images/I/61UQjAx4z5L._AC_UL600_SR600,400_.jpg', asin: 'B0GD12FCYQ', affiliate: 'https://www.amazon.com/dp/B0GD12FCYQ/?tag=victoria0cdb-20' },
  { id: '68', title: '2 Pcs Texture Comb Set', image: 'https://images-na.ssl-images-amazon.com/images/I/61+6nIreqOL._AC_UL600_SR600,400_.jpg', asin: 'B0G39WCFG2', affiliate: 'https://www.amazon.com/dp/B0G39WCFG2/?tag=victoria0cdb-20' },
  { id: '69', title: 'eos Cashmere Body Mist', image: 'https://images-na.ssl-images-amazon.com/images/I/61KlSccHHpL._AC_UL600_SR600,400_.jpg', asin: 'B0FRLXNTB2', affiliate: 'https://www.amazon.com/dp/B0FRLXNTB2/?tag=victoria0cdb-20' },
  { id: '70', title: "L'Oreal Revitalift Triple Power Eye Bag Eraser", image: 'https://images-na.ssl-images-amazon.com/images/I/81RcZcfyRQL._AC_UL600_SR600,400_.jpg', asin: 'B0FXJ4KJZQ', affiliate: 'https://www.amazon.com/dp/B0FXJ4KJZQ/?tag=victoria0cdb-20' },
  { id: '71', title: "L'Oreal Elvive Glycolic + Gloss Hair Serum", image: 'https://images-na.ssl-images-amazon.com/images/I/61l15UtTN1L._AC_UL600_SR600,400_.jpg', asin: 'B0FWKX1QMC', affiliate: 'https://www.amazon.com/dp/B0FWKX1QMC/?tag=victoria0cdb-20' },
  { id: '72', title: 'Wavytalk Steam Hair Straightener', image: 'https://images-na.ssl-images-amazon.com/images/I/61-HItePnWL._AC_UL600_SR600,400_.jpg', asin: 'B0FVXPLCKX', affiliate: 'https://www.amazon.com/dp/B0FVXPLCKX/?tag=victoria0cdb-20' },
  { id: '73', title: 'Prequel Skin Retinaldehyde 0.1%', image: 'https://images-na.ssl-images-amazon.com/images/I/614XaVcFu8L._AC_UL600_SR600,400_.jpg', asin: 'B0FY36QKW8', affiliate: 'https://www.amazon.com/dp/B0FY36QKW8/?tag=victoria0cdb-20' },
  { id: '74', title: 'Callus Remover for Feet Electric Foot File', image: 'https://images-na.ssl-images-amazon.com/images/I/71foQ8cpEeL._AC_UL600_SR600,400_.jpg', asin: 'B0FVSVVTQK', affiliate: 'https://www.amazon.com/dp/B0FVSVVTQK/?tag=victoria0cdb-20' },
  { id: '75', title: 'COSRX Advanced Pure Vitamin C 23% Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/71LzZAsVE+L._AC_UL600_SR600,400_.jpg', asin: 'B0FWQGLTQV', affiliate: 'https://www.amazon.com/dp/B0FWQGLTQV/?tag=victoria0cdb-20' },
  { id: '76', title: 'Kitsch Strengthening Rice Water Protein Shampoo', image: 'https://images-na.ssl-images-amazon.com/images/I/71Ng-h0FaTL._AC_UL600_SR600,400_.jpg', asin: 'B0FWDDN77G', affiliate: 'https://www.amazon.com/dp/B0FWDDN77G/?tag=victoria0cdb-20' },
  { id: '77', title: 'Jawline Shaper Chin Strap', image: 'https://images-na.ssl-images-amazon.com/images/I/61ADwFfmABL._AC_UL600_SR600,400_.jpg', asin: 'B0FNQSMFTN', affiliate: 'https://www.amazon.com/dp/B0FNQSMFTN/?tag=victoria0cdb-20' },
  { id: '78', title: 'Lymphatic Contour Face Brush', image: 'https://images-na.ssl-images-amazon.com/images/I/61PoCKMjBSL._AC_UL600_SR600,400_.jpg', asin: 'B0FXTTV4NV', affiliate: 'https://www.amazon.com/dp/B0FXTTV4NV/?tag=victoria0cdb-20' },
  { id: '79', title: 'e.l.f. Soft Glam Brightening Corrector', image: 'https://images-na.ssl-images-amazon.com/images/I/61je2LPc2qL._AC_UL600_SR600,400_.jpg', asin: 'B0G1H283LW', affiliate: 'https://www.amazon.com/dp/B0G1H283LW/?tag=victoria0cdb-20' },
  { id: '80', title: 'Dove Holiday Treats Body Wash', image: 'https://images-na.ssl-images-amazon.com/images/I/61-fcISkgLL._AC_UL600_SR600,400_.jpg', asin: 'B0CNZ5YLVB', affiliate: 'https://www.amazon.com/dp/B0CNZ5YLVB/?tag=victoria0cdb-20' },
  { id: '81', title: 'Pnctho Lymphatic Contour Face Brush', image: 'https://images-na.ssl-images-amazon.com/images/I/71yxHDsJMaL._AC_UL300_SR300,200_.jpg', asin: 'B0G356ZQ9T', affiliate: 'https://www.amazon.com/dp/B0G356ZQ9T/?tag=victoria0cdb-20' },
  { id: '82', title: 'GLORENDA Moringa 10-in-1 Nano Microdarts Patch', image: 'https://images-na.ssl-images-amazon.com/images/I/81g4ijxiCiL._AC_UL300_SR300,200_.jpg', asin: 'B0GD7N2VT3', affiliate: 'https://www.amazon.com/dp/B0GD7N2VT3/?tag=victoria0cdb-20' },
  { id: '83', title: 'QUIA Toner Pads – PHA Dual-Action', image: 'https://images-na.ssl-images-amazon.com/images/I/712b1iTUJ6L._AC_UL300_SR300,200_.jpg', asin: 'B0G4JQ5M69', affiliate: 'https://www.amazon.com/dp/B0G4JQ5M69/?tag=victoria0cdb-20' },
  { id: '84', title: 'Maybelline Lifter Plump & Glow Foundation', image: 'https://images-na.ssl-images-amazon.com/images/I/61K1pEfOFCL._AC_UL300_SR300,200_.jpg', asin: 'B0FYGYPK8Q', affiliate: 'https://www.amazon.com/dp/B0FYGYPK8Q/?tag=victoria0cdb-20' },
  { id: '85', title: 'CeraVe Oil Control Balancing Conditioner', image: 'https://images-na.ssl-images-amazon.com/images/I/618J60UJc8L._AC_UL300_SR300,200_.jpg', asin: 'B0FWVND3JL', affiliate: 'https://www.amazon.com/dp/B0FWVND3JL/?tag=victoria0cdb-20' },
  { id: '86', title: 'Lattafa Yara Elixir Eau De Parfum', image: 'https://images-na.ssl-images-amazon.com/images/I/51cJib0GC2L._AC_UL300_SR300,200_.jpg', asin: 'B0FY7HQYDD', affiliate: 'https://www.amazon.com/dp/B0FY7HQYDD/?tag=victoria0cdb-20' },
  { id: '87', title: 'Old Spice Aluminum Free Deodorant', image: 'https://images-na.ssl-images-amazon.com/images/I/71zeAWByUuL._AC_UL300_SR300,200_.jpg', asin: 'B0FXY83ZC1', affiliate: 'https://www.amazon.com/dp/B0FXY83ZC1/?tag=victoria0cdb-20' },
  { id: '88', title: 'Brush Pro Portable Straightener', image: 'https://images-na.ssl-images-amazon.com/images/I/61Jze2dHszL._AC_UL300_SR300,200_.jpg', asin: 'B0G52WQ17K', affiliate: 'https://www.amazon.com/dp/B0G52WQ17K/?tag=victoria0cdb-20' },
  { id: '89', title: 'W3W 4D Dual-Ended Brow Pen', image: 'https://images-na.ssl-images-amazon.com/images/I/71myRYqUD3L._AC_UL300_SR300,200_.jpg', asin: 'B0FZ7Z2CHN', affiliate: 'https://www.amazon.com/dp/B0FZ7Z2CHN/?tag=victoria0cdb-20' },
  { id: '90', title: 'The Ordinary Volufiline 92% Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/61D3pKRpxaL._AC_UL300_SR300,200_.jpg', asin: 'B0FYJ4WQ5J', affiliate: 'https://www.amazon.com/dp/B0FYJ4WQ5J/?tag=victoria0cdb-20' },
  { id: '91', title: 'CeraVe Invisible Mineral Sunscreen SPF 50', image: 'https://images-na.ssl-images-amazon.com/images/I/61IvJtPa9EL._AC_UL300_SR300,200_.jpg', asin: 'B0FXNHDWM7', affiliate: 'https://www.amazon.com/dp/B0FXNHDWM7/?tag=victoria0cdb-20' },
  { id: '92', title: 'VFD 30X/1X Makeup Mirror with Lights', image: 'https://images-na.ssl-images-amazon.com/images/I/618O2BajQIL._AC_UL300_SR300,200_.jpg', asin: 'B0FVBFHLHW', affiliate: 'https://www.amazon.com/dp/B0FVBFHLHW/?tag=victoria0cdb-20' },
  { id: '93', title: 'NYX Buttermelt Highlighter', image: 'https://images-na.ssl-images-amazon.com/images/I/81Of4mXdNeL._AC_UL300_SR300,200_.jpg', asin: 'B0DZ2M8BNF', affiliate: 'https://www.amazon.com/dp/B0DZ2M8BNF/?tag=victoria0cdb-20' },
  // New products added
  { id: '94', title: "L'Oreal Paris Extensionist Mascara", image: 'https://images-na.ssl-images-amazon.com/images/I/61v7CPtyOHL._AC_UL600_SR600,400_.jpg', asin: 'B0FSSPR9C1', affiliate: 'https://www.amazon.com/dp/B0FSSPR9C1/?tag=victoria0cdb-20' },
  { id: '95', title: 'COVERGIRL TruBlend Skin Enhancer Baked Luminous Blush - Rose Latte', image: 'https://images-na.ssl-images-amazon.com/images/I/91ggsrn-rOL._AC_UL600_SR600,400_.jpg', asin: 'B0FJNDCRB8', affiliate: 'https://www.amazon.com/dp/B0FJNDCRB8/?tag=victoria0cdb-20' },
  { id: '96', title: 'e.l.f. Glow Reviver Slipstick - Jam Packed', image: 'https://images-na.ssl-images-amazon.com/images/I/51zSzhrA4kL._AC_UL600_SR600,400_.jpg', asin: 'B0G1H1NQY8', affiliate: 'https://www.amazon.com/dp/B0G1H1NQY8/?tag=victoria0cdb-20' },
  { id: '97', title: 'e.l.f. Soft Glam Satin Concealer - 11 Fair Neutral', image: 'https://images-na.ssl-images-amazon.com/images/I/61XalxRHccL._AC_UL600_SR600,400_.jpg', asin: 'B0G1GX6553', affiliate: 'https://www.amazon.com/dp/B0G1GX6553/?tag=victoria0cdb-20' },
  { id: '98', title: 'eos Cashmere Body Mist - Vanilla Cashmere', image: 'https://images-na.ssl-images-amazon.com/images/I/61SgurHlDNL._AC_UL600_SR600,400_.jpg', asin: 'B0FM2CCBS1', affiliate: 'https://www.amazon.com/dp/B0FM2CCBS1/?tag=victoria0cdb-20' },
  { id: '99', title: 'Kitsch Smoothing Air Dry Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/61GarWNvoqL._AC_UL600_SR600,400_.jpg', asin: 'B0FXY2143T', affiliate: 'https://www.amazon.com/dp/B0FXY2143T/?tag=victoria0cdb-20' },
  { id: '100', title: '12 Colors Nail Art Pens for Kids', image: 'https://images-na.ssl-images-amazon.com/images/I/713LPc3+gGL._AC_UL600_SR600,400_.jpg', asin: 'B0G64QC663', affiliate: 'https://www.amazon.com/dp/B0G64QC663/?tag=victoria0cdb-20' },
  { id: '101', title: 'Good Molecules 10% Azelaic Acid Treatment', image: 'https://images-na.ssl-images-amazon.com/images/I/71G7NaZS5zL._AC_UL600_SR600,400_.jpg', asin: 'B0FZPGQHFB', affiliate: 'https://www.amazon.com/dp/B0FZPGQHFB/?tag=victoria0cdb-20' },
  { id: '102', title: 'grace & stella Under Eye Brightener', image: 'https://images-na.ssl-images-amazon.com/images/I/71mlFjZrQOL._AC_UL600_SR600,400_.jpg', asin: 'B0FJSNWNLW', affiliate: 'https://www.amazon.com/dp/B0FJSNWNLW/?tag=victoria0cdb-20' },
  { id: '103', title: 'CeraVe Oil Control Balancing Shampoo', image: 'https://images-na.ssl-images-amazon.com/images/I/61xpexCVd5L._AC_UL600_SR600,400_.jpg', asin: 'B0FWVCMG63', affiliate: 'https://www.amazon.com/dp/B0FWVCMG63/?tag=victoria0cdb-20' },
  { id: '104', title: 'Maybelline Lash Sensational Mascara', image: 'https://images-na.ssl-images-amazon.com/images/I/61GCXflKQ2L._AC_UL600_SR600,400_.jpg', asin: 'B0FR79HZN8', affiliate: 'https://www.amazon.com/dp/B0FR79HZN8/?tag=victoria0cdb-20' },
  { id: '105', title: 'SKIN1004 Madagascar Centella Hyalu-Cica Sun Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/51kdu8RqmJL._AC_UL600_SR600,400_.jpg', asin: 'B0FXH5LHN8', affiliate: 'https://www.amazon.com/dp/B0FXH5LHN8/?tag=victoria0cdb-20' },
  { id: '106', title: 'e.l.f. Liquid Velvet Eyeshadow - Beige & Boujee', image: 'https://images-na.ssl-images-amazon.com/images/I/61cXL3Wmo2L._AC_UL600_SR600,400_.jpg', asin: 'B0FWVJB2X4', affiliate: 'https://www.amazon.com/dp/B0FWVJB2X4/?tag=victoria0cdb-20' },
  { id: '107', title: 'Vaseline Lip Therapy Original Mini (2 Pack)', image: 'https://images-na.ssl-images-amazon.com/images/I/71g00fNyzZL._AC_UL600_SR600,400_.jpg', asin: 'B0BBPS73TD', affiliate: 'https://www.amazon.com/dp/B0BBPS73TD/?tag=victoria0cdb-20' },
  { id: '108', title: 'Native Sea Salt & Cedar Deodorant Twin Pack', image: 'https://images-na.ssl-images-amazon.com/images/I/813uNLayYAL._AC_UL600_SR600,400_.jpg', asin: 'B0G21YW6ZJ', affiliate: 'https://www.amazon.com/dp/B0G21YW6ZJ/?tag=victoria0cdb-20' },
  { id: '109', title: 'Luxe Research Color Changing Foundation', image: 'https://images-na.ssl-images-amazon.com/images/I/31wl6yCe+ML._AC_UL600_SR600,400_.jpg', asin: 'B0G1VBDXYF', affiliate: 'https://www.amazon.com/dp/B0G1VBDXYF/?tag=victoria0cdb-20' },
  { id: '110', title: 'Arencia Vitamin C Booster Shot Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/51CF4EwEADL._AC_UL600_SR600,400_.jpg', asin: 'B0FX418XT8', affiliate: 'https://www.amazon.com/dp/B0FX418XT8/?tag=victoria0cdb-20' },
  { id: '111', title: 'The Ordinary PHA 5% Exfoliating Lip Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/51fVADUAOiL._AC_UL600_SR600,400_.jpg', asin: 'B0FTZCWGSK', affiliate: 'https://www.amazon.com/dp/B0FTZCWGSK/?tag=victoria0cdb-20' },
  { id: '112', title: 'Prime Prometics Color Changing Foundation', image: 'https://images-na.ssl-images-amazon.com/images/I/41Hgs+Kcp5L._AC_UL600_SR600,400_.jpg', asin: 'B0G1T61T7X', affiliate: 'https://www.amazon.com/dp/B0G1T61T7X/?tag=victoria0cdb-20' },
  { id: '113', title: 'Pantene Abundant & Strong 3-Piece Regimen', image: 'https://images-na.ssl-images-amazon.com/images/I/71FNsx-D3jL._AC_UL600_SR600,400_.jpg', asin: 'B0FNF6MLT4', affiliate: 'https://www.amazon.com/dp/B0FNF6MLT4/?tag=victoria0cdb-20' },
];

const Skincare = () => {
  const [products] = useState<SkincareProduct[]>(ALL_SKINCARE_PRODUCTS);

  const handleBuyOnAmazon = (affiliateUrl: string) => {
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  console.log('[SKINCARE PAGE] Rendering', products.length, 'static products');
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
                  overflow: 'hidden'
                }}>
                  <img 
                    src={product.image} 
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div style="color: #999; font-size: 14px; text-align: center; padding: 2rem;">Product Image</div>';
                      }
                    }}
                  />
                </div>
                
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '400', 
                  marginBottom: '1rem',
                  color: '#000',
                  lineHeight: '1.4',
                  minHeight: '2.8em'
                }}>
                  {product.title}
                </h3>

                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  marginBottom: '1rem',
                  fontFamily: 'monospace'
                }}>
                  ASIN: {product.asin}
                </div>

                <button
                  onClick={() => handleBuyOnAmazon(product.affiliate)}
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
