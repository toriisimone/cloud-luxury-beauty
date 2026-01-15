import fs from 'fs';
import path from 'path';
import prisma from '../config/database';
import { logger } from '../config/logger';

type CoreCategorySlug = 'skincare' | 'makeup' | 'hair' | 'fragrance' | 'body';

interface CsvProductRow {
  imageUrl: string;
  brand: string;
  title: string;
  priceRaw: string;
  flags: string[];
}

const CORE_CATEGORIES: Array<{ name: string; slug: CoreCategorySlug; description: string }> = [
  { name: 'Skincare', slug: 'skincare', description: 'Skincare products for healthy, glowing skin' },
  { name: 'Makeup', slug: 'makeup', description: 'Makeup essentials for face, eyes, lips, and more' },
  { name: 'Hair', slug: 'hair', description: 'Haircare products for every routine' },
  { name: 'Fragrance', slug: 'fragrance', description: 'Perfumes, mists, and fragrance sets' },
  { name: 'Body', slug: 'body', description: 'Body care products and treatments' },
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parsePrice(priceRaw: string): number {
  // examples: "$40.00", "$25.00 - $40.00", "$23.00 - $36.00"
  const matches = priceRaw.match(/[\d.]+/g);
  if (!matches || matches.length === 0) return 0;
  return parseFloat(matches[0]);
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  result.push(current.trim());
  return result;
}

function toRow(cols: string[]): CsvProductRow | null {
  // CSV columns (in this repo): [css?, imageUrl, brand, title, reviewCount, price, flag1, flag2, ...]
  if (cols.length < 6) return null;
  const imageUrl = cols[1] || '';
  const brand = cols[2] || '';
  const title = cols[3] || '';
  const priceRaw = cols[5] || '';
  const flags = cols.slice(6).filter(Boolean);

  if (!brand || !title || !priceRaw) return null;
  // skip non-product/ad rows (contentimages)
  if (imageUrl.includes('contentimages')) return null;
  return { imageUrl, brand, title, priceRaw, flags };
}

function detectCoreCategory(brand: string, title: string, flags: string[]): CoreCategorySlug {
  const s = `${brand} ${title} ${flags.join(' ')}`.toLowerCase();

  // Fragrance
  if (
    s.includes('eau de parfum') ||
    s.includes('eau de toilette') ||
    s.includes('perfume') ||
    s.includes('fragrance') ||
    s.includes('cologne') ||
    s.includes('rollerball') ||
    s.includes('body & hair perfume mist') ||
    s.includes('perfume mist') ||
    s.includes('mist') && s.includes('cheirosa') ||
    s.includes('gift set') && (s.includes('perfume') || s.includes('fragrance'))
  ) {
    return 'fragrance';
  }

  // Hair
  if (
    s.includes('shampoo') ||
    s.includes('conditioner') ||
    s.includes('leave-in') ||
    s.includes('leave in') ||
    s.includes('hair') ||
    s.includes('scalp') ||
    s.includes('heat protect') ||
    s.includes('hair serum') ||
    s.includes('hair mask')
  ) {
    return 'hair';
  }

  // Body
  if (
    s.includes('body cream') ||
    s.includes('body butter') ||
    s.includes('body mousse') ||
    s.includes('body oil') ||
    s.includes('lotion') ||
    s.includes('scrub') ||
    s.includes('deodorant') ||
    s.includes('hand sanitizer') ||
    s.includes('hand') && s.includes('sanitizer')
  ) {
    return 'body';
  }

  // Skincare
  if (
    s.includes('serum') ||
    s.includes('toner') ||
    s.includes('cleanser') ||
    s.includes('moistur') ||
    s.includes('mask') ||
    s.includes('exfol') ||
    s.includes('spf') ||
    s.includes('sunscreen') ||
    s.includes('eye patch') ||
    s.includes('eye cream') ||
    s.includes('face oil') ||
    s.includes('treatment') ||
    s.includes('hydrating') && (s.includes('face') || s.includes('lip treatment'))
  ) {
    return 'skincare';
  }

  // default to Makeup
  return 'makeup';
}

function findCsvPath(): string | null {
  const candidates = [
    // monorepo local dev
    path.join(process.cwd(), 'frontend', 'public', 'products.csv'),
    // if deployed with frontend build output
    path.join(process.cwd(), 'public', 'products.csv'),
    // relative to backend folder
    path.join(process.cwd(), '..', 'frontend', 'public', 'products.csv'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export async function seedCoreCategoriesAndProductsFromCsv(): Promise<{ seededProducts: number; seededCategories: number }> {
  const csvPath = findCsvPath();
  if (!csvPath) {
    logger.warn('[CSV SEED] products.csv not found; skipping CSV seed.');
    return { seededProducts: 0, seededCategories: 0 };
  }

  logger.info(`[CSV SEED] Using CSV path: ${csvPath}`);

  const text = fs.readFileSync(csvPath, 'utf8');
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  // In this CSV, first line is header, second is an ad row; the frontend loader skips 2 rows
  const dataLines = lines.slice(2);

  // Upsert core categories
  const categoryIdBySlug = new Map<CoreCategorySlug, string>();
  for (const cat of CORE_CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });
    categoryIdBySlug.set(cat.slug, category.id);
  }

  let insertedOrUpdated = 0;

  for (const line of dataLines) {
    const cols = parseCsvLine(line);
    const row = toRow(cols);
    if (!row) continue;

    const categorySlug = detectCoreCategory(row.brand, row.title, row.flags);
    const categoryId = categoryIdBySlug.get(categorySlug);
    if (!categoryId) continue;

    const price = parsePrice(row.priceRaw);
    const displayName = `${row.brand} ${row.title}`.trim();
    const slug = slugify(displayName);

    // Upsert by unique slug
    await prisma.product.upsert({
      where: { slug },
      update: {
        name: displayName,
        description: row.title,
        price: price || 0,
        images: row.imageUrl ? [row.imageUrl] : [],
        categoryId,
        featured: row.flags.some((f) => f.toLowerCase().includes('new')),
      },
      create: {
        name: displayName,
        slug,
        description: row.title,
        price: price || 0,
        stock: 100,
        featured: row.flags.some((f) => f.toLowerCase().includes('new')),
        images: row.imageUrl ? [row.imageUrl] : [],
        categoryId,
      },
    });
    insertedOrUpdated++;
  }

  logger.info(`[CSV SEED] ✅ Seeded/upserted products: ${insertedOrUpdated}`);
  logger.info(`[CSV SEED] ✅ Ensured categories: ${CORE_CATEGORIES.length}`);

  return { seededProducts: insertedOrUpdated, seededCategories: CORE_CATEGORIES.length };
}

