import request from 'supertest';
import express from 'express';
import { User } from '../src/models/User.js';
import authRoutes from '../src/routes/authRoutes.js';
import { asyncHandler } from '../src/utils/asyncHandler.js';
import { errorHandler } from '../src/middleware/errorHandler.js';

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

// Protected route for testing
app.get(
  '/api/v1/protected',
  asyncHandler(async (req: any, res: express.Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    res.json({ message: 'Protected route accessed' });
  })
);

// Error handler middleware
app.use(errorHandler);

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user with valid credentials', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe('test@example.com');
      expect(res.body.name).toBe('Test User');
    });

    it('should return 400 if user already exists', async () => {
      // Create a user first
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
      });

      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Another User',
        email: 'existing@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('already exists');
    });

    it('should validate required fields', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        // email missing
        password: 'password123',
      });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe('test@example.com');
    });

    it('should return 401 with invalid email', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'wrong@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid credentials');
    });

    it('should return 401 with invalid password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid credentials');
    });
  });

  describe('Protected Routes', () => {
    let token: string;

    beforeEach(async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      token = res.body.token;
    });

    it('should return 401 when no token provided', async () => {
      const res = await request(app).get('/api/v1/protected');

      expect(res.status).toBe(401);
    });

    it('should access protected route with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Protected route accessed');
    });
  });
});
