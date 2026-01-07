import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/database';

describe('Categories API', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/categories', () => {
    it('should get all categories', async () => {
      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should get a single category with products', async () => {
      const category = await prisma.category.findFirst();
      if (category) {
        const response = await request(app).get(`/api/categories/${category.id}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(category.id);
        expect(response.body).toHaveProperty('products');
      }
    });
  });
});
