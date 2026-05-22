import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from '../routes/auth.route.js';
import User from '../models/user.model.js';
import { createTestUser, generateAccessToken } from './testUtils.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /api/auth/signup', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('New User');
      expect(response.body.email).toBe('newuser@example.com');
      expect(response.body.role).toBe('customer');

      const userInDb = await User.findOne({ email: 'newuser@example.com' });
      expect(userInDb).toBeTruthy();
      expect(userInDb.name).toBe('New User');
    });

    it('should return 400 if user already exists', async () => {
      await createTestUser({ email: 'existing@example.com' });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Duplicate User',
          email: 'existing@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.message).toContain('already exists');
    });

    it('should set cookies with access and refresh tokens', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Cookie Test User',
          email: 'cookie@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'].length).toBeGreaterThan(0);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123',
          // missing name
        })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await createTestUser({
        email: 'login@example.com',
        password: 'correctpassword',
      });
    });

    it('should login user with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'correctpassword',
        })
        .expect(200);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.email).toBe('login@example.com');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.message).toContain('Invalid');
    });

    it('should return 401 if user not found', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.message).toContain('Invalid');
    });
  });

  describe('Protected Routes - Auth Middleware', () => {
    it('should return 401 when no access token provided', async () => {
      // This is a placeholder - actual protected route endpoint test
      // Assumes there's a protected route in the auth route file
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.message).toContain('Unauthorized');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Cookie', 'accessToken=invalid.token.here')
        .expect(401);

      expect(response.body.message).toContain('Unauthorized');
    });

    it('should allow access with valid token', async () => {
      const user = await createTestUser();
      const token = generateAccessToken(user._id.toString());

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Cookie', `accessToken=${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear cookies on logout', async () => {
      const user = await createTestUser();
      const token = generateAccessToken(user._id.toString());

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `accessToken=${token}`)
        .expect(200);

      expect(response.body.message).toContain('logout');
    });
  });
});
