import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import jwt from 'jsonwebtoken';

export const createTestUser = async (userData = {}) => {
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'customer',
    ...userData,
  });
  return user;
};

export const createTestAdmin = async (userData = {}) => {
  return createTestUser({
    role: 'admin',
    email: 'admin@example.com',
    ...userData,
  });
};

export const createTestProduct = async (productData = {}) => {
  return Product.create({
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    image: 'https://example.com/image.jpg',
    category: 'electronics',
    isFeatured: false,
    ...productData,
  });
};

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET || 'test-secret', {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET || 'test-secret', {
    expiresIn: '7d',
  });
};
