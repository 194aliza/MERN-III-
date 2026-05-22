# 🚀 Railway Deployment - Step by Step Guide

## Step 1: Prepare Your Variables

### Variables Extracted From Your Code:

```
REQUIRED ENVIRONMENT VARIABLES:

Environment & Server:
- NODE_ENV = production
- PORT = 5000

Database:
- MONGO_URI = your-mongodb-connection-string
  Example: mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

Redis/Cache:
- UPSTASH_REDIS_URL = your-upstash-redis-url
  Example: redis://:password@host:port

Frontend URL:
- CLIENT_URL = your-frontend-url
  Example: https://yourdomain.com

JWT Secrets (Generate strong random strings):
- ACCESS_TOKEN_SECRET = generate-random-string-here
- REFRESH_TOKEN_SECRET = generate-random-string-here

Stripe Payment:
- STRIPE_SECRET_KEY = sk_live_your_stripe_key_here

Cloudinary Image Storage:
- CLOUDINARY_CLOUD_NAME = your-cloudinary-name
- CLOUDINARY_API_KEY = your-cloudinary-api-key
- CLOUDINARY_API_SECRET = your-cloudinary-api-secret
```

---

## Step 2: Get Your Actual Values

### 2.1 Create Random Secrets (Do This First!)

Use this Node.js command to generate strong secrets:

```bash
# Run in terminal
node -e "console.log('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex')); console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - you'll need it.

---

### 2.2 Get MongoDB Connection String

**Option A: MongoDB Atlas (Recommended for Production)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create/Login to your account
3. Click "Create Database" → Choose M0 (free tier)
4. Select region closest to you
5. Create user & get connection string
6. Format: `mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority`

**Your MongoDB URI:**
```
MONGO_URI=________________________________________
```

---

### 2.3 Get Redis Connection String

**Use Upstash Redis (Free tier available)**

1. Go to https://upstash.com
2. Sign up (free)
3. Create new Redis database
4. Copy the connection string
5. Format: `redis://:password@hostname:port`

**Your Redis URL:**
```
UPSTASH_REDIS_URL=________________________________________
```

---

### 2.4 Get Stripe Keys

1. Go to https://dashboard.stripe.com
2. Navigate to Developers → API Keys
3. Copy your Live Secret Key (starts with `sk_live_`)
4. Format: `sk_live_xxxxxxxxxxxxxx`

**Your Stripe Key:**
```
STRIPE_SECRET_KEY=sk_live_________________________________________
```

---

### 2.5 Get Cloudinary Keys

1. Go to https://cloudinary.com
2. Sign up (free account available)
3. Go to Dashboard
4. Copy these three values:
   - Cloud Name
   - API Key
   - API Secret

**Your Cloudinary Values:**
```
CLOUDINARY_CLOUD_NAME=____________________
CLOUDINARY_API_KEY=____________________
CLOUDINARY_API_SECRET=____________________
```

---

### 2.6 Get Frontend URL

Your frontend will be deployed separately or hosted elsewhere.

**Example:**
```
CLIENT_URL=https://yourdomain.com
or
CLIENT_URL=https://yourfrontend.vercel.app
```

**Your Frontend URL:**
```
CLIENT_URL=____________________
```

---

## Step 3: Connect GitHub Repository to Railway

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub"**
4. Click **"Authorize with GitHub"**
5. Select your repository
6. Click **"Deploy"**

✅ Railway creates automatic deployment

---

## Step 4: Add Environment Variables to Railway

### In Railway Dashboard:

1. Go to your project
2. Click on the **"Backend"** service
3. Click **"Variables"** tab
4. Click **"Add Variable"**

### Add Each Variable:

```
1. NODE_ENV = production

2. PORT = 5000

3. MONGO_URI = [Your MongoDB Connection String from Step 2.2]

4. UPSTASH_REDIS_URL = [Your Redis URL from Step 2.3]

5. CLIENT_URL = [Your Frontend URL from Step 2.6]

6. ACCESS_TOKEN_SECRET = [Generated secret from Step 2.1]

7. REFRESH_TOKEN_SECRET = [Generated secret from Step 2.1]

8. STRIPE_SECRET_KEY = [Your Stripe Key from Step 2.4]

9. CLOUDINARY_CLOUD_NAME = [Your Cloudinary Name from Step 2.5]

10. CLOUDINARY_API_KEY = [Your Cloudinary Key from Step 2.5]

11. CLOUDINARY_API_SECRET = [Your Cloudinary Secret from Step 2.5]
```

---

## Step 5: Verify Deployment

### 5.1 Check Deployment Status

1. In Railway dashboard
2. Look for deployment logs
3. Should see: "Server is running on..."

### 5.2 Get Your Live API URL

1. Railway generates a public URL
2. Should look like: `https://api-xxxxx.up.railway.app`
3. Copy this URL

### 5.3 Test Health Endpoint

```bash
# Replace with your actual Railway URL
curl https://api-xxxxx.up.railway.app/api/health

# Should return:
{
  "status": "ok",
  "db": "connected",
  "uptime": 1234,
  "timestamp": "2024-05-21T10:30:00.000Z",
  "environment": "production"
}
```

---

## Step 6: Update Frontend

### Update Your Frontend .env

```env
VITE_API_URL=https://api-xxxxx.up.railway.app
```

Or update in your frontend build configuration.

---

## Complete Checklist

- [ ] Generated ACCESS_TOKEN_SECRET
- [ ] Generated REFRESH_TOKEN_SECRET
- [ ] Got MONGO_URI from MongoDB Atlas
- [ ] Got UPSTASH_REDIS_URL from Upstash
- [ ] Got STRIPE_SECRET_KEY from Stripe
- [ ] Got Cloudinary credentials
- [ ] Got Frontend URL
- [ ] Connected GitHub to Railway
- [ ] Added all 11 variables to Railway
- [ ] Deployment completed successfully
- [ ] Health check is working
- [ ] Updated frontend .env with Railway URL

---

## Troubleshooting

### Deployment Failed?
1. Check logs in Railway dashboard
2. Verify all environment variables are set
3. Check MongoDB connection string format
4. Ensure Redis URL is correct

### Health Check Not Working?
1. Check MONGO_URI is correct
2. Verify MongoDB credentials
3. Check network access (MongoDB Atlas requires IP whitelist)

### Can't Connect to Database?
1. MongoDB Atlas: Add Railway IP to whitelist (usually automatic)
2. Check MONGO_URI format
3. Verify username/password

### Frontend Can't Connect to Backend?
1. Update frontend .env with correct Railway URL
2. Check CORS settings (already configured)
3. Check CLIENT_URL variable in backend

---

## Quick Copy-Paste Template

Fill in these values and add to Railway:

```
NODE_ENV=production
PORT=5000
MONGO_URI=
UPSTASH_REDIS_URL=
CLIENT_URL=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
STRIPE_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## That's It! 🎉

Your MERN app is now live on Railway!

**Live API URL**: https://api-xxxxx.up.railway.app
**API Docs**: https://api-xxxxx.up.railway.app/api/docs
**Health Check**: https://api-xxxxx.up.railway.app/api/health
