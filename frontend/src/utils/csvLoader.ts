// CSV loader utility for product data
import { Product, transformCSVRow } from '../data/productData';

/**
 * Load and parse CSV file
 * Note: In production, this should fetch from an API endpoint
 * For now, this provides the structure for CSV loading
 */
export const loadProductsFromCSV = async (csvPath: string): Promise<Product[]> => {
  try {
    // In production, fetch CSV from API or static file
    // For now, return empty array - CSV loading should be implemented via API
    const response = await fetch(csvPath);
    if (!response.ok) {
      console.warn('[CSV Loader] Could not load CSV file, using sample data');
      return [];
    }
    
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    const products: Product[] = [];
    
    for (const line of dataLines) {
      // Parse CSV line (handle quoted fields)
      const row = parseCSVLine(line);
      const product = transformCSVRow(row);
      if (product) {
        products.push(product);
      }
    }
    
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
 * Load products from CSV file path
 * Placeholder for actual CSV file location
 */
export const loadProductsFromFile = async (): Promise<Product[]> => {
  // CSV file location: c:\Users\victo\Downloads\simplescraper-www-sephora-com-2026-01-12T19-34-01.csv
  // In production, this should be served via API or placed in public folder
  // For now, return empty array - implement via backend API endpoint
  
  // Example: const csvPath = '/data/products.csv';
  // return loadProductsFromCSV(csvPath);
  
  return [];
};
