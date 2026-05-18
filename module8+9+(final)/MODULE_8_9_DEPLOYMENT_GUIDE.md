# MERN Backend - Module 8 & 9 Complete Guide

## 📋 Module Overview

### Module 8: Test Suite & Docs
- **Jest + Supertest** for unit and integration tests
- **MongoDB Memory Server** for isolated database testing
- **Auth Tests**: Register, Login, Protected Routes (401 handling)
- **Product Tests**: CRUD operations with assertions
- **Order Tests**: Stock reduction on order creation
- **Swagger UI** at `/api/docs` for API documentation
- **>70% Code Coverage** enforced

### Module 9: Docker & Deployment
- **Docker + Docker Compose** for containerized local development
- **Enhanced Health Check** with DB connection status
- **GitHub Actions CI/CD** pipeline (lint, test, build, deploy)
- **Railway Deployment** with automatic URL generation
- **Socket.IO Integration** for live order feeds

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- MongoDB Atlas account (for production)
- Railway account (for deployment)

### 1. Local Development (Without Docker)

```bash
# Install dependencies
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# View Swagger docs
# Navigate to http://localhost:5000/api/docs
```

### 2. Local Development (With Docker)

```bash
# From project root
docker-compose up -d

# Verify containers
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f mongodb

# Run tests inside container
docker-compose exec backend npm test

# Bring down containers
docker-compose down
```

### 3. Production Build

```bash
# Build TypeScript
cd backend
npm run build

# Start production server
npm start

# Health check
curl http://localhost:5000/api/health
```

---

## 📊 Testing Guide

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# CI mode (with exit codes)
npm run test:ci
```

### Test Structure

```
tests/
├── setup.ts              # MongoDB Memory Server setup
├── auth.test.ts          # Auth endpoints (register, login, protected)
├── product.test.ts       # Product CRUD operations
└── order.test.ts         # Order creation & stock management
```

### Expected Test Coverage

- **Auth**: 15+ test cases covering registration, login, JWT validation
- **Products**: 12+ test cases covering CRUD with DB assertions
- **Orders**: 10+ test cases including stock reduction verification
- **Target Coverage**: 70%+ across all metrics (lines, functions, branches, statements)

---

## 📚 API Documentation

### Access Swagger UI

```
Local: http://localhost:5000/api/docs
Production: https://your-railway-app.up.railway.app/api/docs
```

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login

#### Products
- `GET /api/v1/products` - List all products
- `POST /api/v1/products` - Create product (admin)
- `GET /api/v1/products/:id` - Get product details
- `PATCH /api/v1/products/:id` - Update product (admin)
- `DELETE /api/v1/products/:id` - Delete product (admin)

#### Orders
- `GET /api/v1/orders` - Get user orders
- `POST /api/v1/orders` - Create order (reduces product stock)
- `GET /api/v1/orders/:id` - Get order details
- `PATCH /api/v1/orders/:id` - Update order status

#### Health & System
- `GET /api/health` - Health check with DB status
- `GET /api/docs` - Swagger UI documentation

---

## 🐳 Docker Configuration

### Dockerfile (Multi-stage build)

```dockerfile
# Stage 1: Build
- Install dependencies
- Build TypeScript

# Stage 2: Runtime
- Run production version
- Minimal image size
- Health checks enabled
```

### docker-compose.yml Services

```yaml
- mongodb: MongoDB 7.0 with health checks
- backend: Express server with health checks
- frontend: Next.js app (optional)
```

### Docker Commands

```bash
# Build and start
docker-compose up --build

# Run in background
docker-compose up -d

# Stop containers
docker-compose stop

# Remove containers and volumes
docker-compose down -v

# View specific service logs
docker-compose logs -f backend
```

---

## 🚢 Railway Deployment

### Step 1: Prepare Repository

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit - Module 8 & 9"
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Railway

1. Go to https://railway.app/
2. Sign up / Log in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will auto-detect Node.js project

### Step 3: Set Environment Variables

In Railway Dashboard → Variables:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/mern-db
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=7d
REFRESH_JWT_SECRET=your_refresh_secret_key
REFRESH_JWT_EXPIRE=30d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=https://your-frontend-domain.com
```

### Step 4: Configure Build & Start

Railway auto-configures, but verify in Settings:

- **Build Command**: `npm run build` (for backend)
- **Start Command**: `npm start`

### Step 5: Deploy

1. Push changes to main branch
2. Railway automatically triggers deployment
3. Get your live URL from Railway Dashboard
4. URL format: `https://your-app-xxxxx.up.railway.app`

### Step 6: Monitor Deployment

- View logs in Railway Dashboard
- Check health endpoint: `https://your-app.up.railway.app/api/health`
- Monitor metrics and analytics

---

## 🔗 Frontend Integration

### Update Frontend .env

```env
# .env or .env.local
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app/api/v1
```

### Test Integration

```bash
# Frontend login flow
1. Register at /register
2. Login at /login
3. Browse products
4. Add to cart
5. Checkout
6. View admin dashboard with live order feed

# Socket.IO features
- Live order notifications
- Real-time product updates
- Admin dashboard connection
```

---

## 📋 GitHub Actions CI/CD

### Workflow Stages

```yaml
1. Lint
   - ESLint code check
   - TypeScript compilation

2. Test
   - Run Jest test suite
   - Generate coverage report
   - Upload to Codecov

3. Build
   - Build Docker image
   - Push to registry (if configured)

4. Deploy
   - Deploy to Railway (main branch only)
   - Health check verification

5. Notify
   - Slack notifications
   - PR comments with status
```

### Setup GitHub Secrets

```
RAILWAY_TOKEN          # From Railway.app settings
DOCKER_USERNAME        # Docker Hub username (optional)
DOCKER_PASSWORD        # Docker Hub token (optional)
SLACK_WEBHOOK          # For Slack notifications (optional)
```

### GitHub Actions Commands

```bash
# View in Settings → Secrets and variables → Actions
# Add new secrets for CI/CD
```

---

## 🔐 Security Checklist

- ✅ Never commit `.env` files
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Enable HTTPS in production
- ✅ Use environment variables for secrets
- ✅ Rate limiting enabled
- ✅ Helmet.js for security headers
- ✅ CORS properly configured
- ✅ Input validation with Zod

---

## 🐛 Troubleshooting

### Docker Issues

```bash
# Clear Docker cache
docker-compose down -v
docker system prune

# Rebuild containers
docker-compose build --no-cache

# Check MongoDB connection
docker-compose logs mongodb
```

### Railway Deployment Issues

```bash
# Check build logs
railway logs --service backend

# SSH into container
railway shell

# Check environment variables
railway variables list
```

### Test Failures

```bash
# Clear jest cache
npm test -- --clearCache

# Run single test file
npm test tests/auth.test.ts

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## 📦 Production Deployment Checklist

- [ ] All tests passing (70%+ coverage)
- [ ] Docker image builds successfully
- [ ] Health check endpoint responds
- [ ] Environment variables set in Railway
- [ ] MongoDB Atlas connection verified
- [ ] JWT secrets updated (not default values)
- [ ] Cloudinary credentials configured
- [ ] SMTP credentials for email (if needed)
- [ ] Frontend updated with API URL
- [ ] SSL certificate enabled
- [ ] Logging enabled in Railway
- [ ] Backups configured for MongoDB

---

## 📞 Support & Documentation

- **API Docs**: http://localhost:5000/api/docs
- **Railway Docs**: https://docs.railway.app
- **Docker Docs**: https://docs.docker.com
- **Jest Docs**: https://jestjs.io
- **Express Docs**: https://expressjs.com

---

## 🎯 Success Criteria

### Module 8 ✅
- [x] Jest + Supertest configured
- [x] Auth tests (register, login, 401)
- [x] Product CRUD tests
- [x] Order stock reduction tests
- [x] Swagger UI at /api/docs
- [x] 70%+ code coverage

### Module 9 ✅
- [x] Dockerfile with multi-stage build
- [x] docker-compose with MongoDB
- [x] Health check with DB status
- [x] GitHub Actions CI/CD pipeline
- [x] Railway deployment ready
- [x] Live HTTPS URL
- [x] Frontend integration

---

## 📝 Notes

- Docker Compose is ready for local testing before deployment
- All sensitive data must be in environment variables
- Tests use MongoDB Memory Server (no DB required)
- GitHub Actions automatically runs on push to main/develop
- Railway auto-deploys on main branch push
- Monitor logs regularly in production

**Your app is now production-ready! 🎉**
