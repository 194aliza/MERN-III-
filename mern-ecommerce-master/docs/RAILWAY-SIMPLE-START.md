# 🚀 Railway Deployment - SIMPLEST PATH

## 5-Minute Quick Deploy

### Do These in Order:

#### 1️⃣ Generate 2 Random Secrets (1 minute)
```bash
node -e "console.log('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex')); console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```
**Copy output ↑↑↑**

---

#### 2️⃣ Get Database URLs (2 minutes each, 4 minutes total)

**A. MongoDB URL:**
- Go: https://www.mongodb.com/cloud/atlas
- Create free M0 database
- Create user
- Copy connection string
- Whitelist IP: 0.0.0.0/0

**B. Redis URL:**
- Go: https://upstash.com
- Create free database
- Copy connection URL

---

#### 3️⃣ Connect to Railway (1 minute)
- Go: https://railway.app
- Click: "New Project"
- Select: "Deploy from GitHub"
- Select: Your repository
- Done! ✅

---

#### 4️⃣ Add Variables to Railway (30 seconds)
Click: Backend → Variables → Add Variable

**Paste these 11 values:**
```
NODE_ENV = production
PORT = 5000
MONGO_URI = [from step 2A]
UPSTASH_REDIS_URL = [from step 2B]
CLIENT_URL = [your frontend URL]
STRIPE_SECRET_KEY = [from Stripe dashboard]
CLOUDINARY_CLOUD_NAME = [from Cloudinary]
CLOUDINARY_API_KEY = [from Cloudinary]
CLOUDINARY_API_SECRET = [from Cloudinary]
ACCESS_TOKEN_SECRET = [from step 1]
REFRESH_TOKEN_SECRET = [from step 1]
```

---

#### 5️⃣ Test It Works (1 minute)
- Copy your Railway URL
- Open browser: `https://your-url/api/health`
- Should show green ✅

---

## Done! 🎉

Your API is live!

---

## Where to Get Each Value

| Variable | Where to Get | Link |
|----------|-------------|------|
| MONGO_URI | MongoDB Atlas | https://mongodb.com/cloud/atlas |
| UPSTASH_REDIS_URL | Upstash | https://upstash.com |
| STRIPE_SECRET_KEY | Stripe Dashboard | https://dashboard.stripe.com/apikeys |
| CLOUDINARY_* | Cloudinary Console | https://cloudinary.com/console |
| JWT Secrets | Generate yourself | See step 1️⃣ |

---

## 🆘 If Something Goes Wrong

**API not connecting to database?**
```bash
# Check MONGO_URI is correct
# Must have username:password@host
# Must have ?retryWrites=true&w=majority at end
```

**Deployment failed?**
```bash
# Check Railway dashboard logs
# Verify all 11 variables are filled
# Wait 2-3 minutes for rebuild
```

**Frontend can't connect to backend?**
```bash
# Update frontend .env:
VITE_API_URL=https://your-railway-url
```

---

## Files in Your Project

I created these helpful guides:

1. **RAILWAY-QUICK-CHECKLIST.md** ← Print this
2. **RAILWAY-DEPLOYMENT-STEPS.md** ← Detailed guide
3. **VARIABLES-EXPLAINED.md** ← What each variable does
4. **railway-variables.json** ← Reference file

---

## Your 11 Variables Summary

```
✅ NODE_ENV = production
✅ PORT = 5000
✅ MONGO_URI = [database]
✅ UPSTASH_REDIS_URL = [cache]
✅ CLIENT_URL = [frontend]
✅ STRIPE_SECRET_KEY = [payments]
✅ CLOUDINARY_CLOUD_NAME = [images]
✅ CLOUDINARY_API_KEY = [images]
✅ CLOUDINARY_API_SECRET = [images]
✅ ACCESS_TOKEN_SECRET = [auth]
✅ REFRESH_TOKEN_SECRET = [auth]
```

---

## Live URLs After Deploy

- **API**: https://your-railway-url
- **Docs**: https://your-railway-url/api/docs
- **Health**: https://your-railway-url/api/health

---

**That's it! You're live on Railway! 🚀**
