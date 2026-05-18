import request from 'supertest';
import express from 'express';
import { Order } from '../src/models/order.js';
import { Product } from '../src/models/product.js';
import { User } from '../src/models/User.js';
import orderRoutes from '../src/routes/orderRoutes.js';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../src/middleware/errorHandler.js';

const app = express();
app.use(express.json());

// Mock protect middleware for tests
app.use((req: any, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret') as any;
      req.user = { _id: decoded.id };
    } catch (err) {
      // Token invalid, continue without user
    }
  }
  next();
});

app.use('/api/v1/orders', orderRoutes);

// Error handler middleware
app.use(errorHandler);

describe('Order Routes - Stock Management', () => {
  let userToken: string;
  let userId: string;
  let product: any;

  beforeEach(async () => {
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create user
    const user = await User.create({
      name: 'Customer',
      email: 'customer@example.com',
      password: 'password123',
    });

    userId = user._id.toString();
    userToken = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test-secret', {
      expiresIn: '7d',
    });

    // Create product with stock
    product = await Product.create({
      name: 'Test Product',
      price: 100,
      description: 'Test product for orders',
      stock: 50,
      category: 'Electronics',
    });
  });

  describe('POST /api/v1/orders (CREATE)', () => {
    it('should create an order and reduce product stock', async () => {
      const initialStock = product.stock;

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [
            {
              product: product._id.toString(),
              quantity: 5,
            },
          ],
        });

      expect(res.status).toBeOneOf([200, 201]);
      expect(res.body).toHaveProperty('_id');

      // Verify stock reduction
      const updatedProduct = await Product.findById(product._id);
      expect(updatedProduct?.stock).toBe(initialStock - 5);
    });

    it('should not create order if product stock is insufficient', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [
            {
              product: product._id.toString(),
              quantity: 100, // More than available stock
            },
          ],
        });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    it('should create order with multiple items and reduce stock for all', async () => {
      const product2 = await Product.create({
        name: 'Second Product',
        price: 200,
        description: 'Second test product',
        stock: 30,
        category: 'Home',
      });

      const stock1Before = product.stock;
      const stock2Before = product2.stock;

      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [
            {
              product: product._id.toString(),
              quantity: 3,
            },
            {
              product: product2._id.toString(),
              quantity: 2,
            },
          ],
        });

      expect(res.status).toBeOneOf([200, 201]);

      // Verify stock reduction for both products
      const updated1 = await Product.findById(product._id);
      const updated2 = await Product.findById(product2._id);

      expect(updated1?.stock).toBe(stock1Before - 3);
      expect(updated2?.stock).toBe(stock2Before - 2);
    });
  });

  describe('GET /api/v1/orders', () => {
    it('should fetch user orders', async () => {
      // Create an order
      await Order.create({
        user: userId,
        items: [
          {
            product: product._id,
            quantity: 5,
          },
        ],
        totalPrice: 500,
        status: 'pending',
      });

      const res = await request(app)
        .get('/api/v1/orders/my')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data || res.body)).toBe(true);
      expect((res.body.data || res.body).length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/orders/:id', () => {
    it('should fetch a single order by ID', async () => {
      const order = await Order.create({
        user: userId,
        items: [
          {
            product: product._id,
            quantity: 5,
          },
        ],
        totalPrice: 500,
        status: 'pending',
      });

      const res = await request(app)
        .get(`/api/v1/orders/${order._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalPrice', 500);
      expect(res.body._id.toString()).toBe(order._id.toString());
    });

    it('should return 404 for non-existent order', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .get(`/api/v1/orders/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/v1/orders/:id', () => {
    it('should update order status', async () => {
      const order = await Order.create({
        user: userId,
        items: [
          {
            product: product._id,
            quantity: 5,
          },
        ],
        totalPrice: 500,
        status: 'pending',
      });

      const res = await request(app)
        .patch(`/api/v1/orders/${order._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'shipped' });

      expect(res.status).toBeOneOf([200, 201]);

      // Verify update
      const updated = await Order.findById(order._id);
      expect(updated?.status).toBe('shipped');
    });
  });
});

// Custom matcher
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
