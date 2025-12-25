# 🚀 Render Deployment Guide

## Overview

We'll deploy:
- **Backend** → Render Web Service
- **Frontend** → Render Static Site
- **Database** → MongoDB Atlas (free tier)

---

## Part 1: Setup MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a new cluster (choose **FREE** tier - M0)
4. Choose cloud provider: **AWS** (recommended)
5. Choose region: Closest to your users
6. Cluster name: `shivas-hub-cluster`
7. Click **"Create Cluster"** (takes 3-5 minutes)

### 1.2 Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `shivashub-admin`
5. Password: Click **"Autogenerate Secure Password"** and **SAVE IT**
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

### 1.3 Whitelist IP Addresses

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for Render deployment)
4. IP Address will be: `0.0.0.0/0`
5. Click **"Confirm"**

### 1.4 Get Connection String

1. Click **"Database"** in left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string:
   ```
   mongodb+srv://shivashub-admin:<password>@shivas-hub-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name: `shivas-hub`
   ```
   mongodb+srv://shivashub-admin:YOUR_PASSWORD@shivas-hub-cluster.xxxxx.mongodb.net/shivas-hub?retryWrites=true&w=majority
   ```
8. **SAVE THIS** - you'll need it for Render

---

## Part 2: Deploy Backend to Render

### 2.1 Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub account (recommended)
3. Authorize Render to access your GitHub repositories

### 2.2 Create Web Service for Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `shivas-hub`
3. Configure the service:

**Basic Settings:**
- **Name**: `shivas-hub-backend`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select: **Free** (for testing) or **Starter** (for production)

### 2.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables one by one:

```env
NODE_ENV=production

MONGO_URI=mongodb+srv://shivashub-admin:YOUR_PASSWORD@shivas-hub-cluster.xxxxx.mongodb.net/shivas-hub?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_characters_long_change_this
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

UPI_ID=yourname@paytm
BUSINESS_NAME=Shiva's Box Cricket

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=https://shivas-hub-frontend.onrender.com

ADMIN_EMAIL=admin@shivashub.com
ADMIN_PASSWORD=Admin@123

SLOT_LOCK_DURATION=180

PORT=5000
```

**Important:**
- Replace MongoDB URI with your actual connection string
- Generate strong JWT secrets (use: https://randomkeygen.com/)
- Update Cloudinary credentials (get from: https://cloudinary.com)
- Update UPI_ID with your actual UPI ID
- FRONTEND_URL will be updated after deploying frontend

### 2.4 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://shivas-hub-backend.onrender.com`
4. **SAVE THIS URL** - you'll need it for frontend

### 2.5 Test Backend

Visit: `https://shivas-hub-backend.onrender.com/health`

Should return:
```json
{
  "success": true,
  "message": "Shiva's Hub API is running",
  "timestamp": "2025-12-25T..."
}
```

---

## Part 3: Deploy Frontend to Render

### 3.1 Update Frontend Environment

Before deploying frontend, we need to update the build configuration.

**Create `frontend/.env.production` file** (I'll do this for you):
```env
VITE_API_URL=https://shivas-hub-backend.onrender.com/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

### 3.2 Create Static Site for Frontend

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository: `shivas-hub`
3. Configure the site:

**Basic Settings:**
- **Name**: `shivas-hub-frontend`
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 3.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

```env
VITE_API_URL=https://shivas-hub-backend.onrender.com/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

**Important:**
- Replace backend URL with your actual backend URL from step 2.4
- Update Razorpay key if you have one (get from: https://razorpay.com)

### 3.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://shivas-hub-frontend.onrender.com`

### 3.5 Update Backend FRONTEND_URL

1. Go to your backend service in Render
2. Click **"Environment"** in left sidebar
3. Update `FRONTEND_URL` to your frontend URL: `https://shivas-hub-frontend.onrender.com`
4. Click **"Save Changes"**
5. Backend will automatically redeploy

---

## Part 4: Seed Database (Optional)

### 4.1 Add Seed Script to Backend

The backend already has a seed script. To run it on Render:

**Option 1: Using Render Shell**
1. Go to backend service in Render
2. Click **"Shell"** tab
3. Run: `npm run seed`

**Option 2: Temporary Manual Trigger**
1. Add a temporary route in `backend/server.js`
2. Visit the route to trigger seeding
3. Remove the route after seeding

---

## Part 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain to Frontend

1. Go to frontend static site in Render
2. Click **"Settings"** → **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Enter your domain: `www.yourdomain.com`
5. Follow DNS configuration instructions

### 5.2 Update Backend FRONTEND_URL

Update the `FRONTEND_URL` environment variable to your custom domain.

---

## 🎯 Deployment Checklist

### MongoDB Atlas
- [ ] Cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string obtained

### Backend (Render Web Service)
- [ ] Service created
- [ ] Environment variables configured
- [ ] Deployed successfully
- [ ] Health check endpoint working
- [ ] Backend URL saved

### Frontend (Render Static Site)
- [ ] Static site created
- [ ] Environment variables configured
- [ ] Deployed successfully
- [ ] Can access the website
- [ ] API calls working

### Final Configuration
- [ ] Backend FRONTEND_URL updated
- [ ] CORS configured correctly
- [ ] Database seeded (optional)
- [ ] Test all features

---

## 🔧 Important Configuration Notes

### Free Tier Limitations

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for one service)

**Solution for Production:**
- Upgrade to **Starter plan** ($7/month per service)
- Or use a cron job to ping your service every 10 minutes

### CORS Configuration

Your backend is already configured to accept requests from any origin in production. If you want to restrict:

Update `backend/server.js`:
```javascript
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};
```

---

## 🆘 Troubleshooting

### Backend Deploy Failed

**Check build logs:**
1. Go to backend service
2. Click **"Logs"** tab
3. Look for errors

**Common issues:**
- Missing environment variables
- MongoDB connection failed (check URI)
- Port configuration (Render uses dynamic PORT)

### Frontend Build Failed

**Common issues:**
- Missing environment variables
- Build command incorrect
- Wrong publish directory

**Solution:**
```bash
# Test build locally first
cd frontend
npm install
npm run build
# Check if dist/ folder is created
```

### API Calls Not Working

**Check:**
1. Backend is running (visit health endpoint)
2. VITE_API_URL is correct in frontend
3. CORS is configured correctly
4. Check browser console for errors

### Database Connection Failed

**Check:**
1. MongoDB URI is correct
2. Password doesn't contain special characters (URL encode if needed)
3. IP whitelist includes 0.0.0.0/0
4. Database user has correct permissions

---

## 📊 Monitoring Your Deployment

### Render Dashboard

Monitor your services:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory usage
- **Events**: Deployment history

### MongoDB Atlas

Monitor your database:
- **Metrics**: Database operations
- **Performance Advisor**: Optimization suggestions
- **Real-time**: Current operations

---

## 🔄 Updating Your Deployment

### Automatic Deployment

Render automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push

# Render will automatically detect and deploy
```

### Manual Deployment

1. Go to service in Render
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 💰 Cost Breakdown

### Free Tier (Testing)
- MongoDB Atlas: **FREE** (M0 cluster, 512MB storage)
- Render Backend: **FREE** (750 hours/month)
- Render Frontend: **FREE** (100GB bandwidth/month)
- **Total: $0/month**

### Production (Recommended)
- MongoDB Atlas: **FREE** (M0 cluster sufficient for small apps)
- Render Backend: **$7/month** (Starter plan, always on)
- Render Frontend: **FREE** (static sites are free)
- **Total: $7/month**

---

## ✅ Success Indicators

When everything is working:

1. **Backend Health Check**: ✅
   - Visit: `https://your-backend.onrender.com/health`
   - Returns success JSON

2. **Frontend Loads**: ✅
   - Visit: `https://your-frontend.onrender.com`
   - Website displays correctly

3. **API Integration**: ✅
   - Turfs load on homepage
   - Can view turf details
   - Booking system works

4. **Database**: ✅
   - Data persists across deployments
   - Can create/read/update/delete

---

## 🎉 Your App is Live!

**Backend URL**: `https://shivas-hub-backend.onrender.com`  
**Frontend URL**: `https://shivas-hub-frontend.onrender.com`  
**Database**: MongoDB Atlas

Share your live app with the world! 🚀

---

**Need Help?**
- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Community: https://community.render.com
