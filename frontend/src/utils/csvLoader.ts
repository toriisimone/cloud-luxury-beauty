// CSV loader utility for product data
import { Product, transformCSVRow } from '../data/productData';

/**
 * Load and parse CSV file
 */
export const loadProductsFromCSV = async (csvPath: string): Promise<Product[]> => {
  try {
    const response = await fetch(csvPath);
    if (!response.ok) {
      console.warn('[CSV Loader] Could not load CSV file');
      return [];
    }
    
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    // Skip first two rows (header and ad row)
    const dataLines = lines.slice(2);
    
    const products: Product[] = [];
    
    for (const line of dataLines) {
      if (!line.trim()) continue;
      
      // Parse CSV line (handle quoted fields)
      const row = parseCSVLine(line);
      
      // CSV structure: [css, imageUrl, brand, title, reviewCount, price, ...flags]
      // Skip rows that don't have enough columns or are ads
      if (row.length < 6) continue;
      if (row[1] && row[1].includes('contentimages')) continue; // Skip ad rows
      
      const product = transformCSVRow(row);
      if (product && product.brand && product.title) {
        products.push(product);
      }
    }
    
    console.log(`[CSV Loader] Loaded ${products.length} products`);
    return products;
  } catch (error) {
    console.error('[CSV Loader] Error loading CSV:', error);
    return [];
  }
};

/**
 * Parse a CSV line, handling quoted fields
 */
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

/**
 * Load products from CSV file in public folder
 */
export const loadProductsFromFile = async (): Promise<Product[]> => {
  return loadProductsFromCSV('/products.csv');
};
