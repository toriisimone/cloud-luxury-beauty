import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/database';
import { generateAccessToken } from '../src/utils/generateTokens';

describe('Users API', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    await prisma.$connect();

    const user = await prisma.user.create({
      data: {
        email: 'user-test@example.com',
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
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: 'user-test@example.com' },
    });
    await prisma.$disconnect();
  });

  describe('GET /api/users/profile', () => {
    it('should require authentication', async () => {
      const response = await request(app).get('/api/users/profile');

      expect(response.status).toBe(401);
    });

    it('should get user profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(userId);
    });
  });
});
