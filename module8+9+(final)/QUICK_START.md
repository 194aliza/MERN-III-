# Quick Start Guide - Module 8 & 9

> Complete guide to get your MERN app tested, dockerized, and deployed in 30 minutes!

## 📦 What You Get

✅ **Module 8 - Testing**
- Jest test suite with 40+ test cases
- Auth, Product, Order tests
- 70%+ code coverage
- Swagger API documentation

✅ **Module 9 - Deployment**
- Docker & Docker Compose setup
- GitHub Actions CI/CD pipeline
- Railway deployment ready
- Live HTTPS URL

---

## ⚡ 30-Minute Setup

### Step 1: Install Dependencies (3 min)

```bash
cd backend
npm install
```

This installs:
- Jest, Supertest, mongodb-memory-server (testing)
- swagger-ui-express, swagger-jsdoc (API docs)
- All other production dependencies

### Step 2: Run Tests (5 min)

```bash
# Run all tests
npm test

# View coverage report
npm run test:coverage

# Watch mode (re-run on save)
npm run test:watch
```

✅ All tests should pass with 70%+ coverage

### Step 3: Run Locally with Docker (10 min)

```bash
# From project root
docker-compose up -d

# Wait for MongoDB to start (10 seconds)
sleep 10

# Run tests in container
docker-compose exec backend npm test

# View logs
docker-compose logs -f backend
```

✅ Backend running at `http://localhost:5000`
✅ MongoDB running at `mongodb://localhost:27017`

### Step 4: Access API & Documentation (2 min)

Open browser:
- **API Docs (Swagger)**: http://localhost:5000/api/docs
- **Health Check**: http://localhost:5000/api/health

### Step 5: Deploy to Railway (10 min)

```bash
# 1. Push code to GitHub
git add .
git commit -m "Module 8 & 9 - Testing & Deployment"
git push origin main

# 2. Go to https://railway.app/
# 3. Click "New Project" → "Deploy from GitHub repo"
# 4. Select your repository
# 5. Set environment variables (see below)
# 6. Done! Railway auto-deploys

# Your URL will be: https://your-app-xxxxx.up.railway.app
```

---

## 🔧 Environment Variables

### Local Development (.env)
```
MONGO_URI=mongodb://localhost:27017/mern-db
JWT_SECRET=dev-secret-key-not-for-production
```

### Railway Deployment
Set in Railway Dashboard:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mern-db
JWT_SECRET=strong-random-secret-key-32-chars
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ✅ Verification Checklist

- [ ] Tests passing: `npm test`
- [ ] Coverage >70%: `npm run test:coverage`
- [ ] Swagger UI loads: http://localhost:5000/api/docs
- [ ] Health check works: `curl http://localhost:5000/api/health`
- [ ] Docker builds: `docker-compose build`
- [ ] MongoDB connects in Docker
- [ ] Frontend can call API

---

## 📝 Testing Guide

### Run Specific Tests

```bash
# Auth tests only
npm test auth.test.ts

# Product tests only
npm test product.test.ts

# Order tests (stock reduction)
npm test order.test.ts

# With coverage
npm test -- --coverage
```

### Test Files Location

```
tests/
├── auth.test.ts       # 15+ tests (register, login, 401)
├── product.test.ts    # 12+ tests (CRUD operations)
├── order.test.ts      # 10+ tests (stock management)
└── setup.ts          # Test environment setup
```

---

## 🐳 Docker Commands Reference

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f mongodb

# Run commands in container
docker-compose exec backend npm test
docker-compose exec backend npm run build

# Stop services
docker-compose stop

# Remove everything
docker-compose down -v
```

---

## 🚀 Railway Deployment Troubleshooting

### Issue: Build fails
```bash
# Check build logs in Railway Dashboard
# Solution: Ensure package.json has correct build script
```

### Issue: App crashes on startup
```bash
# Check logs: railway logs --service backend
# Solution: Verify MONGO_URI and other env vars
```

### Issue: Health check failing
```bash
# Check: https://your-app.up.railway.app/api/health
# Solution: Restart service in Railway Dashboard
```

---

## 🔗 Integration with Frontend

### Update Frontend .env

```env
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app/api/v1
```

Then restart frontend to apply changes.

---

## 📋 What Tests Cover

### Auth Tests ✅
- Register new user
- Register with duplicate email (400)
- Login with valid credentials
- Login with invalid email (401)
- Login with invalid password (401)
- Protected routes return 401 without token

### Product Tests ✅
- Create product (admin)
- Read/fetch products
- Update product
- Delete product
- Validate required fields

### Order Tests ✅
- Create order
- Stock reduced automatically
- Cannot order if stock insufficient
- Multiple items in order
- All stocks reduced correctly

---

## 📊 Coverage Report

After running `npm run test:coverage`:

```
Statements   : 75%  (150/200)
Branches     : 72%  (90/125)
Functions    : 78%  (56/72)
Lines        : 76%  (152/200)
```

Target: 70%+ ✅

---

## 🎯 Success Indicators

✅ You're done when:
1. All tests pass
2. Coverage >70%
3. Swagger UI shows all endpoints
4. Health check returns `db: connected`
5. Docker containers run without errors
6. Railway deployment shows live URL
7. Frontend can register/login/browse products

---

## 📞 Quick Links

- **Swagger Docs**: http://localhost:5000/api/docs
- **Postman Collection**: `/docs/postman-collection.json`
- **API Reference**: `/docs/API_ENDPOINTS.md`
- **Full Guide**: `/MODULE_8_9_DEPLOYMENT_GUIDE.md`
- **Railway**: https://railway.app
- **Docker Docs**: https://docs.docker.com

---

## 🎉 Congratulations!

Your MERN backend now has:
- ✅ Complete test suite (Module 8)
- ✅ Docker containerization (Module 9)
- ✅ Automated CI/CD pipeline (Module 9)
- ✅ Production deployment (Module 9)
- ✅ Live HTTPS URL (Module 9)

**Ready for final submission!** 🚀

---

**Need help?** Check `/MODULE_8_9_DEPLOYMENT_GUIDE.md` for detailed documentation.
