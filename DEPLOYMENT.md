# 🚀 Deployment Guide - Shiva's Hub

This guide will help you deploy the Shiva's Hub platform to production.

## Prerequisites

- MongoDB Atlas account
- Razorpay account
- Cloudinary account
- Vercel account (for frontend)
- Render/Railway account (for backend)

## 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier available)
3. Create a database user:
   - Database Access → Add New Database User
   - Set username and password
4. Whitelist IP addresses:
   - Network Access → Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (for production, use specific IPs)
5. Get connection string:
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password

## 2. Razorpay Setup

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up/Login
3. Get API keys:
   - Settings → API Keys
   - Generate Test/Live Keys
   - Copy `Key ID` and `Key Secret`

## 3. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up/Login
3. Get credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret

## 4. Backend Deployment (Render)

### Option A: Using Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   ```
   Name: shivas-hub-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```
6. Add Environment Variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_REFRESH_SECRET=your_super_secret_refresh_key
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   FRONTEND_URL=https://your-frontend-url.vercel.app
   SLOT_LOCK_DURATION=180
   ADMIN_EMAIL=admin@shivashub.com
   ADMIN_PASSWORD=Admin@123
   ```
7. Click "Create Web Service"
8. Wait for deployment to complete
9. Copy the deployed URL (e.g., `https://shivas-hub-backend.onrender.com`)

### Option B: Using Railway

1. Go to [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables (same as above)
5. Deploy

## 5. Seed Database

After backend deployment:

1. Open Render/Railway shell or use local terminal
2. Run seed command:
   ```bash
   npm run seed
   ```
3. This will create:
   - Admin user
   - Sample turfs
   - Slots for next 7 days

## 6. Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
6. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```
7. Click "Deploy"
8. Wait for deployment to complete
9. Copy the deployed URL

## 7. Update Backend CORS

1. Go to your backend deployment (Render/Railway)
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy if necessary

## 8. Testing

1. Visit your frontend URL
2. Test user registration and login
3. Browse turfs
4. Test slot booking flow
5. Test payment integration (use Razorpay test cards)
6. Login as admin and test admin features

### Razorpay Test Cards

```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

## 9. Custom Domain (Optional)

### For Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Backend (Render)
1. Go to Settings → Custom Domain
2. Add your custom domain
3. Update DNS records

## 10. Monitoring & Logs

### Backend Logs (Render)
- Dashboard → Your Service → Logs

### Frontend Logs (Vercel)
- Dashboard → Your Project → Deployments → View Function Logs

## 11. Environment-Specific Configuration

### Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Production
- Backend runs on Render/Railway
- Frontend runs on Vercel
- MongoDB on Atlas

## 12. Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secrets
- [ ] Enable MongoDB IP whitelist
- [ ] Use HTTPS only
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Monitor error logs
- [ ] Backup database regularly

## 13. Maintenance

### Update Dependencies
```bash
npm update
```

### Database Backup
- MongoDB Atlas → Clusters → Backup
- Schedule automatic backups

### Monitor Performance
- Use Render/Vercel analytics
- Monitor API response times
- Check error rates

## 14. Troubleshooting

### Backend Issues
- Check environment variables
- Verify MongoDB connection
- Check Render logs
- Verify API endpoints

### Frontend Issues
- Check VITE_API_URL
- Verify Razorpay key
- Check browser console
- Verify CORS settings

### Payment Issues
- Verify Razorpay keys
- Check webhook configuration
- Test with Razorpay test mode

## 15. Support

For issues or questions:
- Email: support@shivashub.com
- GitHub Issues: [Your Repo URL]

---

**Congratulations! 🎉 Your Shiva's Hub platform is now live!**
