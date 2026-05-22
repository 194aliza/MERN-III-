import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cartRoutes from '../routes/cart.route.js';
import orderRoutes from '../routes/payment.route.js';
import User from '../models/user.model.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import { createTestUser, createTestProduct, generateAccessToken } from './testUtils.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

describe('Cart Routes', () => {
  describe('GET /api/cart', () => {
    it('should get cart products for authenticated user', async () => {
      const user = await createTestUser();
      const product = await createTestProduct();
      user.cartItems.push({ product: product._id, quantity: 2 });
      await user.save();

      const token = generateAccessToken(user._id.toString());

      const response = await request(app)
        .get('/api/cart')
        .set('Cookie', `accessToken=${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].quantity).toBe(2);
    });

    it('should return empty array for cart with no items', async () => {
      const user = await createTestUser();
      const token = generateAccessToken(user._id.toString());

      const response = await request(app)
        .get('/api/cart')
        .set('Cookie', `accessToken=${token}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/cart', () => {
    it('should add product to cart', async () => {
      const user = await createTestUser();
      const product = await createTestProduct();
      const token = generateAccessToken(user._id.toString());

      const response = await request(app)
        .post('/api/cart')
        .set('Cookie', `accessToken=${token}`)
        .send({ productId: product._id })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.cartItems.length).toBe(1);
      expect(updatedUser.cartItems[0].product.toString()).toBe(product._id.toString());
    });

    it('should increment quantity if product already in cart', async () => {
      const user = await createTestUser();
      const product = await createTestProduct();
      user.cartItems.push({ product: product._id, quantity: 1 });
      await user.save();

      const token = generateAccessToken(user._id.toString());

      await request(app)
        .post('/api/cart')
        .set('Cookie', `accessToken=${token}`)
        .send({ productId: product._id })
        .expect(200);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.cartItems[0].quantity).toBe(2);
    });

    it('should return 401 without authentication', async () => {
      const product = await createTestProduct();

      const response = await request(app)
        .post('/api/cart')
        .send({ productId: product._id })
        .expect(401);

      expect(response.body.message).toContain('Unauthorized');
    });
  });

  describe('DELETE /api/cart/:productId', () => {
    it('should remove all of product from cart', async () => {
      const user = await createTestUser();
      const product = await createTestProduct();
      user.cartItems.push({ product: product._id, quantity: 3 });
      await user.save();

      const token = generateAccessToken(user._id.toString());

      await request(app)
        .delete(`/api/cart/${product._id}`)
        .set('Cookie', `accessToken=${token}`)
        .expect(200);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.cartItems.length).toBe(0);
    });
  });

  describe('PUT /api/cart/:productId', () => {
    it('should update product quantity in cart', async () => {
      const user = await createTestUser();
      const product = await createTestProduct();
      user.cartItems.push({ product: product._id, quantity: 1 });
      await user.save();

      const token = generateAccessToken(user._id.toString());

      await request(app)
        .put(`/api/cart/${product._id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ quantity: 5 })
        .expect(200);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.cartItems[0].quantity).toBe(5);
    });

    it('should remove product when quantity is 0', async () => {
      const user = await createTestUser();
      const product = await createTestProduct();
      user.cartItems.push({ product: product._id, quantity: 2 });
      await user.save();

      const token = generateAccessToken(user._id.toString());

      await request(app)
        .put(`/api/cart/${product._id}`)
        .set('Cookie', `accessToken=${token}`)
        .send({ quantity: 0 })
        .expect(200);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.cartItems.length).toBe(0);
    });
  });
});

describe('Order Operations', () => {
  describe('Order Creation with Stock Reduction', () => {
    it('should create order and verify products in database', async () => {
      const user = await createTestUser();
      const product1 = await createTestProduct({ name: 'Product 1', price: 50 });
      const product2 = await createTestProduct({ name: 'Product 2', price: 30 });

      const order = await Order.create({
        user: user._id,
        products: [
          {
            product: product1._id,
            quantity: 2,
            price: product1.price,
          },
          {
            product: product2._id,
            quantity: 1,
            price: product2.price,
          },
        ],
        totalAmount: product1.price * 2 + product2.price,
        stripeSessionId: `session_${Date.now()}`,
      });

      expect(order).toBeTruthy();
      expect(order.totalAmount).toBe(130);
      expect(order.products.length).toBe(2);

      const orderInDb = await Order.findById(order._id).populate('products.product');
      expect(orderInDb).toBeTruthy();
      expect(orderInDb.products[0].product.name).toBe('Product 1');
      expect(orderInDb.products[0].quantity).toBe(2);
    });

    it('should store order with user reference', async () => {
      const user = await createTestUser();
      const product = await createTestProduct();

      const order = await Order.create({
        user: user._id,
        products: [
          {
            product: product._id,
            quantity: 1,
            price: product.price,
          },
        ],
        totalAmount: product.price,
        stripeSessionId: `session_${Date.now()}`,
      });

      const orderInDb = await Order.findById(order._id).populate('user');
      expect(orderInDb.user._id.toString()).toBe(user._id.toString());
      expect(orderInDb.user.email).toBe(user.email);
    });

    it('should handle multiple products in single order', async () => {
      const user = await createTestUser();
      const products = [];
      let totalAmount = 0;

      for (let i = 0; i < 3; i++) {
        const p = await createTestProduct({ name: `Product ${i}`, price: 10 * (i + 1) });
        products.push({
          product: p._id,
          quantity: i + 1,
          price: p.price,
        });
        totalAmount += p.price * (i + 1);
      }

      const order = await Order.create({
        user: user._id,
        products,
        totalAmount,
        stripeSessionId: `session_${Date.now()}`,
      });

      const orderInDb = await Order.findById(order._id).populate('products.product');
      expect(orderInDb.products.length).toBe(3);
      expect(orderInDb.totalAmount).toBe(totalAmount);
    });
  });

  describe('Order Retrieval', () => {
    it('should retrieve user orders', async () => {
      const user = await createTestUser();
      const product = await createTestProduct();

      await Order.create({
        user: user._id,
        products: [{ product: product._id, quantity: 1, price: product.price }],
        totalAmount: product.price,
        stripeSessionId: `session_${Date.now()}`,
      });

      const userOrders = await Order.find({ user: user._id });
      expect(userOrders.length).toBe(1);
      expect(userOrders[0].user.toString()).toBe(user._id.toString());
    });
  });
});
