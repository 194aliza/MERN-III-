# MERN Backend - Complete API Endpoints Reference

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-railway-app.up.railway.app`

---

## Authentication Endpoints

### 1. Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## Product Endpoints

### 1. Get All Products
```http
GET /api/v1/products
Content-Type: application/json

Response (200):
{
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "price": 99.99,
      "description": "Product description",
      "stock": 10,
      "category": "Electronics",
      "rating": 4.5,
      "reviews": []
    }
  ],
  "total": 1,
  "page": 1
}
```

### 2. Get Product by ID
```http
GET /api/v1/products/:id
Content-Type: application/json

Response (200):
{
  "_id": "product_id",
  "name": "Product Name",
  "price": 99.99,
  "description": "Product description",
  "stock": 10,
  "category": "Electronics",
  "image": "url_to_image",
  "rating": 4.5,
  "reviews": []
}
```

### 3. Create Product (Admin Only)
```http
POST /api/v1/products
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "New Product",
  "price": 149.99,
  "description": "Product description",
  "stock": 50,
  "category": "Electronics",
  "image": "image_url"
}

Response (201):
{
  "_id": "new_product_id",
  "name": "New Product",
  "price": 149.99,
  "stock": 50,
  "category": "Electronics"
}
```

### 4. Update Product (Admin Only)
```http
PATCH /api/v1/products/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 199.99,
  "stock": 25
}

Response (200):
{
  "_id": "product_id",
  "name": "Updated Product Name",
  "price": 199.99,
  "stock": 25
}
```

### 5. Delete Product (Admin Only)
```http
DELETE /api/v1/products/:id
Authorization: Bearer <JWT_TOKEN>

Response (204): No Content
```

---

## Order Endpoints

### 1. Create Order (Reduces Product Stock)
```http
POST /api/v1/orders
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "total": 199.98
}

Response (201):
{
  "_id": "order_id",
  "userId": "user_id",
  "items": [...],
  "total": 199.98,
  "status": "pending",
  "shippingAddress": {...},
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}

Note: Product stock is automatically reduced by quantity
```

### 2. Get User Orders
```http
GET /api/v1/orders
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "data": [
    {
      "_id": "order_id",
      "items": [...],
      "total": 199.98,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 5,
  "page": 1
}
```

### 3. Get Order by ID
```http
GET /api/v1/orders/:id
Authorization: Bearer <JWT_TOKEN>

Response (200):
{
  "_id": "order_id",
  "userId": "user_id",
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "total": 199.98,
  "status": "pending",
  "shippingAddress": {...},
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 4. Update Order Status (Admin/Order Owner)
```http
PATCH /api/v1/orders/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "status": "shipped"
}

Response (200):
{
  "_id": "order_id",
  "status": "shipped",
  "updatedAt": "2024-01-15T11:00:00Z"
}

Allowed statuses: pending, processing, shipped, delivered
```

---

## System Endpoints

### 1. Health Check
```http
GET /api/health

Response (200):
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "environment": "production",
  "version": "3.0.0"
}
```

### 2. API Documentation (Swagger UI)
```
GET /api/docs

Interactive API documentation with "Try it out" functionality
```

---

## Error Responses

### 401 - Unauthorized (Missing Token)
```json
{
  "status": "error",
  "message": "No token provided",
  "statusCode": 401
}
```

### 401 - Unauthorized (Invalid Credentials)
```json
{
  "status": "error",
  "message": "Invalid credentials",
  "statusCode": 401
}
```

### 403 - Forbidden (Insufficient Permissions)
```json
{
  "status": "error",
  "message": "You do not have permission to perform this action",
  "statusCode": 403
}
```

### 404 - Not Found
```json
{
  "status": "error",
  "message": "Resource not found",
  "statusCode": 404
}
```

### 400 - Bad Request
```json
{
  "status": "error",
  "message": "User already exists",
  "statusCode": 400
}
```

### 500 - Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error",
  "statusCode": 500
}
```

---

## Authentication Flow

1. **Register** → Get JWT token
2. **Login** → Get JWT token
3. **Use token** in Authorization header for protected routes
4. **Token format**: `Authorization: Bearer <your_jwt_token>`

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Response Header**: `X-RateLimit-Remaining`

---

## Testing with Postman

### Setup

1. Import `postman-collection.json` into Postman
2. Set variables:
   - `BASE_URL`: `http://localhost:5000` (or your production URL)
   - `TOKEN`: Copy token from login response

### Test Flow

1. Register → Get token
2. Login → Get token (and set TOKEN variable)
3. Create product (admin)
4. Get all products
5. Create order
6. Verify stock reduced
7. Check health endpoint

---

## WebSocket Events (Socket.IO)

### Order Updates
```javascript
// Client listening
socket.on('order:created', (order) => {
  console.log('New order:', order);
});

// Admin dashboard update
socket.on('order:updated', (updatedOrder) => {
  console.log('Order updated:', updatedOrder);
});
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- IDs are MongoDB ObjectIds
- Prices are in decimal format (e.g., 99.99)
- JWT tokens expire in 7 days by default
- All requests require `Content-Type: application/json` header
- CORS is enabled for frontend communication

---

## Common Issues & Solutions

### 401 Unauthorized
- Check if token is valid
- Token may have expired (request new login)
- Ensure Bearer prefix is included

### 400 Bad Request
- Validate required fields
- Check field data types
- Ensure stock is sufficient for orders

### 404 Not Found
- Verify resource ID is correct
- Resource may have been deleted
- Check spelling of endpoint

### 500 Server Error
- Check server logs: `docker-compose logs backend`
- Verify database connection
- Ensure all environment variables are set
