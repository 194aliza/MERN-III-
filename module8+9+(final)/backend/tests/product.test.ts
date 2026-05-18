import request from 'supertest';
import express from 'express';
import { Product } from '../src/models/product.js';
import { User } from '../src/models/User.js';
import productRoutes from '../src/routes/productRoutes.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/v1/products', productRoutes);

describe('Product Routes - CRUD Operations', () => {
  let adminToken: string;
  let userId: string;

  beforeEach(async () => {
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const user = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    userId = user._id.toString();
    adminToken = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test-secret', {
      expiresIn: '7d',
    });
  });

  describe('GET /api/v1/products', () => {
    it('should fetch all products', async () => {
      // Create sample products
      await Product.create([
        {
          name: 'Product 1',
          price: 100,
          description: 'Test product 1',
          stock: 10,
        },
        {
          name: 'Product 2',
          price: 200,
          description: 'Test product 2',
          stock: 20,
        },
      ]);

      const res = await request(app).get('/api/v1/products');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data || res.body)).toBe(true);
      expect((res.body.data || res.body).length).toBe(2);
    });

    it('should return empty array when no products exist', async () => {
      const res = await request(app).get('/api/v1/products');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data || res.body)).toBe(true);
    });
  });

  describe('POST /api/v1/products (CREATE)', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'New Product',
        price: 150,
        description: 'A brand new product',
        stock: 50,
        category: 'Electronics',
      };

      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct);

      expect(res.status).toBeOneOf([200, 201]);
      expect(res.body).toHaveProperty('name', 'New Product');
      expect(res.body).toHaveProperty('price', 150);
      expect(res.body).toHaveProperty('stock', 50);
    });

    it('should validate required fields', async () => {
      const incompleteProduct = {
        name: 'Product Without Price',
        // price missing
      };

      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incompleteProduct);

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /api/v1/products/:id (READ)', () => {
    it('should fetch a single product by ID', async () => {
      const product = await Product.create({
        name: 'Fetch Me',
        price: 100,
        description: 'Test fetch product',
        stock: 5,
      });

      const res = await request(app).get(`/api/v1/products/${product._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Fetch Me');
      expect(res.body._id.toString()).toBe(product._id.toString());
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/v1/products/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/v1/products/:id (UPDATE)', () => {
    it('should update a product', async () => {
      const product = await Product.create({
        name: 'Original Name',
        price: 100,
        description: 'Original description',
        stock: 10,
      });

      const res = await request(app)
        .patch(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name', price: 150 });

      expect(res.status).toBeOneOf([200, 204]);
      
      // Verify update
      const updated = await Product.findById(product._id);
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.price).toBe(150);
    });

    it('should return 404 when updating non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .patch(`/api/v1/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/products/:id (DELETE)', () => {
    it('should delete a product', async () => {
      const product = await Product.create({
        name: 'Delete Me',
        price: 100,
        description: 'Test delete product',
        stock: 10,
      });

      const res = await request(app)
        .delete(`/api/v1/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBeOneOf([200, 204]);

      // Verify deletion
      const deleted = await Product.findById(product._id);
      expect(deleted).toBeNull();
    });

    it('should return 404 when deleting non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .delete(`/api/v1/products/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });
});

// Add custom matchers
expect.extend({
  toBeOneOf(received: number, expected: number[]) {
    const pass = expected.includes(received);
    return {
      pass,
      message: () =>
        `expected ${received} to be one of ${expected.join(', ')}`,
    };
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeOneOf(expected: number[]): R;
    }
  }
}
