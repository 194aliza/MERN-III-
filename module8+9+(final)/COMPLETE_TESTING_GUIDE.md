# 🧪 MERN III - Complete Testing Guide

## ✅ STEP-BY-STEP TESTING CHECKLIST

---

## 📍 STEP 1: Start Backend Server

### Terminal 1: Backend
```bash
# Go to backend folder
cd backend

# Check if dependencies are installed
npm install

# Start the server
npm run dev
```

**What you should see:**
```
> mern-backend@3.0.0 dev
> tsx watch src/server.ts

✅ MongoDB Connected: ac-5uxuadl-shard-00-00.jh1ghmc.mongodb.net
Server running on http://localhost:5000
API Base: http://localhost:5000/api/v1
Socket.IO: http://localhost:5000
```

**Status Check:**
```bash
# In a new terminal, run:
curl http://localhost:5000/api/health
```

**Should return:**
```json
{
  "status":"ok",
  "timestamp":"2026-05-02T15:50:38.654Z",
  "uptime":26.1312106
}
```

✅ **Backend Working?** Yes if you see above

---

## 📍 STEP 2: Start Frontend Server

### Terminal 2: Frontend
```bash
# Go to project root (exit backend folder)
cd ..

# Check if dependencies installed
npm install

# Start the server
npm run dev
```

**What you should see:**
```
▲ Next.js 16.2.4 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.100.56:3000
- Environments: .env.local
✓ Ready in 981ms
```

✅ **Frontend Working?** Yes if you see above

---

## 🧪 STEP 3: Test Registration

### Test in Browser
1. Open: **http://localhost:3000**
2. Click **"Sign Up"** button
3. Fill in:
   ```
   Full Name: Test User
   Email: testuser@example.com
   Password: Test@123
   Confirm: Test@123
   ```
4. Click **"Register"**

**Expected Result:**
- ✅ Success alert appears
- ✅ Redirects to `/user/home`
- ✅ User logged in and can see dashboard

**Check Backend Logs:**
```
POST /api/v1/auth/register HTTP/1.1" 201 275
Status: 201 - Successfully Created
```

✅ **Registration Working?** Yes if user created and logged in

---

## 🧪 STEP 4: Test Login

### Logout First
1. Click **"Logout"** button on user dashboard
2. You'll see loading spinner then redirected to login

### Login Test
1. Go to: **http://localhost:3000/auth/login**
2. Enter credentials:
   ```
   Email: admin@example.com
   Password: Admin@123
   ```
3. Click **"Login"**

**Expected Result:**
- ✅ Redirects to `/admin/dashboard`
- ✅ Admin panel loads
- ✅ Shows admin sidebar with options

**Check Backend Logs:**
```
POST /api/v1/auth/login HTTP/1.1" 200 279
Status: 200 - OK
```

✅ **Login Working?** Yes if admin dashboard loads

---

## 🧪 STEP 5: Test Admin Dashboard

### Check Features on `/admin/dashboard`

**Metrics Section (Top Cards):**
- ✅ Total Revenue: $1,250 (Inventory Value)
- ✅ Active Orders: Shows number
- ✅ Total Users: Shows count
- ✅ Total Stock: Shows items count

**Live Order Feed:**
- ✅ Shows "No orders found. Waiting for sales..." (if no orders)
- ✅ Will update when new orders created

**Inventory Management Table:**
- ✅ Shows all products
- ✅ Displays: Name, Price, Stock, Rating, Status
- ✅ Example: iPhone 13, T-Shirt, etc.

**Price Distribution Chart:**
- ✅ Chart displays with product prices
- ✅ Shows visual representation

**Socket.IO Connection:**
- Open Browser DevTools (F12)
- Go to Console tab
- You should NOT see connection errors
- Look for: `[Socket.IO] User connected: ...` in backend logs

✅ **Admin Dashboard Working?** Yes if all above visible

---

## 🧪 STEP 6: Test User Features

### Go to User Dashboard
1. Logout from admin
2. Login as regular user: `john@example.com / Test@123`

### Check User Pages

**URL: `/user/home`**
- ✅ Shows welcome message
- ✅ "Explore the Type-Safe Collection"
- ✅ Buttons to "View All Products" and "My Cart"

**URL: `/user/products`**
- ✅ Shows list of all products
- ✅ Each product has: Name, Price, Category
- ✅ Can scroll through products

**URL: `/user/orders`**
- ✅ Shows user's orders
- ✅ Initially empty (no orders yet)
- ✅ Will show orders after creating them

✅ **User Features Working?** Yes if all pages load

---

## 🧪 STEP 7: Test Email Sending

### Check Email Configuration

**Step 1: Check Backend .env**
```bash
cat backend/.env | grep EMAIL
```

**Should show:**
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Option A: If You Have Gmail Credentials
1. Update `backend/.env`:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-specific-password
   ```
2. Restart backend: `npm run dev` in backend folder
3. Create an order (see STEP 8)
4. Check your email inbox

### Option B: Test Without Real Email
Email is configured but won't actually send. That's OK for testing.

**Check Email Configuration in Logs:**
```bash
# When you create an order, check logs for:
"Order Confirmed" email or error message
```

**Backend should log:**
```
[Email] Attempting to send order confirmation to: user@example.com
```

✅ **Email Configured?** Yes if no errors in logs

---

## 🧪 STEP 8: Test Order Creation

### Create Test Order via API

**Terminal 3: Create Order**
```bash
# First, login to get a token
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test@123"
  }'
```

**Save the token from response** (copy the token value)

**Create Order:**
```bash
# Replace TOKEN with the token you got above
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "items": [
      {
        "product": "69f4e4d298da296b100cb2a3",
        "quantity": 2
      }
    ]
  }'
```

**Expected Response:**
```json
{
  "_id": "...",
  "user": "...",
  "items": [...],
  "totalPrice": 2000,
  "status": "pending",
  "createdAt": "2026-05-02T..."
}
```

**Check Backend Logs:**
- ✅ Order creation logged
- ✅ Email sending logged
- ✅ Socket.IO event emitted

**Check Frontend:**
- Go to `/user/orders`
- ✅ Your new order should appear

✅ **Orders Working?** Yes if order appears

---

## 🧪 STEP 9: Test Live Order Updates (Socket.IO)

### Check Real-Time Updates

**On Admin Dashboard:**
1. Logged in as admin
2. Keep admin dashboard open
3. Create an order (from STEP 8)
4. Watch **Live Order Feed** section
5. ✅ New order should appear in real-time!

**Backend Logs:**
```
[Socket.IO] User connected: ...
io.emit("newOrder", {...})
[Socket.IO] Broadcasting new order
```

**Browser DevTools:**
1. Press F12 (Developer Tools)
2. Go to Network tab
3. Filter by "WebSocket"
4. Should see `socket.io` connections

✅ **Socket.IO Working?** Yes if order appears live

---

## 🧪 STEP 10: Test Logout

### Logout Test
1. Click **"Logout"** button
2. Should see spinning loader
3. ✅ Redirects to `/auth/login`
4. ✅ localStorage cleared
5. ✅ Can't access `/user/home` anymore (redirects to login)

**Verify in Browser Console:**
```javascript
// Press F12, go to Console tab, type:
localStorage.getItem("token")
// Should return: null (if logged out)
```

✅ **Logout Working?** Yes if redirected and localStorage cleared

---

## 📊 COMPLETE TESTING CHECKLIST

Print this out and check off each one:

```
BACKEND & DATABASE
  ☐ Backend server starts on http://localhost:5000
  ☐ MongoDB connection shows ✅ Connected
  ☐ Health check works (curl /api/health)
  ☐ Socket.IO ready message appears

FRONTEND
  ☐ Frontend server starts on http://localhost:3000
  ☐ Home page loads
  ☐ Dark mode toggle works
  ☐ Navigation menu visible

AUTHENTICATION
  ☐ Registration page works (/auth/register)
  ☐ User can register with new email
  ☐ Success message appears
  ☐ Redirects to /user/home after registration
  ☐ Login page works (/auth/login)
  ☐ Can login with correct credentials
  ☐ Admin login shows admin dashboard
  ☐ Logout clears session and redirects
  ☐ Can't access user pages without login

USER FEATURES
  ☐ User home page loads (/user/home)
  ☐ Products page loads (/user/products)
  ☐ Products display with prices
  ☐ User orders page loads (/user/orders)
  ☐ Initially empty orders list

ADMIN FEATURES
  ☐ Admin dashboard loads (/admin/dashboard)
  ☐ Metrics cards show data (Revenue, Orders, Users, Stock)
  ☐ Product table displays all products
  ☐ Chart renders without errors
  ☐ Live order feed section visible
  ☐ Admin sidebar navigation works
  ☐ Can access all admin features

REAL-TIME FEATURES
  ☐ Socket.IO connection established
  ☐ No connection errors in console
  ☐ Orders appear in real-time on dashboard
  ☐ Live updates work when creating orders

ORDERS
  ☐ Can create order via API or UI
  ☐ Order appears in user's orders
  ☐ Order appears in admin's live feed
  ☐ Product stock decreases after order
  ☐ Order status can be updated by admin

EMAIL (OPTIONAL)
  ☐ Email configuration present in .env
  ☐ No email errors in backend logs
  ☐ Would send emails if credentials valid

API ENDPOINTS
  ☐ POST /auth/register - creates user
  ☐ POST /auth/login - returns token
  ☐ GET /products - returns product list
  ☐ POST /orders - creates order
  ☐ GET /orders/my - returns user's orders
  ☐ GET /orders - returns all orders (admin)

ERROR HANDLING
  ☐ Invalid login shows error message
  ☐ Duplicate email shows error
  ☐ Out of stock shows error
  ☐ Unauthorized access redirects to login
```

---

## 🚀 QUICK COMMAND REFERENCE

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd ..
npm run dev
```

### Terminal 3: Testing/Checking
```bash
# Check backend health
curl http://localhost:5000/api/health

# Get all products
curl http://localhost:5000/api/v1/products

# Test registration
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test@123"}'

# Test login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}'
```

---

## 📱 Browser URLs to Test

```
Home:              http://localhost:3000
Register:          http://localhost:3000/auth/register
Login:             http://localhost:3000/auth/login
Logout:            http://localhost:3000/auth/logout
User Home:         http://localhost:3000/user/home
User Products:     http://localhost:3000/user/products
User Orders:       http://localhost:3000/user/orders
Admin Dashboard:   http://localhost:3000/admin/dashboard
```

---

## 🆘 TROUBLESHOOTING

### Backend Won't Start
```bash
# Check port 5000 is free
netstat -an | grep 5000

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9  # Mac/Linux
taskkill /PID <PID> /F          # Windows
```

### Frontend Won't Start
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

### Can't Connect to Database
```bash
# Check connection string in backend/.env
cat backend/.env | grep MONGO_URI

# Test connection manually
curl http://localhost:5000/api/health
```

### Email Not Sending
```bash
# Check email config
cat backend/.env | grep EMAIL

# Gmail requires App Password (not regular password)
# Generate at: https://myaccount.google.com/apppasswords
```

### Socket.IO Not Connecting
```bash
# Check backend logs for Socket.IO messages
# Backend should show: [Socket.IO] User connected

# Check browser console for errors
# Press F12, go to Console tab
```

---

## ✅ ALL TESTS PASSED?

If all above tests pass, your application is **100% WORKING** ✅

**You can now:**
- ✅ Deploy to Railway
- ✅ Add real email credentials
- ✅ Create real orders
- ✅ Monitor live updates
- ✅ Manage inventory
- ✅ Track analytics

---

**Need Help?** Check the logs in terminal or browser console (F12)
**Ready to Deploy?** See RAILWAY_DEPLOYMENT.md
