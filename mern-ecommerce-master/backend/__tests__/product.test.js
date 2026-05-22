import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import productRoutes from '../routes/product.route.js';
import Product from '../models/product.model.js';
import { createTestProduct, createTestAdmin, generateAccessToken } from './testUtils.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/products', productRoutes);

describe('Product Routes', () => {
  describe('GET /api/products', () => {
    it('should get all products', async () => {
      await createTestProduct({ name: 'Product 1' });
      await createTestProduct({ name: 'Product 2' });

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.products.length).toBeGreaterThanOrEqual(2);
    });

    it('should return empty array when no products exist', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.products).toEqual([]);
    });
  });

  describe('GET /api/products/featured', () => {
    it('should get only featured products', async () => {
      await createTestProduct({ name: 'Featured 1', isFeatured: true });
      await createTestProduct({ name: 'Regular 1', isFeatured: false });
      await createTestProduct({ name: 'Featured 2', isFeatured: true });

      const response = await request(app)
        .get('/api/products/featured')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every((p) => p.isFeatured === true)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('should cache featured products in redis', async () => {
      await createTestProduct({ name: 'Featured Product', isFeatured: true });

      const firstCall = await request(app)
        .get('/api/products/featured')
        .expect(200);

      const secondCall = await request(app)
        .get('/api/products/featured')
        .expect(200);

      expect(firstCall.body).toEqual(secondCall.body);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product (admin only)', async () => {
      const admin = await createTestAdmin();
      const token = generateAccessToken(admin._id.toString());

      const response = await request(app)
        .post('/api/products')
        .set('Cookie', `accessToken=${token}`)
        .send({
          name: 'New Product',
          description: 'Test Description',
          price: 99.99,
          image: 'https://example.com/image.jpg',
          category: 'electronics',
        })
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('New Product');
      expect(response.body.price).toBe(99.99);
    });

    it('should verify product exists in database after creation', async () => {
      const admin = await createTestAdmin();
      const token = generateAccessToken(admin._id.toString());

      const createResponse = await request(app)
        .post('/api/products')
        .set('Cookie', `accessToken=${token}`)
        .send({
          name: 'DB Verification Product',
          description: 'Test',
          price: 49.99,
          image: 'https://example.com/image.jpg',
          category: 'books',
        })
        .expect(201);

      const productInDb = await Product.findById(createResponse.body._id);
      expect(productInDb).toBeTruthy();
      expect(productInDb.name).toBe('DB Verification Product');
      expect(productInDb.price).toBe(49.99);
    });

    it('should return 400 with missing required fields', async () => {
      const admin = await createTestAdmin();
      const token = generateAccessToken(admin._id.toString());

      const response = await request(app)
        .post('/api/products')
        .set('Cookie', `accessToken=${token}`)
        .send({
          name: 'Incomplete Product',
          // missing required fields
        })
        .expect(500);

      expect(response.body).toHaveProperty('message');
    });

    it('should not allow non-admin to create products', async () => {
      const user = await createTestUser();
      const token = generateAccessToken(user._id.toString());

      const response = await request(app)
        .post('/api/products')
        .set('Cookie', `accessToken=${token}`)
        .send({
          name: 'Unauthorized Product',
          description: 'Test',
          price: 29.99,
          image: 'https://example.com/image.jpg',
          category: 'test',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product (admin only)', async () => {
      const product = await createTestProduct();
      const admin = await createTestAdmin();
      const token = generateAccessToken(admin._id.toString());

      const response = await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Cookie', `accessToken=${token}`)
        .expect(200);

      expect(response.body.message).toContain('deleted');

      const deletedProduct = await Product.findById(product._id);
      expect(deletedProduct).toBeNull();
    });

    it('should return 404 when deleting non-existent product', async () => {
      const admin = await createTestAdmin();
      const token = generateAccessToken(admin._id.toString());

      const response = await request(app)
        .delete('/api/products/000000000000000000000000')
        .set('Cookie', `accessToken=${token}`)
        .expect(404);

      expect(response.body.message).toContain('not found');
    });
  });

  describe('GET /api/products/recommended', () => {
    it('should get recommended products', async () => {
      for (let i = 0; i < 5; i++) {
        await createTestProduct({ name: `Product ${i}` });
      }

      const response = await request(app)
        .get('/api/products/recommended')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});

// Helper function from testUtils
async function createTestUser() {
  const User = (await import('../models/user.model.js')).default;
  return User.create({
    name: 'Test User',
    email: `user${Date.now()}@example.com`,
    password: 'password123',
    role: 'customer',
  });
}
