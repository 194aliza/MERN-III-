# MERN III Backend

Express + TypeScript + MongoDB Backend for MERN III Full-Stack Application

##  Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main Express app & Socket.IO
│   ├── controllers/           # Route handlers
│   │   └── productController.ts
│   ├── routes/               # API routes
│   │   └── productRoutes.ts
│   ├── middleware/           # Express middleware
│   │   ├── requestLogger.ts
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   ├── schemas/              # Zod validation schemas
│   │   └── product.ts
│   └── utils/                # Utility functions
│       └── asyncHandler.ts
├── data/                     # Product JSON files (Module 1)
│   ├── product1.json
│   └── product2.json
├── Cli/                      
│   └── mergeproduct.js
├── .env.example              # Environment variables template
├── package.json              # Node dependencies
└── tsconfig.json             # TypeScript config
```

##  Setup & Installation

1. **Navigate to backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Generate merged products:**
   ```bash
   node ../backend/Cli/mergeproduct.js
   # Optional: filter by category
   node ../backend/Cli/mergeproduct.js --filter=electronics
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:5000

##  API Endpoints (Module 2)

### Products
- `GET /api/v1/products` - List all products (paginated)
  - Query params: `page`, `limit`, `category`, `search`
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create product (requires valid body)
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `GET /api/v1/products/stats` - Product statistics by category

### Health Check
- `GET /api/health` - Server status

##  Features Implemented

### Module 1 
- CLI tool merges product JSON files
- Supports `--filter=<category>` flag
- Outputs summary table: total products, categories, avg price
- Error handling for missing files & parse errors

### Module 2 
- Express + TypeScript setup
- All product CRUD endpoints
- Morgan request logging
- Custom requestLogger middleware (method, URL, status, response time)
- Zod validation middleware (reusable on routes)
- AsyncHandler wrapper for error handling
- Global AppError class + error middleware
- Socket.IO server setup (ready for Module 7)

### Module 3 
- MongoDB Atlas connection
- Mongoose ProductSchema
- Replace JSON with database queries
- Pagination & text search
- Category aggregation stats

### Module 4 
- UserSchema with bcrypt & JWT
- Auth routes (register, login, refresh)
- authMiddleware for protected routes
- HttpOnly cookies for refresh token

### Module 5 
- Helmet security headers
- CORS with origin validation
- Rate limiting middleware
- Enhanced validation

### Module 6 
- OrderSchema with transactions
- ReviewSchema with aggregation
- Admin order management

### Module 7 
- Live order Socket.IO events
- Nodemailer email confirmation
- Password reset flow
- Cloudinary image upload

### Module 9 
- Docker & docker-compose
- GitHub Actions CI/CD
- Railway deployment
- Full integration tests

##  Testing Endpoints

Use Thunder Client, Postman, or curl:

```bash
# List products
curl http://localhost:5000/api/v1/products

# List with pagination
curl "http://localhost:5000/api/v1/products?page=1&limit=12"

# Filter by category
curl "http://localhost:5000/api/v1/products?category=electronics"

# Search
curl "http://localhost:5000/api/v1/products?search=laptop"

# Get stats
curl http://localhost:5000/api/v1/products/stats

# Create product (POST)
curl -X POST http://localhost:5000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Tablet","price":300,"category":"electronics"}'

# Get health
curl http://localhost:5000/api/health
```

## 🔗 Frontend Integration

Update Next.js .env.local:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Use in components:

```typescript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/products`
);
```


