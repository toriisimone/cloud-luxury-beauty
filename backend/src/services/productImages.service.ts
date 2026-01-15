import prisma from '../config/database';

export interface BulkProductImageUpdate {
  slug: string;
  images: string[];
}

export interface BulkProductImageUpdateResult {
  slug: string;
  productId?: string;
  updated: boolean;
  reason?: 'NOT_FOUND';
}

export async function bulkUpdateProductImagesBySlug(
  updates: BulkProductImageUpdate[]
): Promise<{ results: BulkProductImageUpdateResult[]; updatedCount: number }> {
  const results: BulkProductImageUpdateResult[] = [];

  // Use an interactive transaction so the bulk update is consistent.
  const txResults = await prisma.$transaction(async (tx) => {
    const inner: BulkProductImageUpdateResult[] = [];
    for (const u of updates) {
      const product = await tx.product.findUnique({
        where: { slug: u.slug },
        select: { id: true },
      });
      if (!product) {
        inner.push({ slug: u.slug, updated: false, reason: 'NOT_FOUND' });
        continue;
      }

      await tx.product.update({
        where: { id: product.id },
        data: { images: u.images },
      });

      inner.push({ slug: u.slug, productId: product.id, updated: true });
    }
    return inner;
  });

  results.push(...txResults);
  const updatedCount = results.filter((r) => r.updated).length;
  return { results, updatedCount };
}

export async function auditNonShopifyImages(limit: number): Promise<{
  nonShopifyCount: number;
  sample: Array<{ id: string; slug: string; name: string; image0: string | null }>;
}> {
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, name: true, images: true },
    orderBy: { createdAt: 'desc' },
  });

  const nonShopify = products
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      image0: p.images?.[0] ?? null,
    }))
    .filter((p) => {
      if (!p.image0) return false;
      const url = p.image0;
      const isShopify =
        url.startsWith('https://cdn.shopify.com/s/files/') ||
        url.startsWith('https://cdn.shopifycdn.net/s/files/');
      return !isShopify;
    });

  return {
    nonShopifyCount: nonShopify.length,
    sample: nonShopify.slice(0, limit),
  };
}

