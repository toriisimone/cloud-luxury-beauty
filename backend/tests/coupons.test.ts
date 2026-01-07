import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/database';

describe('Coupons API', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/coupons', () => {
    it('should get all active coupons', async () => {
      const response = await request(app).get('/api/coupons');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/coupons/:code', () => {
    it('should get a coupon by code', async () => {
      const coupon = await prisma.coupon.findFirst({
        where: { active: true },
      });
      if (coupon) {
        const response = await request(app).get(`/api/coupons/${coupon.code}`);

        expect(response.status).toBe(200);
        expect(response.body.code).toBe(coupon.code);
      }
    });
  });
});
