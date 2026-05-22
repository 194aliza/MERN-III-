# 🚀 Railway Deployment - QUICK CHECKLIST

## STEP 1: GENERATE SECRETS (Do This First!)

Run this command in your terminal:

```bash
node -e "console.log('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex')); console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

**Copy the output** - You'll need it soon!

---

## STEP 2: COLLECT YOUR VALUES

### Firebase/Database Values

**A. MONGO_URI**
- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create free M0 database
- [ ] Create user with password
- [ ] Copy connection string
- [ ] Your MONGO_URI: `_____________________________`

**B. UPSTASH_REDIS_URL**
- [ ] Go to https://upstash.com
- [ ] Create free Redis database
- [ ] Copy connection URL
- [ ] Your UPSTASH_REDIS_URL: `_____________________________`

**C. CLIENT_URL (Your Frontend)**
- [ ] Your frontend URL: `_____________________________`
- [ ] Example: https://yourdomain.com or https://app.vercel.app

### Payment & Services

**D. STRIPE_SECRET_KEY**
- [ ] Go to https://dashboard.stripe.com/apikeys
- [ ] Copy Live Secret Key (starts with sk_live_)
- [ ] Your STRIPE_SECRET_KEY: `_____________________________`

**E. Cloudinary Values**
- [ ] Go to https://cloudinary.com/console
- [ ] Copy these 3 values:

1. CLOUDINARY_CLOUD_NAME: `_____________________________`
2. CLOUDINARY_API_KEY: `_____________________________`
3. CLOUDINARY_API_SECRET: `_____________________________`

### From Step 1

**F. JWT Secrets**
1. ACCESS_TOKEN_SECRET: `_____________________________`
2. REFRESH_TOKEN_SECRET: `_____________________________`

---

## STEP 3: CONNECT TO RAILWAY

- [ ] Go to https://railway.app
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub"
- [ ] Click "Authorize with GitHub"
- [ ] Select your repository
- [ ] Click "Deploy"

**Wait for deployment to start...**

---

## STEP 4: ADD ENVIRONMENT VARIABLES

In Railway Dashboard:

1. [ ] Click on "Backend" service
2. [ ] Click "Variables" tab
3. [ ] Click "Add Variable" and enter each:

```
NODE_ENV = production
PORT = 5000
MONGO_URI = [from step 2A]
UPSTASH_REDIS_URL = [from step 2B]
CLIENT_URL = [from step 2C]
STRIPE_SECRET_KEY = [from step 2D]
CLOUDINARY_CLOUD_NAME = [from step 2E #1]
CLOUDINARY_API_KEY = [from step 2E #2]
CLOUDINARY_API_SECRET = [from step 2E #3]
ACCESS_TOKEN_SECRET = [from step 2F #1]
REFRESH_TOKEN_SECRET = [from step 2F #2]
```

**Total: 11 variables to add**

---

## STEP 5: VERIFY DEPLOYMENT

- [ ] Go to Railway Dashboard
- [ ] Check "Deployments" tab
- [ ] Should show "Success" status
- [ ] Copy your live URL (looks like: https://api-xxxxx.up.railway.app)

---

## STEP 6: TEST YOUR API

- [ ] Open browser: https://your-railway-url/api/health
- [ ] Should show: `{"status":"ok","db":"connected",...}`

**If it shows error:**
- [ ] Check MONGO_URI is correct
- [ ] Check UPSTASH_REDIS_URL is correct
- [ ] Check all 11 variables are added
- [ ] Wait 2-3 minutes for full deployment

---

## STEP 7: UPDATE FRONTEND

- [ ] Update your frontend .env file:

```env
VITE_API_URL=https://your-railway-url
```

- [ ] Rebuild/redeploy frontend
- [ ] Test login/products/cart functionality

---

## ALL DONE! ✅

Your API is live at: `https://your-railway-url`

### Quick Links
- API Docs: https://your-railway-url/api/docs
- Health Check: https://your-railway-url/api/health
- Swagger UI: https://your-railway-url/api/docs

### Troubleshooting

**Can't connect to database?**
- [ ] Copy exact MONGO_URI with username & password
- [ ] Make sure MongoDB Atlas has your IP whitelisted

**Redis error?**
- [ ] Copy exact UPSTASH_REDIS_URL with password
- [ ] Check format: redis://:password@host:port

**Stripe not working?**
- [ ] Use Live Key (sk_live_), not Test Key (sk_test_)

**Cloudinary images not uploading?**
- [ ] Verify all 3 Cloudinary values are correct
- [ ] Check API Secret is not exposed

---

## QUICK VALUES SHEET

Print this and fill it:

```
NODE_ENV = production
PORT = 5000

MONGO_URI = 
UPSTASH_REDIS_URL = 
CLIENT_URL = 

STRIPE_SECRET_KEY = 
CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 

ACCESS_TOKEN_SECRET = 
REFRESH_TOKEN_SECRET = 
```

Done! 🎉
