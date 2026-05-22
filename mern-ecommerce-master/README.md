<h1 align="center">E-Commerce Store 🛒</h1>

![Demo App](/frontend/public/screenshot-for-readme.png)

[Video Tutorial on Youtube](https://youtu.be/sX57TLIPNx8)

About This Course:

-   🚀 Project Setup
-   🗄️ MongoDB & Redis Integration
-   💳 Stripe Payment Setup
-   🔐 Robust Authentication System
-   🔑 JWT with Refresh/Access Tokens
-   📝 User Signup & Login
-   🛒 E-Commerce Core
-   📦 Product & Category Management
-   🛍️ Shopping Cart Functionality
-   💰 Checkout with Stripe
-   🏷️ Coupon Code System
-   👑 Admin Dashboard
-   📊 Sales Analytics
-   🎨 Design with Tailwind
-   🛒 Cart & Checkout Process
-   🔒 Security
-   🛡️ Data Protection
-   🚀Caching with Redis
-   ⌛ And a lot more...

### Setup .env file

```bash
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce
MONGO_USER=admin
MONGO_PASSWORD=password

# Cache
REDIS_URL=redis://localhost:6379

# Frontend URL
CLIENT_URL=http://localhost:3000

# JWT Secrets (generate strong random strings in production)
ACCESS_TOKEN_SECRET=0987mnbvmy65secret
REFRESH_TOKEN_SECRET=1234zxcvmy56secret

# Stripe Payment (get from https://stripe.com)
STRIPE_SECRET_KEY=sk_test_xxxxx

# Cloudinary Image Storage (get from https://cloudinary.com)
CLOUDINARY_NAME=dshc16ec4
CLOUDINARY_API_KEY=219671997176924
CLOUDINARY_API_SECRET=akpVyOanKNAt6itGj2dzr9Wh5z0
```

### Run this app locally

```shell
npm run build
```

### Start the app

```shell
npm run start
```
