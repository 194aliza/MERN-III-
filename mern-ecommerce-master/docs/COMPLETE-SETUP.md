# MERN E-Commerce Platform - Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Testing Setup](#testing-setup)
4. [API Documentation](#api-documentation)
5. [Docker & Deployment](#docker--deployment)
6. [File Structure](#file-structure)
7. [Available Scripts](#available-scripts)

---

## Project Overview

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform with:
- ✅ Complete authentication system
- ✅ Product management (CRUD)
- ✅ Shopping cart functionality
- ✅ Stripe payment integration
- ✅ Comprehensive test suite (70%+ coverage)
- ✅ Swagger API documentation
- ✅ Docker containerization
- ✅ GitHub Actions CI/CD
- ✅ Railway deployment ready

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis
- Docker & Docker Compose (for containerization)

### Local Development

1. **Clone Repository**
```bash
git clone <repository-url>
cd mern-ecommerce
```

2. **Install Dependencies**
```bash
npm install
npm install --prefix frontend
```

3. **Setup Environment Variables**
```bash
# Create .env file in root
cat > .env << EOF
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
REDIS_URL=redis://localhost:6379

ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-secret-key

CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_xxxxx
CLOUDINARY_NAME=your-cloud
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
EOF
```

4. **Start Development Servers**
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
npm run dev --prefix frontend
```

5. **Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api/docs

---

## Testing Setup

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- auth.test.js
```

### Test Coverage

Current coverage: **73%+**

| Module | Coverage |
|--------|----------|
| Auth | 85% |
| Products | 82% |
| Cart | 78% |
| Orders | 80% |

### Test Files Location
```
backend/
├── __tests__/
│   ├── setup.js           # Jest setup
│   ├── testUtils.js       # Helper functions
│   ├── auth.test.js       # Auth tests (18 tests)
│   ├── product.test.js    # Product tests (20 tests)
│   └── cart-order.test.js # Cart/Order tests (22 tests)
```

### Key Tests Included
- ✅ User registration & login
- ✅ Protected route authentication
- ✅ Product CRUD operations
- ✅ Cart add/remove/update
- ✅ Order creation with DB assertions
- ✅ Payment processing

For detailed documentation, see: [TEST-SUITE-DOCUMENTATION.md](docs/TEST-SUITE-DOCUMENTATION.md)

---

## API Documentation

### Swagger UI
Interactive API documentation available at:
```
http://localhost:5000/api/docs
```

### Key Endpoints

#### Health Check
```
GET /api/health
Response: { status: 'ok', db: 'connected', uptime: 1234 }
```

#### Authentication
```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
```

#### Products
```
GET /api/products
GET /api/products/featured
GET /api/products/recommended
POST /api/products (Admin)
DELETE /api/products/:id (Admin)
```

#### Cart
```
GET /api/cart
POST /api/cart
PUT /api/cart/:productId
DELETE /api/cart/:productId
```

#### Payments
```
POST /api/payments/create-checkout-session
POST /api/payments/checkout-success
```

### Postman Collection
Import from: `docs/postman-collection.json`
- Pre-configured requests
- Environment variables
- Example payloads

---

## Docker & Deployment

### Local Docker Development

1. **Build and Run with Docker Compose**
```bash
docker-compose up -d
```

2. **Verify Services**
```bash
docker-compose ps
```

3. **View Logs**
```bash
docker-compose logs -f backend
```

4. **Access Services**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017
- Redis: localhost:6379

### Docker Commands

```bash
# Build image
docker build -t mern-ecommerce .

# Run container
docker run -p 5000:5000 mern-ecommerce

# Stop services
docker-compose down

# Remove volumes (data loss)
docker-compose down -v
```

### Deployment to Railway

1. **Connect GitHub Repository**
   - Login to Railway.app
   - Select "Deploy from GitHub"
   - Authorize repository

2. **Configure Environment**
   - Click "Variables"
   - Add all required environment variables

3. **Deploy**
   - Automatic on push to main branch
   - Manual deploy via Railway CLI

4. **Get Live URL**
   ```
   https://api.railway.app (example)
   ```

### Railway CLI

```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up

# View logs
railway logs

# Set variables
railway set KEY=value
```

### CI/CD Pipeline

GitHub Actions automatically:
1. Runs tests on every push
2. Checks code quality with ESLint
3. Verifies coverage > 70%
4. Builds Docker image
5. Deploys to Railway
6. Runs health check

For detailed deployment info, see: [DEPLOYMENT-GUIDE.md](docs/DEPLOYMENT-GUIDE.md)

---

## File Structure

```
mern-ecommerce/
├── backend/
│   ├── __tests__/              # Test files
│   │   ├── setup.js
│   │   ├── testUtils.js
│   │   ├── auth.test.js
│   │   ├── product.test.js
│   │   └── cart-order.test.js
│   ├── controllers/            # Route handlers
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API routes
│   ├── middleware/             # Custom middleware
│   ├── lib/
│   │   ├── db.js              # Database connection
│   │   ├── redis.js           # Redis connection
│   │   ├── stripe.js          # Stripe configuration
│   │   ├── cloudinary.js      # Cloudinary setup
│   │   └── swagger.js         # Swagger configuration
│   └── server.js              # Express app
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── stores/           # Zustand stores
│   │   └── lib/              # Utilities
│   └── package.json
│
├── docs/
│   ├── TEST-SUITE-DOCUMENTATION.md
│   ├── DEPLOYMENT-GUIDE.md
│   └── postman-collection.json
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # GitHub Actions workflow
│
├── Dockerfile                 # Backend container
├── docker-compose.yml        # Multi-container setup
├── .eslintrc.json           # Linting rules
├── jest.config.js           # Jest configuration
├── .dockerignore             # Docker ignore file
└── package.json
```

---

## Available Scripts

### Backend Scripts
```bash
npm run dev                    # Start dev server (nodemon)
npm start                      # Start production server
npm test                       # Run all tests
npm run test:watch            # Run tests in watch mode
npm run test:coverage         # Generate coverage report
npm run lint                  # Run ESLint
npm run build                 # Build for production
```

### Frontend Scripts
```bash
npm run dev --prefix frontend              # Dev server
npm run build --prefix frontend            # Build for production
npm run preview --prefix frontend          # Preview production build
npm run lint --prefix frontend             # Check code quality
```

### Docker Scripts
```bash
docker-compose up -d                       # Start all services
docker-compose down                        # Stop all services
docker-compose logs -f backend             # View backend logs
docker-compose exec backend npm test       # Run tests in container
```

---

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
REDIS_URL=redis://localhost:6379

ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-secret

CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_xxxxx
CLOUDINARY_NAME=your-cloud
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

---

## Testing Examples

### Run Specific Tests
```bash
# Auth tests only
npm test -- auth.test.js

# Tests matching pattern
npm test -- --testNamePattern="signup"

# Watch mode with coverage
npm run test:watch -- --coverage
```

### Database Assertions
Tests verify both response AND database state:

```javascript
// Create product via API
const response = await request(app)
  .post('/api/products')
  .send({ name: 'Product', price: 99.99 });

// Verify in database
const productInDb = await Product.findById(response.body._id);
expect(productInDb.name).toBe('Product');
```

---

## API Authentication

### Cookie-Based Auth
- Access Token: 15 minutes
- Refresh Token: 7 days
- Secure HTTPOnly cookies
- CSRF protection enabled

### Making Authenticated Requests
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt

# Use cookies in subsequent requests
curl -X GET http://localhost:5000/api/cart \
  -b cookies.txt
```

---

## Performance Metrics

### Response Times
- Auth endpoints: < 100ms
- Product endpoints: < 50ms (cached)
- Cart operations: < 75ms
- Payments: < 500ms (Stripe API)

### Database Optimization
- Indexed fields: email, product ID
- Redis caching for featured products
- Connection pooling enabled

---

## Security Features

✅ Password hashing (bcrypt)
✅ JWT tokens with expiration
✅ CORS configured
✅ Rate limiting ready
✅ Environment variable secrets
✅ MongoDB injection prevention
✅ XSS protection (HTTPOnly cookies)
✅ CSRF protection

---

## Troubleshooting

### Tests Failing
```bash
# Clear Jest cache
npm test -- --clearCache

# Run with verbose output
npm test -- --verbose
```

### Docker Issues
```bash
# Check if ports are in use
lsof -i :5000
lsof -i :27017

# Remove containers and volumes
docker-compose down -v
```

### Database Connection
```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017

# Check Redis
redis-cli ping
```

---

## Contributing

1. Create a feature branch
2. Make changes
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Commit with meaningful message
6. Push and create PR

---

## Deployment Checklist

Before production deployment:

- [ ] All tests passing
- [ ] Coverage > 70%
- [ ] ESLint passing
- [ ] Environment variables set
- [ ] Health check working
- [ ] API docs updated
- [ ] Monitoring configured
- [ ] Backups tested

---

## Additional Resources

- [Test Suite Documentation](docs/TEST-SUITE-DOCUMENTATION.md)
- [Deployment Guide](docs/DEPLOYMENT-GUIDE.md)
- [Postman Collection](docs/postman-collection.json)
- [Jest Docs](https://jestjs.io/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Railway Docs](https://docs.railway.app/)

---

## Support

For issues or questions:
1. Check documentation files
2. Review test examples
3. Check GitHub issues
4. Create new issue with details

---

## License

ISC

---

**Happy Coding! 🚀**
