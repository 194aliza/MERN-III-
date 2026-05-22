# Railway Variables - What Each One Does

## Quick Reference

### Environment & Server
```
NODE_ENV = production
├─ Used in: backend/server.js
├─ What it does: Tells app to run in production mode
└─ Value: production

PORT = 5000
├─ Used in: backend/server.js
├─ What it does: Sets server port to listen on
└─ Value: 5000
```

---

### Database Connection
```
MONGO_URI = mongodb+srv://username:password@...
├─ Used in: backend/lib/db.js
├─ What it does: Connects to MongoDB database
├─ Get from: https://www.mongodb.com/cloud/atlas
└─ Format: mongodb+srv://user:pass@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

UPSTASH_REDIS_URL = redis://:password@host:port
├─ Used in: backend/lib/redis.js
├─ What it does: Connects to Redis cache (for featured products)
├─ Get from: https://upstash.com
└─ Format: redis://:password@hostname:port
```

---

### Frontend Integration
```
CLIENT_URL = https://yourdomain.com
├─ Used in: backend/server.js (CORS configuration)
├─ What it does: Allows your frontend to connect to backend
├─ Example: https://yourapp.vercel.app
└─ Prevents: CORS errors when frontend calls API
```

---

### JWT Authentication
```
ACCESS_TOKEN_SECRET = randomly-generated-string
├─ Used in: backend/controllers/auth.controller.js
├─ What it does: Signs JWT access tokens (15 min expiry)
├─ Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
└─ Security: Keep this PRIVATE and UNIQUE

REFRESH_TOKEN_SECRET = randomly-generated-string
├─ Used in: backend/controllers/auth.controller.js
├─ What it does: Signs JWT refresh tokens (7 day expiry)
├─ Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
└─ Security: Keep this PRIVATE and UNIQUE
```

---

### Payment Processing
```
STRIPE_SECRET_KEY = your_stripe_key
├─ Used in: backend/lib/stripe.js
├─ What it does: Handles payment processing
├─ Get from: https://dashboard.stripe.com/apikeys
├─ Format: Must start with sk_live_ (not sk_test_)
└─ Security: Never expose this key!
```

---

### Image Storage
```
CLOUDINARY_CLOUD_NAME = your-cloud-name
├─ Used in: backend/lib/cloudinary.js
├─ What it does: Name of your Cloudinary storage account
└─ Get from: https://cloudinary.com/console

CLOUDINARY_API_KEY = your-api-key
├─ Used in: backend/lib/cloudinary.js
├─ What it does: API key for Cloudinary authentication
└─ Get from: https://cloudinary.com/console

CLOUDINARY_API_SECRET = your-api-secret
├─ Used in: backend/lib/cloudinary.js
├─ What it does: Secret key for secure API calls
├─ Get from: https://cloudinary.com/console
└─ Security: Keep this PRIVATE!
```

---

## Where Each Variable Is Used

### In Code Files:

**backend/server.js**
- PORT
- NODE_ENV
- CLIENT_URL

**backend/lib/db.js**
- MONGO_URI

**backend/lib/redis.js**
- UPSTASH_REDIS_URL

**backend/lib/stripe.js**
- STRIPE_SECRET_KEY

**backend/lib/cloudinary.js**
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

**backend/controllers/auth.controller.js**
- ACCESS_TOKEN_SECRET
- REFRESH_TOKEN_SECRET

---

## Why Do I Need Each One?

```
MONGO_URI
├─ Without it: ❌ No database connection, app crashes
├─ With it: ✅ Can store users, products, orders

UPSTASH_REDIS_URL
├─ Without it: ⚠️ Featured products won't cache, slower performance
├─ With it: ✅ Fast caching, better performance

CLIENT_URL
├─ Without it: ❌ Frontend can't connect (CORS error)
├─ With it: ✅ Frontend and backend communicate

STRIPE_SECRET_KEY
├─ Without it: ❌ Payment processing fails
├─ With it: ✅ Accept credit card payments

CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET
├─ Without it: ❌ Can't upload/display product images
├─ With it: ✅ Store and serve images

ACCESS_TOKEN_SECRET + REFRESH_TOKEN_SECRET
├─ Without it: ❌ Authentication broken, users can't login
├─ With it: ✅ Secure user sessions
```

---

## How to Get Each Value

### 1. MONGO_URI (MongoDB)
```
Step 1: https://www.mongodb.com/cloud/atlas
Step 2: Create account → Create M0 Database (free)
Step 3: Create user with strong password
Step 4: IP Access: Add 0.0.0.0/0 (allows Railway IP)
Step 5: Click "Connect" → "Connect your application"
Step 6: Copy connection string
Step 7: Replace <username> and <password>

Result: mongodb+srv://user:pass@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### 2. UPSTASH_REDIS_URL (Redis)
```
Step 1: https://upstash.com
Step 2: Sign up → Create Redis Database (free)
Step 3: Click database name
Step 4: Copy "Redis CLI" connection string
Step 5: Format: redis://:password@host:port

Result: redis://default:password@hostname:port
```

### 3. CLIENT_URL (Frontend)
```
This is your frontend URL:
- If Vercel: https://yourapp.vercel.app
- If custom domain: https://yourdomain.com
- If local: http://localhost:3000 (dev only)
```

### 4. STRIPE_SECRET_KEY (Stripe)
```
Step 1: https://dashboard.stripe.com
Step 2: Sign up → Create account
Step 3: Developers → API Keys
Step 4: Copy Live Secret Key (NOT Test Key)
Step 5: Must start with: sk_live_

Result: your_stripe_key
```

### 5. Cloudinary (CLOUD_NAME, API_KEY, API_SECRET)
```
Step 1: https://cloudinary.com
Step 2: Sign up → Create account
Step 3: Go to Dashboard
Step 4: Copy these 3 fields:
   - Cloud Name: yourcloudname
   - API Key: yourkey
   - API Secret: your_secret_key

Results:
  CLOUDINARY_CLOUD_NAME=yourcloudname
  CLOUDINARY_API_KEY=yourkey
  CLOUDINARY_API_SECRET=your_secret_key
```

### 6. JWT Secrets (Generate Yourself)
```
Run in terminal:
node -e "console.log('ACCESS_TOKEN=' + require('crypto').randomBytes(32).toString('hex')); console.log('REFRESH_TOKEN=' + require('crypto').randomBytes(32).toString('hex'))"

Results:
  ACCESS_TOKEN_SECRET=your_secret_token
  REFRESH_TOKEN_SECRET=your_secondsecret_token
```

---

## Environment Setup Summary

```
TOTAL VARIABLES TO ADD: 11

Required (Must Have):
✅ NODE_ENV
✅ PORT
✅ MONGO_URI
✅ UPSTASH_REDIS_URL
✅ CLIENT_URL
✅ ACCESS_TOKEN_SECRET
✅ REFRESH_TOKEN_SECRET

Optional (Good to Have):
⚠️ STRIPE_SECRET_KEY
⚠️ CLOUDINARY_CLOUD_NAME
⚠️ CLOUDINARY_API_KEY
⚠️ CLOUDINARY_API_SECRET
```

---

## Security Notes

🔒 **NEVER share these:**
- MONGO_URI (contains password)
- UPSTASH_REDIS_URL (contains password)
- STRIPE_SECRET_KEY (can charge money)
- CLOUDINARY_API_SECRET (can delete images)
- ACCESS_TOKEN_SECRET (can forge tokens)
- REFRESH_TOKEN_SECRET (can forge tokens)

✅ **DO:**
- Store in Railway dashboard only
- Use strong random secrets for JWT
- Rotate secrets regularly
- Use Live keys in production (not test)

❌ **DON'T:**
- Commit .env to GitHub
- Share screenshots of variables
- Use weak passwords
- Mix test & live keys
