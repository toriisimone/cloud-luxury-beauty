import { useEffect, useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Category, Product } from '../types/global';
import * as categoriesApi from '../api/categoriesApi';
import * as productsApi from '../api/productsApi';
import styles from './Home.module.css';

// Import the full skincare products data from Skincare page
// We'll filter to show only the 14 featured products
interface SkincareProduct {
  id: string;
  title: string;
  image: string;
  asin: string;
  affiliate: string;
}

// Import ALL products from Skincare page - this ensures we have access to all products
// including the ones the user specified that might be later in the list
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
  { id: '114', title: 'Aluminum Free Deodorant for Women – Natural Magnesium Formula', image: 'https://images-na.ssl-images-amazon.com/images/I/71e2fRoCp-L._AC_UL600_SR600,400_.jpg', asin: 'B0FX3D4WTL', affiliate: 'https://www.amazon.com/dp/B0FX3D4WTL/?tag=victoria0cdb-20' },
  { id: '115', title: 'Lash Serum – Natural & Vegan Eyelash Growth Serum (5ml)', image: 'https://images-na.ssl-images-amazon.com/images/I/71lvmkXKdVL._AC_UL600_SR600,400_.jpg', asin: 'B0G4QPDJ1J', affiliate: 'https://www.amazon.com/dp/B0G4QPDJ1J/?tag=victoria0cdb-20' },
  { id: '116', title: "L'Oreal Paris Lumi Bronze Le Stick Soleil Bronzer Stick", image: 'https://images-na.ssl-images-amazon.com/images/I/71gK3GfEcGL._AC_UL600_SR600,400_.jpg', asin: 'B0FTQFVVC4', affiliate: 'https://www.amazon.com/dp/B0FTQFVVC4/?tag=victoria0cdb-20' },
  { id: '117', title: 'Kitsch Scalp Renewal Brush – Terracotta', image: 'https://images-na.ssl-images-amazon.com/images/I/71afRpbMYDL._AC_UL600_SR600,400_.jpg', asin: 'B0FWRZFG42', affiliate: 'https://www.amazon.com/dp/B0FWRZFG42/?tag=victoria0cdb-20' },
  { id: '118', title: 'Prime Prometics Instant Coverage Hairline Powder – Brunette', image: 'https://images-na.ssl-images-amazon.com/images/I/51P15OCqYNL._AC_UL600_SR600,400_.jpg', asin: 'B0G3Y86V86', affiliate: 'https://www.amazon.com/dp/B0G3Y86V86/?tag=victoria0cdb-20' },
  { id: '119', title: 'Dark Spot Remover for Face – Niacinamide + Vitamin C', image: 'https://images-na.ssl-images-amazon.com/images/I/71R-4nq0l6L._AC_UL600_SR600,400_.jpg', asin: 'B0G8Z9C3F4', affiliate: 'https://www.amazon.com/dp/B0G8Z9C3F4/?tag=victoria0cdb-20' },
  { id: '120', title: 'Goodnites Skin Tag Remover – Salicylic Acid Formula', image: 'https://images-na.ssl-images-amazon.com/images/I/71zr0yVB-EL._AC_UL600_SR600,400_.jpg', asin: 'B0GC5265RQ', affiliate: 'https://www.amazon.com/dp/B0GC5265RQ/?tag=victoria0cdb-20' },
  { id: '121', title: 'Pantene Daily Moisture Renewal Shampoo – 27.7 fl oz', image: 'https://images-na.ssl-images-amazon.com/images/I/61E3UJ38BlL._AC_UL600_SR600,400_.jpg', asin: 'B09XVP8Z66', affiliate: 'https://www.amazon.com/dp/B09XVP8Z66/?tag=victoria0cdb-20' },
  { id: '122', title: 'e.l.f. Halo Glow Silky Powder Highlighter – Blush Money', image: 'https://images-na.ssl-images-amazon.com/images/I/817F4yoRsQL._AC_UL600_SR600,400_.jpg', asin: 'B0G1H24GPP', affiliate: 'https://www.amazon.com/dp/B0G1H24GPP/?tag=victoria0cdb-20' },
  { id: '123', title: 'opasyo Portable Mini Refillable Perfume Atomizer (4 Pack)', image: 'https://images-na.ssl-images-amazon.com/images/I/71lcoh3x-bL._AC_UL600_SR600,400_.jpg', asin: 'B0FVXG2DYR', affiliate: 'https://www.amazon.com/dp/B0FVXG2DYR/?tag=victoria0cdb-20' },
  { id: '124', title: 'TLOPA GLORENDA 10-in-1 Nano Microdarts Patch (3 Boxes)', image: 'https://images-na.ssl-images-amazon.com/images/I/71QqT9cgtTL._AC_UL300_SR300,200_.jpg', asin: 'B0GD1SHK9K', affiliate: 'https://www.amazon.com/dp/B0GD1SHK9K/?tag=victoria0cdb-20' },
  { id: '125', title: 'MIVZO 2-in-1 Nasal Hair Cutter (5 Pack)', image: 'https://images-na.ssl-images-amazon.com/images/I/61lM4L3pvsL._AC_UL300_SR300,200_.jpg', asin: 'B0FY5YVHGG', affiliate: 'https://www.amazon.com/dp/B0FY5YVHGG/?tag=victoria0cdb-20' },
  { id: '126', title: 'Maybelline Lifter Serum Concealer – Shade 20', image: 'https://images-na.ssl-images-amazon.com/images/I/61xdpJi3puL._AC_UL300_SR300,200_.jpg', asin: 'B0FYH1RLGX', affiliate: 'https://www.amazon.com/dp/B0FYH1RLGX/?tag=victoria0cdb-20' },
  { id: '127', title: 'Vaseline Lip Therapy Rosy Lips Mini (2 Pack)', image: 'https://images-na.ssl-images-amazon.com/images/I/71VK+1AOolL._AC_UL300_SR300,200_.jpg', asin: 'B0BBWCZLYY', affiliate: 'https://www.amazon.com/dp/B0BBWCZLYY/?tag=victoria0cdb-20' },
  { id: '128', title: "L'Oreal Paris Hyaluron Tint Lip Stain Serum – 635 Worth It", image: 'https://images-na.ssl-images-amazon.com/images/I/71aek+v3M+L._AC_UL300_SR300,200_.jpg', asin: 'B0G14ZCSTY', affiliate: 'https://www.amazon.com/dp/B0G14ZCSTY/?tag=victoria0cdb-20' },
  { id: '129', title: 'Vaseline Lip Balm Mini – Cocoa Butter (2 Pack)', image: 'https://images-na.ssl-images-amazon.com/images/I/71VkTYtlzdL._AC_UL300_SR300,200_.jpg', asin: 'B0F5HTSWW3', affiliate: 'https://www.amazon.com/dp/B0F5HTSWW3/?tag=victoria0cdb-20' },
  { id: '130', title: 'Dove Indulge Body Wash – Warm Vanilla + Sweet Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/71F5PKokeRL._AC_UL300_SR300,200_.jpg', asin: 'B0FKHKQ6FF', affiliate: 'https://www.amazon.com/dp/B0FKHKQ6FF/?tag=victoria0cdb-20' },
  { id: '131', title: 'NYX Jelly Job Lip Gloss – Toast N\' Jelly', image: 'https://images-na.ssl-images-amazon.com/images/I/71RfuEgUMxL._AC_UL300_SR300,200_.jpg', asin: 'B0FWS4BS5X', affiliate: 'https://www.amazon.com/dp/B0FWS4BS5X/?tag=victoria0cdb-20' },
  { id: '132', title: "L'Oreal Paris Elvive Glycolic + Gloss Shampoo & Conditioner Set", image: 'https://images-na.ssl-images-amazon.com/images/I/71hK1KIqidL._AC_UL300_SR300,200_.jpg', asin: 'B0G5BL3WZJ', affiliate: 'https://www.amazon.com/dp/B0G5BL3WZJ/?tag=victoria0cdb-20' },
  { id: '133', title: 'e.l.f. Glow Reviver Plumping Lip Oil – Piggy Bank', image: 'https://images-na.ssl-images-amazon.com/images/I/61HS5aqmDqL._AC_UL300_SR300,200_.jpg', asin: 'B0FPMHTKCN', affiliate: 'https://www.amazon.com/dp/B0FPMHTKCN/?tag=victoria0cdb-20' },
  { id: '134', title: 'Relief Sun Organic Korean Sunscreen SPF50+ (Rice & Probiotics)', image: 'https://images-na.ssl-images-amazon.com/images/I/61twZTX9VbL._AC_UL300_SR300,200_.jpg', asin: 'B0G4Z5G1NT', affiliate: 'https://www.amazon.com/dp/B0G4Z5G1NT/?tag=victoria0cdb-20' },
  { id: '135', title: 'New Lymphatic Contour Face Brush – Ergonomic Skin Fit', image: 'https://images-na.ssl-images-amazon.com/images/I/71VV7C7akFL._AC_UL300_SR300,200_.jpg', asin: 'B0G296S6LG', affiliate: 'https://www.amazon.com/dp/B0G296S6LG/?tag=victoria0cdb-20' },
  { id: '136', title: 'COVERGIRL Eye Enhancer Wrap Tubing Mascara – Max Motion Black', image: 'https://images-na.ssl-images-amazon.com/images/I/71-8KuWtftL._AC_UL300_SR300,200_.jpg', asin: 'B0FJMRBTXP', affiliate: 'https://www.amazon.com/dp/B0FJMRBTXP/?tag=victoria0cdb-20' },
  { id: '137', title: 'NYX Wonder Snatch Setting Powder – Cheeky Cherry', image: 'https://images-na.ssl-images-amazon.com/images/I/71fbcYGyMhL._AC_UL300_SR300,200_.jpg', asin: 'B0FWS4GPJ5', affiliate: 'https://www.amazon.com/dp/B0FWS4GPJ5/?tag=victoria0cdb-20' },
  { id: '138', title: 'Gold Bond Scented Hand Creams – 4 Pack', image: 'https://images-na.ssl-images-amazon.com/images/I/71HLxa0m40L._AC_UL300_SR300,200_.jpg', asin: 'B0FX5X9579', affiliate: 'https://www.amazon.com/dp/B0FX5X9579/?tag=victoria0cdb-20' },
  { id: '139', title: 'Anua PDRN Collagen Glow Facial Serum Spray', image: 'https://images-na.ssl-images-amazon.com/images/I/71LQ-32prpL._AC_UL300_SR300,200_.jpg', asin: 'B0FVT77ZLL', affiliate: 'https://www.amazon.com/dp/B0FVT77ZLL/?tag=victoria0cdb-20' },
  { id: '140', title: 'Aussie Ultra Wonder Daily Mist Detangler', image: 'https://images-na.ssl-images-amazon.com/images/I/711GWxz7ywL._AC_UL300_SR300,200_.jpg', asin: 'B0FPSXGL5Y', affiliate: 'https://www.amazon.com/dp/B0FPSXGL5Y/?tag=victoria0cdb-20' },
  { id: '141', title: 'amika frizz-me-not Hydrating Anti-Frizz Treatment', image: 'https://images-na.ssl-images-amazon.com/images/I/61Uxi1qDGrL._AC_UL300_SR300,200_.jpg', asin: 'B0F6VMGGG3', affiliate: 'https://www.amazon.com/dp/B0F6VMGGG3/?tag=victoria0cdb-20' },
  { id: '142', title: 'Relief Sun Organic Korean Sunscreen SPF50+ (Alternate Variant)', image: 'https://images-na.ssl-images-amazon.com/images/I/61IW-Y5O1YL._AC_UL300_SR300,200_.jpg', asin: 'B0FXBR5T6R', affiliate: 'https://www.amazon.com/dp/B0FXBR5T6R/?tag=victoria0cdb-20' },
];

// AMAZON API DISABLED: Always use database products
// import AmazonProductCard from '../components/AmazonProductCard';
// import { AmazonProduct } from '../api/amazonApi';
// import * as amazonApi from '../api/amazonApi';

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [skincareProducts, setSkincareProducts] = useState<Product[]>([]);
  const [skincareLoading, setSkincareLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[HOME] Fetching categories for homepage...');
        setLoading(true);
        
        // Fetch categories
        const categoriesRes = await categoriesApi.getCategories();
        setCategories(categoriesRes);
        console.log('[HOME] Categories fetched:', categoriesRes.length);
        
      } catch (error: any) {
        console.error('[HOME] ❌ Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
        console.log('[HOME] ✅ Categories loading complete');
      }
    };

    fetchData();
  }, []);

  // Use the same static skincare products data from Skincare page
  // Load immediately on mount - no async needed
  useEffect(() => {
    console.log('[HOME] ========== LOADING SKINCARE PRODUCTS FROM STATIC DATA ==========');
    
    // Exact products to display (matching user's specified list)
    const featuredProductASINs = [
      'B0FXTGD7LC', // Dr.Melaxin Peel Shot Kojic Acid Turmeric Serum
      'B0G26XC6KT', // Dr.Althea PDRN Reju 5000 Cream
      'B0DMT1CJ2Q', // Head & Shoulders Anti-Dandruff Shampoo BARE
      'B0FX39VLRL', // Saltair Hyaluronic Acid Body Serum
      'B0F6TS5HVH', // grace & stella Hypochlorous Acid Spray
      'B0GD12FCYQ', // Lash Serum for Eyelashes & Eyebrows
      'B0FRLXNTB2', // eos Cashmere Body Mist
      'B0FWKX1QMC', // L'Oreal Elvive Glycolic + Gloss Hair Serum
      'B0FVXPLCKX', // Wavytalk Steam Hair Straightener
      'B0FVBFHLHW', // VFD 30X/1X Makeup Mirror with Lights
      'B0DZ2M8BNF', // NYX Buttermelt Highlighter
      'B0FSSPR9C1', // L'Oreal Paris Extensionist Mascara
      'B0FJNDCRB8', // COVERGIRL TruBlend Skin Enhancer Blush - Rose Latte
      'B0G1H1NQY8', // e.l.f. Glow Reviver Slipstick - Jam Packed
    ];
    
    // Filter to only include the specified products, maintaining order
    const featuredProducts = featuredProductASINs
      .map(asin => ALL_SKINCARE_PRODUCTS.find(item => item.asin === asin))
      .filter((item): item is typeof ALL_SKINCARE_PRODUCTS[0] => item !== undefined);
    
    // Convert static skincare products to Product format for ProductCard
    const convertedProducts: Product[] = featuredProducts.map((item) => ({
      id: item.id,
      name: item.title,
      slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: `${item.title} - Premium skincare product.`,
      price: 29.99, // Default price - can be customized
      stock: 100,
      featured: true,
      images: [item.image],
      categoryId: 'skincare', // Placeholder category ID
    }));
    
    // Set products and loading state together
    setSkincareProducts(convertedProducts);
    setSkincareLoading(false);
    console.log('[HOME] ✅ Loaded', convertedProducts.length, 'featured skincare products from static data');
  }, []);

  // Log rendering state for debugging
  console.log('[HOME RENDER] ========== RENDERING HOME PAGE ==========');
  console.log('[HOME RENDER] Loading:', loading);
  console.log('[HOME RENDER] Categories:', categories.length);
  console.log('[HOME RENDER] Skincare Products:', skincareProducts.length);
  console.log('[HOME RENDER] Skincare Loading:', skincareLoading);

  // Don't block entire page render for categories - show content even if categories are loading
  // Only show loader if BOTH categories AND skincare are loading (shouldn't happen with static data)
  if (loading && skincareLoading && skincareProducts.length === 0) {
    console.log('[HOME RENDER] Showing loader...');
    return <Loader />;
  }

  return (
    <div className={styles.home}>
      {/* Hero Banner Section - Single Image */}
      <section className={styles.heroSection}>
        <div 
          className={styles.heroBanner}
          style={{ backgroundImage: `url(/images/edition-banner.png)` }}
        >
          {/* CRT TV Overlay */}
          <div className={styles.crtOverlay}></div>
          
          {/* Finger Smoothing Overlay */}
          <div className={styles.fingerSmoothOverlay}></div>
          
          {/* Cloud Overlay */}
          <div className={styles.cloudOverlay}></div>
          
          {/* Grain Overlay - Subtle film grain texture */}
          <div className={styles.grainOverlay}></div>
          
          {/* Brand Name Overlay */}
          <div className={styles.brandName}>
            <h1 className={styles.brandTitle}>AURAPOP</h1>
            <p className={styles.brandSubline}>Tori Edition</p>
          </div>
        </div>
      </section>

      {/* Featured Skincare Section - DIRECTLY UNDER BANNER - NO GAPS */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>featured skincare</h2>
          {skincareLoading && skincareProducts.length === 0 ? (
            <div className={styles.productsGrid}>
              <p className={styles.loadingMessage}>Loading skincare products...</p>
            </div>
          ) : skincareProducts.length > 0 ? (
            <div className={styles.productsGrid}>
              {skincareProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.productsGrid}>
              <p className={styles.loadingMessage}>No skincare products found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Cloud Divider - Between sections (after Featured Skincare) */}
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

      {/* Cloud Divider - Only show at bottom if we have content */}
      {categories.length > 0 && <div className={styles.cloudDivider}></div>}
    </div>
  );
};

export default Home;
