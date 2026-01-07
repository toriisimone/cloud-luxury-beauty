import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/database';
import { generateAccessToken } from '../src/utils/generateTokens';

describe('Orders API', () => {
  let authToken: string;
  let userId: string;
  let productId: string;

  beforeAll(async () => {
    await prisma.$connect();

    // Create test user and get token
    const user = await prisma.user.create({
      data: {
        email: 'order-test@example.com',
        password: 'hashed',
        firstName: 'Test',
        lastName: 'User',
      },
    });
    userId = user.id;
    authToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Get a product for testing
    const product = await prisma.product.findFirst();
    if (product) {
      productId = product.id;
    }
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: 'order-test@example.com' },
    });
    await prisma.$disconnect();
  });

  describe('GET /api/orders', () => {
    it('should require authentication', async () => {
      const response = await request(app).get('/api/orders');

      expect(response.status).toBe(401);
    });

    it('should get user orders when authenticated', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
