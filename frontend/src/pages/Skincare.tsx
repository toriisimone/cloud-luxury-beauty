import { useState } from 'react';
import styles from './Skincare.module.css';

// Static Skincare Products - No API, Just Hardcoded Data
interface SkincareProduct {
  id: string;
  title: string;
  image: string;
  asin: string;
  affiliate: string;
  price?: number;
  productType?: string;
  sizes?: string[];
  bestSeller?: boolean;
}

const ALL_SKINCARE_PRODUCTS: SkincareProduct[] = [
  { id: '51', title: 'Dr.Melaxin Peel Shot Kojic Acid Turmeric Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/71FIL4QFAHL._AC_UL600_SR600,400_.jpg', asin: 'B0FXTGD7LC', affiliate: 'https://www.amazon.com/dp/B0FXTGD7LC/?tag=victoria0cdb-20', price: 24.99, productType: 'Serum', sizes: ['30 ml', '15 ml'], bestSeller: true },
  { id: '52', title: 'Dr.Althea PDRN Reju 5000 Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/419qAvG77UL._AC_UL600_SR600,400_.jpg', asin: 'B0G26XC6KT', affiliate: 'https://www.amazon.com/dp/B0G26XC6KT/?tag=victoria0cdb-20', price: 32.99, productType: 'Cream', sizes: ['50 ml'], bestSeller: true },
  { id: '53', title: 'Head & Shoulders Anti-Dandruff Shampoo BARE', image: 'https://images-na.ssl-images-amazon.com/images/I/71QJ6y6v99L._AC_UL600_SR600,400_.jpg', asin: 'B0DMT1CJ2Q', affiliate: 'https://www.amazon.com/dp/B0DMT1CJ2Q/?tag=victoria0cdb-20', price: 8.99, productType: 'Shampoo', sizes: ['13.5 fl oz'], bestSeller: false },
  { id: '54', title: 'AEEHFENG Timilk ChillErase Bump Renewal Spray', image: 'https://images-na.ssl-images-amazon.com/images/I/71XnLCYLNTL._AC_UL600_SR600,400_.jpg', asin: 'B0GCK5SHXJ', affiliate: 'https://www.amazon.com/dp/B0GCK5SHXJ/?tag=victoria0cdb-20', price: 18.99, productType: 'Spray', sizes: ['100 ml'], bestSeller: false },
  { id: '55', title: 'Lymphatic Contour Face Brush', image: 'https://images-na.ssl-images-amazon.com/images/I/71j6xfG0fkL._AC_UL600_SR600,400_.jpg', asin: 'B0FYVG98GM', affiliate: 'https://www.amazon.com/dp/B0FYVG98GM/?tag=victoria0cdb-20', price: 12.99, productType: 'Tool', sizes: ['1 pc'], bestSeller: true },
  { id: '56', title: 'JODSONE 3-in-1 Cat Eye Magnet Nail Tool', image: 'https://images-na.ssl-images-amazon.com/images/I/61Sjj++alVL._AC_UL600_SR600,400_.jpg', asin: 'B0FX3MP3W2', affiliate: 'https://www.amazon.com/dp/B0FX3MP3W2/?tag=victoria0cdb-20', price: 9.99, productType: 'Tool', sizes: ['1 pc'], bestSeller: false },
  { id: '57', title: 'Native Scalp Detox Shampoo and Conditioner', image: 'https://images-na.ssl-images-amazon.com/images/I/71KXpO6jHwL._AC_UL600_SR600,400_.jpg', asin: 'B0G27P2LGS', affiliate: 'https://www.amazon.com/dp/B0G27P2LGS/?tag=victoria0cdb-20', price: 15.99, productType: 'Set', sizes: ['2 pc'], bestSeller: true },
  { id: '58', title: 'e.l.f. SKIN Bright + Brew-tiful Eye Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/61ax411X7gL._AC_UL600_SR600,400_.jpg', asin: 'B0G1H91LGM', affiliate: 'https://www.amazon.com/dp/B0G1H91LGM/?tag=victoria0cdb-20', price: 10.99, productType: 'Eye Cream', sizes: ['15 ml'], bestSeller: true },
  { id: '59', title: 'Lattafa Asad Elixir EDP', image: 'https://images-na.ssl-images-amazon.com/images/I/51f4XfVZtGL._AC_UL600_SR600,400_.jpg', asin: 'B0FWYPY4FX', affiliate: 'https://www.amazon.com/dp/B0FWYPY4FX/?tag=victoria0cdb-20', price: 22.99, productType: 'Eau de parfum', sizes: ['50 ml', '8 ml'], bestSeller: true },
  { id: '60', title: 'prgislew Nose Hair Trimmer', image: 'https://images-na.ssl-images-amazon.com/images/I/61Fx2TiBpeL._AC_UL600_SR600,400_.jpg', asin: 'B0G18RXVLB', affiliate: 'https://www.amazon.com/dp/B0G18RXVLB/?tag=victoria0cdb-20', price: 7.99, productType: 'Tool', sizes: ['1 pc'], bestSeller: false },
  { id: '61', title: 'Saltair Hyaluronic Acid Body Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/51mZFbRKa+L._AC_UL600_SR600,400_.jpg', asin: 'B0FX39VLRL', affiliate: 'https://www.amazon.com/dp/B0FX39VLRL/?tag=victoria0cdb-20', price: 14.99, productType: 'Body Serum', sizes: ['100 ml'], bestSeller: true },
  { id: '63', title: 'grace & stella Hypochlorous Acid Spray', image: 'https://images-na.ssl-images-amazon.com/images/I/719x7jMja2L._AC_UL600_SR600,400_.jpg', asin: 'B0F6TS5HVH', affiliate: 'https://www.amazon.com/dp/B0F6TS5HVH/?tag=victoria0cdb-20', price: 16.99, productType: 'Spray', sizes: ['120 ml'], bestSeller: false },
  { id: '64', title: 'GODA for Her Perfume and Silk Body Oil', image: 'https://images-na.ssl-images-amazon.com/images/I/61hUIcbOjrL._AC_UL600_SR600,400_.jpg', asin: 'B0G3RN2SC7', affiliate: 'https://www.amazon.com/dp/B0G3RN2SC7/?tag=victoria0cdb-20', price: 28.99, productType: 'Set', sizes: ['2 pc'], bestSeller: true },
  { id: '65', title: 'Vagilelf Demon Mark Tattoos', image: 'https://images-na.ssl-images-amazon.com/images/I/71Bz-a4mo4L._AC_UL600_SR600,400_.jpg', asin: 'B0FVYGZ255', affiliate: 'https://www.amazon.com/dp/B0FVYGZ255/?tag=victoria0cdb-20', price: 6.99, productType: 'Temporary Tattoos', sizes: ['1 sheet'], bestSeller: false },
  { id: '66', title: 'NYX Epic Inky Stix Eyeliner', image: 'https://images-na.ssl-images-amazon.com/images/I/51yUxo+5dHL._AC_UL600_SR600,400_.jpg', asin: 'B0FZCBBVDK', affiliate: 'https://www.amazon.com/dp/B0FZCBBVDK/?tag=victoria0cdb-20', price: 9.99, productType: 'Eyeliner', sizes: ['1 pc'], bestSeller: true },
  { id: '67', title: 'Lash Serum for Eyelashes & Eyebrows', image: 'https://images-na.ssl-images-amazon.com/images/I/61UQjAx4z5L._AC_UL600_SR600,400_.jpg', asin: 'B0GD12FCYQ', affiliate: 'https://www.amazon.com/dp/B0GD12FCYQ/?tag=victoria0cdb-20', price: 19.99, productType: 'Serum', sizes: ['5 ml'], bestSeller: true },
  { id: '68', title: '2 Pcs Texture Comb Set', image: 'https://images-na.ssl-images-amazon.com/images/I/61+6nIreqOL._AC_UL600_SR600,400_.jpg', asin: 'B0G39WCFG2', affiliate: 'https://www.amazon.com/dp/B0G39WCFG2/?tag=victoria0cdb-20', price: 8.99, productType: 'Set', sizes: ['2 pc'], bestSeller: false },
  { id: '69', title: 'eos Cashmere Body Mist', image: 'https://images-na.ssl-images-amazon.com/images/I/61KlSccHHpL._AC_UL600_SR600,400_.jpg', asin: 'B0FRLXNTB2', affiliate: 'https://www.amazon.com/dp/B0FRLXNTB2/?tag=victoria0cdb-20', price: 11.99, productType: 'Body Mist', sizes: ['250 ml'], bestSeller: true },
  { id: '70', title: "L'Oreal Revitalift Triple Power Eye Bag Eraser", image: 'https://images-na.ssl-images-amazon.com/images/I/81RcZcfyRQL._AC_UL600_SR600,400_.jpg', asin: 'B0FXJ4KJZQ', affiliate: 'https://www.amazon.com/dp/B0FXJ4KJZQ/?tag=victoria0cdb-20', price: 18.99, productType: 'Eye Cream', sizes: ['15 ml'], bestSeller: true },
  { id: '71', title: "L'Oreal Elvive Glycolic + Gloss Hair Serum", image: 'https://images-na.ssl-images-amazon.com/images/I/61l15UtTN1L._AC_UL600_SR600,400_.jpg', asin: 'B0FWKX1QMC', affiliate: 'https://www.amazon.com/dp/B0FWKX1QMC/?tag=victoria0cdb-20', price: 12.99, productType: 'Hair Serum', sizes: ['50 ml'], bestSeller: false },
  { id: '72', title: 'Wavytalk Steam Hair Straightener', image: 'https://images-na.ssl-images-amazon.com/images/I/61-HItePnWL._AC_UL600_SR600,400_.jpg', asin: 'B0FVXPLCKX', affiliate: 'https://www.amazon.com/dp/B0FVXPLCKX/?tag=victoria0cdb-20', price: 29.99, productType: 'Tool', sizes: ['1 pc'], bestSeller: true },
  { id: '73', title: 'Prequel Skin Retinaldehyde 0.1%', image: 'https://images-na.ssl-images-amazon.com/images/I/614XaVcFu8L._AC_UL600_SR600,400_.jpg', asin: 'B0FY36QKW8', affiliate: 'https://www.amazon.com/dp/B0FY36QKW8/?tag=victoria0cdb-20', price: 26.99, productType: 'Serum', sizes: ['30 ml'], bestSeller: true },
  { id: '74', title: 'Callus Remover for Feet Electric Foot File', image: 'https://images-na.ssl-images-amazon.com/images/I/71foQ8cpEeL._AC_UL600_SR600,400_.jpg', asin: 'B0FVSVVTQK', affiliate: 'https://www.amazon.com/dp/B0FVSVVTQK/?tag=victoria0cdb-20', price: 19.99, productType: 'Tool', sizes: ['1 pc'], bestSeller: false },
  { id: '75', title: 'COSRX Advanced Pure Vitamin C 23% Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/71LzZAsVE+L._AC_UL600_SR600,400_.jpg', asin: 'B0FWQGLTQV', affiliate: 'https://www.amazon.com/dp/B0FWQGLTQV/?tag=victoria0cdb-20', price: 24.99, productType: 'Serum', sizes: ['30 ml'], bestSeller: true },
  { id: '76', title: 'Kitsch Strengthening Rice Water Protein Shampoo', image: 'https://images-na.ssl-images-amazon.com/images/I/71Ng-h0FaTL._AC_UL600_SR600,400_.jpg', asin: 'B0FWDDN77G', affiliate: 'https://www.amazon.com/dp/B0FWDDN77G/?tag=victoria0cdb-20', price: 13.99, productType: 'Shampoo', sizes: ['250 ml'], bestSeller: true },
  { id: '77', title: 'Jawline Shaper Chin Strap', image: 'https://images-na.ssl-images-amazon.com/images/I/61ADwFfmABL._AC_UL600_SR600,400_.jpg', asin: 'B0FNQSMFTN', affiliate: 'https://www.amazon.com/dp/B0FNQSMFTN/?tag=victoria0cdb-20', price: 14.99, productType: 'Tool', sizes: ['1 pc'], bestSeller: false },
  { id: '78', title: 'Lymphatic Contour Face Brush', image: 'https://images-na.ssl-images-amazon.com/images/I/61PoCKMjBSL._AC_UL600_SR600,400_.jpg', asin: 'B0FXTTV4NV', affiliate: 'https://www.amazon.com/dp/B0FXTTV4NV/?tag=victoria0cdb-20', price: 12.99, productType: 'Tool', sizes: ['1 pc'], bestSeller: true },
  { id: '79', title: 'e.l.f. Soft Glam Brightening Corrector', image: 'https://images-na.ssl-images-amazon.com/images/I/61je2LPc2qL._AC_UL600_SR600,400_.jpg', asin: 'B0G1H283LW', affiliate: 'https://www.amazon.com/dp/B0G1H283LW/?tag=victoria0cdb-20', price: 7.99, productType: 'Corrector', sizes: ['1 pc'], bestSeller: true },
  { id: '80', title: 'Dove Holiday Treats Body Wash', image: 'https://images-na.ssl-images-amazon.com/images/I/61-fcISkgLL._AC_UL600_SR600,400_.jpg', asin: 'B0CNZ5YLVB', affiliate: 'https://www.amazon.com/dp/B0CNZ5YLVB/?tag=victoria0cdb-20', price: 6.99, productType: 'Body Wash', sizes: ['22 fl oz'], bestSeller: false },
  { id: '81', title: 'Pnctho Lymphatic Contour Face Brush', image: 'https://images-na.ssl-images-amazon.com/images/I/71yxHDsJMaL._AC_UL300_SR300,200_.jpg', asin: 'B0G356ZQ9T', affiliate: 'https://www.amazon.com/dp/B0G356ZQ9T/?tag=victoria0cdb-20', price: 11.99, productType: 'Tool', sizes: ['1 pc'], bestSeller: true },
  { id: '82', title: 'GLORENDA Moringa 10-in-1 Nano Microdarts Patch', image: 'https://images-na.ssl-images-amazon.com/images/I/81g4ijxiCiL._AC_UL300_SR300,200_.jpg', asin: 'B0GD7N2VT3', affiliate: 'https://www.amazon.com/dp/B0GD7N2VT3/?tag=victoria0cdb-20', price: 19.99, productType: 'Patch Set', sizes: ['30 patches'], bestSeller: true },
  { id: '83', title: 'QUIA Toner Pads – PHA Dual-Action', image: 'https://images-na.ssl-images-amazon.com/images/I/712b1iTUJ6L._AC_UL300_SR300,200_.jpg', asin: 'B0G4JQ5M69', affiliate: 'https://www.amazon.com/dp/B0G4JQ5M69/?tag=victoria0cdb-20', price: 16.99, productType: 'Toner Pads', sizes: ['60 pads'], bestSeller: true },
  { id: '84', title: 'Maybelline Lifter Plump & Glow Foundation', image: 'https://images-na.ssl-images-amazon.com/images/I/61K1pEfOFCL._AC_UL300_SR300,200_.jpg', asin: 'B0FYGYPK8Q', affiliate: 'https://www.amazon.com/dp/B0FYGYPK8Q/?tag=victoria0cdb-20', price: 10.99, productType: 'Foundation', sizes: ['1 pc'], bestSeller: true },
  { id: '85', title: 'CeraVe Oil Control Balancing Conditioner', image: 'https://images-na.ssl-images-amazon.com/images/I/618J60UJc8L._AC_UL300_SR300,200_.jpg', asin: 'B0FWVND3JL', affiliate: 'https://www.amazon.com/dp/B0FWVND3JL/?tag=victoria0cdb-20', price: 9.99, productType: 'Conditioner', sizes: ['13 fl oz'], bestSeller: false },
  { id: '86', title: 'Lattafa Yara Elixir Eau De Parfum', image: 'https://images-na.ssl-images-amazon.com/images/I/51cJib0GC2L._AC_UL300_SR300,200_.jpg', asin: 'B0FY7HQYDD', affiliate: 'https://www.amazon.com/dp/B0FY7HQYDD/?tag=victoria0cdb-20', price: 24.99, productType: 'Eau de parfum', sizes: ['50 ml', '8 ml'], bestSeller: true },
  { id: '87', title: 'Old Spice Aluminum Free Deodorant', image: 'https://images-na.ssl-images-amazon.com/images/I/71zeAWByUuL._AC_UL300_SR300,200_.jpg', asin: 'B0FXY83ZC1', affiliate: 'https://www.amazon.com/dp/B0FXY83ZC1/?tag=victoria0cdb-20', price: 5.99, productType: 'Deodorant', sizes: ['2.7 oz'], bestSeller: false },
  { id: '88', title: 'Brush Pro Portable Straightener', image: 'https://images-na.ssl-images-amazon.com/images/I/61Jze2dHszL._AC_UL300_SR300,200_.jpg', asin: 'B0G52WQ17K', affiliate: 'https://www.amazon.com/dp/B0G52WQ17K/?tag=victoria0cdb-20', price: 24.99, productType: 'Tool', sizes: ['1 pc'], bestSeller: true },
  { id: '89', title: 'W3W 4D Dual-Ended Brow Pen', image: 'https://images-na.ssl-images-amazon.com/images/I/71myRYqUD3L._AC_UL300_SR300,200_.jpg', asin: 'B0FZ7Z2CHN', affiliate: 'https://www.amazon.com/dp/B0FZ7Z2CHN/?tag=victoria0cdb-20', price: 8.99, productType: 'Brow Pen', sizes: ['1 pc'], bestSeller: false },
  { id: '90', title: 'The Ordinary Volufiline 92% Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/61D3pKRpxaL._AC_UL300_SR300,200_.jpg', asin: 'B0FYJ4WQ5J', affiliate: 'https://www.amazon.com/dp/B0FYJ4WQ5J/?tag=victoria0cdb-20', price: 28.99, productType: 'Serum', sizes: ['30 ml'], bestSeller: true },
  { id: '91', title: 'CeraVe Invisible Mineral Sunscreen SPF 50', image: 'https://images-na.ssl-images-amazon.com/images/I/61IvJtPa9EL._AC_UL300_SR300,200_.jpg', asin: 'B0FXNHDWM7', affiliate: 'https://www.amazon.com/dp/B0FXNHDWM7/?tag=victoria0cdb-20', price: 14.99, productType: 'Sunscreen', sizes: ['3 fl oz'], bestSeller: true },
  { id: '92', title: 'VFD 30X/1X Makeup Mirror with Lights', image: 'https://images-na.ssl-images-amazon.com/images/I/618O2BajQIL._AC_UL300_SR300,200_.jpg', asin: 'B0FVBFHLHW', affiliate: 'https://www.amazon.com/dp/B0FVBFHLHW/?tag=victoria0cdb-20', price: 19.99, productType: 'Mirror', sizes: ['1 pc'], bestSeller: false },
  { id: '93', title: 'NYX Buttermelt Highlighter', image: 'https://images-na.ssl-images-amazon.com/images/I/81Of4mXdNeL._AC_UL300_SR300,200_.jpg', asin: 'B0DZ2M8BNF', affiliate: 'https://www.amazon.com/dp/B0DZ2M8BNF/?tag=victoria0cdb-20', price: 9.99, productType: 'Highlighter', sizes: ['1 pc'], bestSeller: true },
  { id: '94', title: "L'Oreal Paris Extensionist Mascara", image: 'https://images-na.ssl-images-amazon.com/images/I/61v7CPtyOHL._AC_UL600_SR600,400_.jpg', asin: 'B0FSSPR9C1', affiliate: 'https://www.amazon.com/dp/B0FSSPR9C1/?tag=victoria0cdb-20', price: 11.99, productType: 'Mascara', sizes: ['1 pc'], bestSeller: true },
  { id: '95', title: 'COVERGIRL TruBlend Skin Enhancer Baked Luminous Blush - Rose Latte', image: 'https://images-na.ssl-images-amazon.com/images/I/91ggsrn-rOL._AC_UL600_SR600,400_.jpg', asin: 'B0FJNDCRB8', affiliate: 'https://www.amazon.com/dp/B0FJNDCRB8/?tag=victoria0cdb-20', price: 8.99, productType: 'Blush', sizes: ['1 pc'], bestSeller: false },
  { id: '96', title: 'e.l.f. Glow Reviver Slipstick - Jam Packed', image: 'https://images-na.ssl-images-amazon.com/images/I/51zSzhrA4kL._AC_UL600_SR600,400_.jpg', asin: 'B0G1H1NQY8', affiliate: 'https://www.amazon.com/dp/B0G1H1NQY8/?tag=victoria0cdb-20', price: 6.99, productType: 'Lipstick', sizes: ['1 pc'], bestSeller: true },
  { id: '97', title: 'e.l.f. Soft Glam Satin Concealer - 11 Fair Neutral', image: 'https://images-na.ssl-images-amazon.com/images/I/61XalxRHccL._AC_UL600_SR600,400_.jpg', asin: 'B0G1GX6553', affiliate: 'https://www.amazon.com/dp/B0G1GX6553/?tag=victoria0cdb-20', price: 7.99, productType: 'Concealer', sizes: ['1 pc'], bestSeller: true },
  { id: '98', title: 'eos Cashmere Body Mist - Vanilla Cashmere', image: 'https://images-na.ssl-images-amazon.com/images/I/61SgurHlDNL._AC_UL600_SR600,400_.jpg', asin: 'B0FM2CCBS1', affiliate: 'https://www.amazon.com/dp/B0FM2CCBS1/?tag=victoria0cdb-20', price: 10.99, productType: 'Body Mist', sizes: ['250 ml'], bestSeller: false },
  { id: '99', title: 'Kitsch Smoothing Air Dry Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/61GarWNvoqL._AC_UL600_SR600,400_.jpg', asin: 'B0FXY2143T', affiliate: 'https://www.amazon.com/dp/B0FXY2143T/?tag=victoria0cdb-20', price: 16.99, productType: 'Hair Cream', sizes: ['100 ml'], bestSeller: true },
  { id: '100', title: '12 Colors Nail Art Pens for Kids', image: 'https://images-na.ssl-images-amazon.com/images/I/713LPc3+gGL._AC_UL600_SR600,400_.jpg', asin: 'B0G64QC663', affiliate: 'https://www.amazon.com/dp/B0G64QC663/?tag=victoria0cdb-20', price: 9.99, productType: 'Set', sizes: ['12 pc'], bestSeller: false },
  { id: '101', title: 'Good Molecules 10% Azelaic Acid Treatment', image: 'https://images-na.ssl-images-amazon.com/images/I/71G7NaZS5zL._AC_UL600_SR600,400_.jpg', asin: 'B0FZPGQHFB', affiliate: 'https://www.amazon.com/dp/B0FZPGQHFB/?tag=victoria0cdb-20', price: 12.99, productType: 'Treatment', sizes: ['30 ml'], bestSeller: true },
  { id: '102', title: 'grace & stella Under Eye Brightener', image: 'https://images-na.ssl-images-amazon.com/images/I/71mlFjZrQOL._AC_UL600_SR600,400_.jpg', asin: 'B0FJSNWNLW', affiliate: 'https://www.amazon.com/dp/B0FJSNWNLW/?tag=victoria0cdb-20', price: 18.99, productType: 'Eye Treatment', sizes: ['15 ml'], bestSeller: true },
  { id: '103', title: 'CeraVe Oil Control Balancing Shampoo', image: 'https://images-na.ssl-images-amazon.com/images/I/61xpexCVd5L._AC_UL600_SR600,400_.jpg', asin: 'B0FWVCMG63', affiliate: 'https://www.amazon.com/dp/B0FWVCMG63/?tag=victoria0cdb-20', price: 10.99, productType: 'Shampoo', sizes: ['13 fl oz'], bestSeller: false },
  { id: '104', title: 'Maybelline Lash Sensational Mascara', image: 'https://images-na.ssl-images-amazon.com/images/I/61GCXflKQ2L._AC_UL600_SR600,400_.jpg', asin: 'B0FR79HZN8', affiliate: 'https://www.amazon.com/dp/B0FR79HZN8/?tag=victoria0cdb-20', price: 9.99, productType: 'Mascara', sizes: ['1 pc'], bestSeller: true },
  { id: '105', title: 'SKIN1004 Madagascar Centella Hyalu-Cica Sun Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/51kdu8RqmJL._AC_UL600_SR600,400_.jpg', asin: 'B0FXH5LHN8', affiliate: 'https://www.amazon.com/dp/B0FXH5LHN8/?tag=victoria0cdb-20', price: 20.99, productType: 'Serum', sizes: ['50 ml'], bestSeller: true },
  { id: '106', title: 'e.l.f. Liquid Velvet Eyeshadow - Beige & Boujee', image: 'https://images-na.ssl-images-amazon.com/images/I/61cXL3Wmo2L._AC_UL600_SR600,400_.jpg', asin: 'B0FWVJB2X4', affiliate: 'https://www.amazon.com/dp/B0FWVJB2X4/?tag=victoria0cdb-20', price: 7.99, productType: 'Eyeshadow', sizes: ['1 pc'], bestSeller: false },
  { id: '107', title: 'Vaseline Lip Therapy Original Mini (2 Pack)', image: 'https://images-na.ssl-images-amazon.com/images/I/71g00fNyzZL._AC_UL600_SR600,400_.jpg', asin: 'B0BBPS73TD', affiliate: 'https://www.amazon.com/dp/B0BBPS73TD/?tag=victoria0cdb-20', price: 4.99, productType: 'Lip Balm', sizes: ['2 pc'], bestSeller: true },
  { id: '108', title: 'Native Sea Salt & Cedar Deodorant Twin Pack', image: 'https://images-na.ssl-images-amazon.com/images/I/813uNLayYAL._AC_UL600_SR600,400_.jpg', asin: 'B0G21YW6ZJ', affiliate: 'https://www.amazon.com/dp/B0G21YW6ZJ/?tag=victoria0cdb-20', price: 13.99, productType: 'Deodorant', sizes: ['2 pc'], bestSeller: false },
  { id: '109', title: 'Luxe Research Color Changing Foundation', image: 'https://images-na.ssl-images-amazon.com/images/I/31wl6yCe+ML._AC_UL600_SR600,400_.jpg', asin: 'B0G1VBDXYF', affiliate: 'https://www.amazon.com/dp/B0G1VBDXYF/?tag=victoria0cdb-20', price: 24.99, productType: 'Foundation', sizes: ['1 pc'], bestSeller: true },
  { id: '110', title: 'Arencia Vitamin C Booster Shot Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/51CF4EwEADL._AC_UL600_SR600,400_.jpg', asin: 'B0FX418XT8', affiliate: 'https://www.amazon.com/dp/B0FX418XT8/?tag=victoria0cdb-20', price: 22.99, productType: 'Serum', sizes: ['30 ml'], bestSeller: true },
  { id: '111', title: 'The Ordinary PHA 5% Exfoliating Lip Serum', image: 'https://images-na.ssl-images-amazon.com/images/I/51fVADUAOiL._AC_UL600_SR600,400_.jpg', asin: 'B0FTZCWGSK', affiliate: 'https://www.amazon.com/dp/B0FTZCWGSK/?tag=victoria0cdb-20', price: 9.99, productType: 'Lip Serum', sizes: ['15 ml'], bestSeller: false },
  { id: '112', title: 'Prime Prometics Color Changing Foundation', image: 'https://images-na.ssl-images-amazon.com/images/I/41Hgs+Kcp5L._AC_UL600_SR600,400_.jpg', asin: 'B0G1T61T7X', affiliate: 'https://www.amazon.com/dp/B0G1T61T7X/?tag=victoria0cdb-20', price: 26.99, productType: 'Foundation', sizes: ['1 pc'], bestSeller: true },
  { id: '113', title: 'Pantene Abundant & Strong 3-Piece Regimen', image: 'https://images-na.ssl-images-amazon.com/images/I/71FNsx-D3jL._AC_UL600_SR600,400_.jpg', asin: 'B0FNF6MLT4', affiliate: 'https://www.amazon.com/dp/B0FNF6MLT4/?tag=victoria0cdb-20', price: 18.99, productType: 'Set', sizes: ['3 pc'], bestSeller: true },
  { id: '114', title: 'Aluminum Free Deodorant for Women – Natural Magnesium Formula', image: 'https://images-na.ssl-images-amazon.com/images/I/71e2fRoCp-L._AC_UL600_SR600,400_.jpg', asin: 'B0FX3D4WTL', affiliate: 'https://www.amazon.com/dp/B0FX3D4WTL/?tag=victoria0cdb-20', price: 12.99, productType: 'Deodorant', sizes: ['2.7 oz'], bestSeller: false },
  { id: '115', title: 'Lash Serum – Natural & Vegan Eyelash Growth Serum (5ml)', image: 'https://images-na.ssl-images-amazon.com/images/I/71lvmkXKdVL._AC_UL600_SR600,400_.jpg', asin: 'B0G4QPDJ1J', affiliate: 'https://www.amazon.com/dp/B0G4QPDJ1J/?tag=victoria0cdb-20', price: 19.99, productType: 'Serum', sizes: ['5 ml'], bestSeller: true },
  { id: '116', title: "L'Oreal Paris Lumi Bronze Le Stick Soleil Bronzer Stick", image: 'https://images-na.ssl-images-amazon.com/images/I/71gK3GfEcGL._AC_UL600_SR600,400_.jpg', asin: 'B0FTQFVVC4', affiliate: 'https://www.amazon.com/dp/B0FTQFVVC4/?tag=victoria0cdb-20', price: 14.99, productType: 'Bronzer', sizes: ['1 pc'], bestSeller: false },
  { id: '117', title: 'Kitsch Scalp Renewal Brush – Terracotta', image: 'https://images-na.ssl-images-amazon.com/images/I/71afRpbMYDL._AC_UL600_SR600,400_.jpg', asin: 'B0FWRZFG42', affiliate: 'https://www.amazon.com/dp/B0FWRZFG42/?tag=victoria0cdb-20', price: 11.99, productType: 'Tool', sizes: ['1 pc'], bestSeller: true },
  { id: '118', title: 'Prime Prometics Instant Coverage Hairline Powder – Brunette', image: 'https://images-na.ssl-images-amazon.com/images/I/51P15OCqYNL._AC_UL600_SR600,400_.jpg', asin: 'B0G3Y86V86', affiliate: 'https://www.amazon.com/dp/B0G3Y86V86/?tag=victoria0cdb-20', price: 16.99, productType: 'Hair Powder', sizes: ['1 pc'], bestSeller: false },
  { id: '119', title: 'Dark Spot Remover for Face – Niacinamide + Vitamin C', image: 'https://images-na.ssl-images-amazon.com/images/I/71R-4nq0l6L._AC_UL600_SR600,400_.jpg', asin: 'B0G8Z9C3F4', affiliate: 'https://www.amazon.com/dp/B0G8Z9C3F4/?tag=victoria0cdb-20', price: 18.99, productType: 'Treatment', sizes: ['30 ml'], bestSeller: true },
  { id: '120', title: 'Goodnites Skin Tag Remover – Salicylic Acid Formula', image: 'https://images-na.ssl-images-amazon.com/images/I/71zr0yVB-EL._AC_UL600_SR600,400_.jpg', asin: 'B0GC5265RQ', affiliate: 'https://www.amazon.com/dp/B0GC5265RQ/?tag=victoria0cdb-20', price: 14.99, productType: 'Treatment', sizes: ['15 ml'], bestSeller: false },
  { id: '121', title: 'Pantene Daily Moisture Renewal Shampoo – 27.7 fl oz', image: 'https://images-na.ssl-images-amazon.com/images/I/61E3UJ38BlL._AC_UL600_SR600,400_.jpg', asin: 'B09XVP8Z66', affiliate: 'https://www.amazon.com/dp/B09XVP8Z66/?tag=victoria0cdb-20', price: 7.99, productType: 'Shampoo', sizes: ['27.7 fl oz'], bestSeller: false },
  { id: '122', title: 'e.l.f. Halo Glow Silky Powder Highlighter – Blush Money', image: 'https://images-na.ssl-images-amazon.com/images/I/817F4yoRsQL._AC_UL600_SR600,400_.jpg', asin: 'B0G1H24GPP', affiliate: 'https://www.amazon.com/dp/B0G1H24GPP/?tag=victoria0cdb-20', price: 9.99, productType: 'Highlighter', sizes: ['1 pc'], bestSeller: true },
  { id: '123', title: 'opasyo Portable Mini Refillable Perfume Atomizer (4 Pack)', image: 'https://images-na.ssl-images-amazon.com/images/I/71lcoh3x-bL._AC_UL600_SR600,400_.jpg', asin: 'B0FVXG2DYR', affiliate: 'https://www.amazon.com/dp/B0FVXG2DYR/?tag=victoria0cdb-20', price: 12.99, productType: 'Set', sizes: ['4 pc'], bestSeller: false },
  { id: '124', title: 'TLOPA GLORENDA 10-in-1 Nano Microdarts Patch (3 Boxes)', image: 'https://images-na.ssl-images-amazon.com/images/I/71QqT9cgtTL._AC_UL300_SR300,200_.jpg', asin: 'B0GD1SHK9K', affiliate: 'https://www.amazon.com/dp/B0GD1SHK9K/?tag=victoria0cdb-20', price: 24.99, productType: 'Patch Set', sizes: ['3 boxes'], bestSeller: true },
  { id: '125', title: 'MIVZO 2-in-1 Nasal Hair Cutter (5 Pack)', image: 'https://images-na.ssl-images-amazon.com/images/I/61lM4L3pvsL._AC_UL300_SR300,200_.jpg', asin: 'B0FY5YVHGG', affiliate: 'https://www.amazon.com/dp/B0FY5YVHGG/?tag=victoria0cdb-20', price: 8.99, productType: 'Tool', sizes: ['5 pc'], bestSeller: false },
  { id: '126', title: 'Maybelline Lifter Serum Concealer – Shade 20', image: 'https://images-na.ssl-images-amazon.com/images/I/61xdpJi3puL._AC_UL300_SR300,200_.jpg', asin: 'B0FYH1RLGX', affiliate: 'https://www.amazon.com/dp/B0FYH1RLGX/?tag=victoria0cdb-20', price: 10.99, productType: 'Concealer', sizes: ['1 pc'], bestSeller: true },
  { id: '127', title: 'Vaseline Lip Therapy Rosy Lips Mini (2 Pack)', image: 'https://images-na.ssl-images-amazon.com/images/I/71VK+1AOolL._AC_UL300_SR300,200_.jpg', asin: 'B0BBWCZLYY', affiliate: 'https://www.amazon.com/dp/B0BBWCZLYY/?tag=victoria0cdb-20', price: 4.99, productType: 'Lip Balm', sizes: ['2 pc'], bestSeller: false },
  { id: '128', title: "L'Oreal Paris Hyaluron Tint Lip Stain Serum – 635 Worth It", image: 'https://images-na.ssl-images-amazon.com/images/I/71aek+v3M+L._AC_UL300_SR300,200_.jpg', asin: 'B0G14ZCSTY', affiliate: 'https://www.amazon.com/dp/B0G14ZCSTY/?tag=victoria0cdb-20', price: 11.99, productType: 'Lip Stain', sizes: ['1 pc'], bestSeller: true },
  { id: '129', title: 'Vaseline Lip Balm Mini – Cocoa Butter (2 Pack)', image: 'https://images-na.ssl-images-amazon.com/images/I/71VkTYtlzdL._AC_UL300_SR300,200_.jpg', asin: 'B0F5HTSWW3', affiliate: 'https://www.amazon.com/dp/B0F5HTSWW3/?tag=victoria0cdb-20', price: 4.99, productType: 'Lip Balm', sizes: ['2 pc'], bestSeller: false },
  { id: '130', title: 'Dove Indulge Body Wash – Warm Vanilla + Sweet Cream', image: 'https://images-na.ssl-images-amazon.com/images/I/71F5PKokeRL._AC_UL300_SR300,200_.jpg', asin: 'B0FKHKQ6FF', affiliate: 'https://www.amazon.com/dp/B0FKHKQ6FF/?tag=victoria0cdb-20', price: 6.99, productType: 'Body Wash', sizes: ['22 fl oz'], bestSeller: false },
  { id: '131', title: 'NYX Jelly Job Lip Gloss – Toast N\' Jelly', image: 'https://images-na.ssl-images-amazon.com/images/I/71RfuEgUMxL._AC_UL300_SR300,200_.jpg', asin: 'B0FWS4BS5X', affiliate: 'https://www.amazon.com/dp/B0FWS4BS5X/?tag=victoria0cdb-20', price: 7.99, productType: 'Lip Gloss', sizes: ['1 pc'], bestSeller: true },
  { id: '132', title: "L'Oreal Paris Elvive Glycolic + Gloss Shampoo & Conditioner Set", image: 'https://images-na.ssl-images-amazon.com/images/I/71hK1KIqidL._AC_UL300_SR300,200_.jpg', asin: 'B0G5BL3WZJ', affiliate: 'https://www.amazon.com/dp/B0G5BL3WZJ/?tag=victoria0cdb-20', price: 16.99, productType: 'Set', sizes: ['2 pc'], bestSeller: true },
  { id: '133', title: 'e.l.f. Glow Reviver Plumping Lip Oil – Piggy Bank', image: 'https://images-na.ssl-images-amazon.com/images/I/61HS5aqmDqL._AC_UL300_SR300,200_.jpg', asin: 'B0FPMHTKCN', affiliate: 'https://www.amazon.com/dp/B0FPMHTKCN/?tag=victoria0cdb-20', price: 6.99, productType: 'Lip Oil', sizes: ['1 pc'], bestSeller: false },
  { id: '134', title: 'Relief Sun Organic Korean Sunscreen SPF50+ (Rice & Probiotics)', image: 'https://images-na.ssl-images-amazon.com/images/I/61twZTX9VbL._AC_UL300_SR300,200_.jpg', asin: 'B0G4Z5G1NT', affiliate: 'https://www.amazon.com/dp/B0G4Z5G1NT/?tag=victoria0cdb-20', price: 18.99, productType: 'Sunscreen', sizes: ['50 ml'], bestSeller: true },
  { id: '135', title: 'New Lymphatic Contour Face Brush – Ergonomic Skin Fit', image: 'https://images-na.ssl-images-amazon.com/images/I/71VV7C7akFL._AC_UL300_SR300,200_.jpg', asin: 'B0G296S6LG', affiliate: 'https://www.amazon.com/dp/B0G296S6LG/?tag=victoria0cdb-20', price: 13.99, productType: 'Tool', sizes: ['1 pc'], bestSeller: true },
  { id: '136', title: 'COVERGIRL Eye Enhancer Wrap Tubing Mascara – Max Motion Black', image: 'https://images-na.ssl-images-amazon.com/images/I/71-8KuWtftL._AC_UL300_SR300,200_.jpg', asin: 'B0FJMRBTXP', affiliate: 'https://www.amazon.com/dp/B0FJMRBTXP/?tag=victoria0cdb-20', price: 10.99, productType: 'Mascara', sizes: ['1 pc'], bestSeller: false },
  { id: '137', title: 'NYX Wonder Snatch Setting Powder – Cheeky Cherry', image: 'https://images-na.ssl-images-amazon.com/images/I/71fbcYGyMhL._AC_UL300_SR300,200_.jpg', asin: 'B0FWS4GPJ5', affiliate: 'https://www.amazon.com/dp/B0FWS4GPJ5/?tag=victoria0cdb-20', price: 9.99, productType: 'Setting Powder', sizes: ['1 pc'], bestSeller: true },
  { id: '138', title: 'Gold Bond Scented Hand Creams – 4 Pack', image: 'https://images-na.ssl-images-amazon.com/images/I/71HLxa0m40L._AC_UL300_SR300,200_.jpg', asin: 'B0FX5X9579', affiliate: 'https://www.amazon.com/dp/B0FX5X9579/?tag=victoria0cdb-20', price: 12.99, productType: 'Set', sizes: ['4 pc'], bestSeller: false },
  { id: '139', title: 'Anua PDRN Collagen Glow Facial Serum Spray', image: 'https://images-na.ssl-images-amazon.com/images/I/71LQ-32prpL._AC_UL300_SR300,200_.jpg', asin: 'B0FVT77ZLL', affiliate: 'https://www.amazon.com/dp/B0FVT77ZLL/?tag=victoria0cdb-20', price: 22.99, productType: 'Spray', sizes: ['100 ml'], bestSeller: true },
  { id: '140', title: 'Aussie Ultra Wonder Daily Mist Detangler', image: 'https://images-na.ssl-images-amazon.com/images/I/711GWxz7ywL._AC_UL300_SR300,200_.jpg', asin: 'B0FPSXGL5Y', affiliate: 'https://www.amazon.com/dp/B0FPSXGL5Y/?tag=victoria0cdb-20', price: 7.99, productType: 'Hair Mist', sizes: ['250 ml'], bestSeller: false },
  { id: '141', title: 'amika frizz-me-not Hydrating Anti-Frizz Treatment', image: 'https://images-na.ssl-images-amazon.com/images/I/61Uxi1qDGrL._AC_UL300_SR300,200_.jpg', asin: 'B0F6VMGGG3', affiliate: 'https://www.amazon.com/dp/B0F6VMGGG3/?tag=victoria0cdb-20', price: 28.99, productType: 'Hair Treatment', sizes: ['100 ml'], bestSeller: true },
  { id: '142', title: 'Relief Sun Organic Korean Sunscreen SPF50+ (Alternate Variant)', image: 'https://images-na.ssl-images-amazon.com/images/I/61IW-Y5O1YL._AC_UL300_SR300,200_.jpg', asin: 'B0FXBR5T6R', affiliate: 'https://www.amazon.com/dp/B0FXBR5T6R/?tag=victoria0cdb-20', price: 19.99, productType: 'Sunscreen', sizes: ['50 ml'], bestSeller: true },
];

const Skincare = () => {
  const [products] = useState<SkincareProduct[]>(ALL_SKINCARE_PRODUCTS);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'product' | 'grid'>('product');
  const [sortMode, setSortMode] = useState<'featured' | 'price' | 'name'>('featured');
  const [showFilter, setShowFilter] = useState(false);

  const handleBuyOnAmazon = (affiliateUrl: string) => {
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  // Color swatches matching the image
  const colorSwatches = [
    { color: '#F5F5DC', name: 'Off-white' },
    { color: '#8B4513', name: 'Dark brown' },
    { color: '#FFB6C1', name: 'Light pink' },
    { color: '#A0522D', name: 'Reddish-brown' },
    { color: '#D2B48C', name: 'Light brown' },
    { color: '#CD853F', name: 'Orange-brown' },
  ];

  return (
    <div className={styles.skincarePage}>
      <div className={styles.container}>
        {/* Top Toolbar - View, Filter, Sort */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <h2 className={styles.limitedEdition}>LIMITED EDITION</h2>
            <div className={styles.colorSwatches}>
              {colorSwatches.map((swatch, index) => (
                <div
                  key={index}
                  className={styles.swatch}
                  style={{ backgroundColor: swatch.color }}
                  title={swatch.name}
                />
              ))}
            </div>
          </div>
          <div className={styles.toolbarRight}>
            <button 
              className={styles.toolbarButton}
              onClick={() => setViewMode('product')}
            >
              View <span className={styles.highlight}>{viewMode === 'product' ? 'Product' : 'Grid'}</span>
            </button>
            <button 
              className={styles.toolbarButton}
              onClick={() => setShowFilter(!showFilter)}
            >
              Filter <span className={styles.highlight}>(0)</span>
            </button>
            <div className={styles.sortContainer}>
              <button className={styles.toolbarButton}>
                Sort <span className={styles.highlight}>{sortMode === 'featured' ? 'Featured' : sortMode}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add to Bag Buttons Row */}
        <div className={styles.addToBagRow}>
          {products.slice(0, 4).map((product) => (
            <button
              key={product.id}
              className={styles.addToBagButton}
              onClick={() => handleBuyOnAmazon(product.affiliate)}
            >
              Add to bag
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className={styles.grid}>
          {products.map((product) => {
            const selectedSize = selectedSizes[product.id] || (product.sizes && product.sizes[0]) || '';
            return (
              <div key={product.id} className={styles.productCard}>
                {product.bestSeller && (
                  <div className={styles.bestSellerBadge}>Best-seller</div>
                )}
                <div className={styles.imageContainer}>
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className={styles.productImage}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div className={styles.placeholder}>Product Image</div>';
                      }
                    }}
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.title}</h3>
                  <p className={styles.productType}>{product.productType || 'Skincare'}</p>
                  <p className={styles.productPrice}>${product.price?.toFixed(2) || 'N/A'}</p>
                  {product.sizes && product.sizes.length > 0 && (
                    <div className={styles.sizeOptions}>
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          className={`${styles.sizeButton} ${selectedSize === size ? styles.sizeActive : ''}`}
                          onClick={() => handleSizeSelect(product.id, size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Skincare;
