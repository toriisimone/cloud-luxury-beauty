import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/database';

describe('Products API', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    it('should filter products by category', async () => {
      const categories = await prisma.category.findMany();
      if (categories.length > 0) {
        const response = await request(app).get(
          `/api/products?categoryId=${categories[0].id}`
        );

        expect(response.status).toBe(200);
        expect(response.body.products.every((p: any) => p.categoryId === categories[0].id)).toBe(true);
      }
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get a single product', async () => {
      const product = await prisma.product.findFirst();
      if (product) {
        const response = await request(app).get(`/api/products/${product.id}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(product.id);
      }
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/api/products/non-existent-id');

      expect(response.status).toBe(404);
    });
  });
});
