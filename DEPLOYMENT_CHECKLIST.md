# ✅ Deployment Checklist

Use this checklist to ensure smooth deployment of Shiva's Hub to GitHub and Render.

---

## 📋 Pre-Deployment Checklist

### Code Preparation
- [ ] All features tested locally
- [ ] Backend server runs without errors
- [ ] Frontend builds successfully (`npm run build`)
- [ ] No console errors in browser
- [ ] All API endpoints working
- [ ] Database connection successful
- [ ] Environment variables documented

### Files to Check
- [ ] `.gitignore` properly configured
- [ ] `.env.example` files present (backend & frontend)
- [ ] `package.json` files have correct scripts
- [ ] `README.md` is complete and accurate
- [ ] No sensitive data in code (API keys, passwords)
- [ ] `package-lock.json` files present (NOT in .gitignore)

### Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Setup instructions clear
- [ ] Deployment guides reviewed

---

## 🐙 GitHub Deployment Checklist

### Account Setup
- [ ] GitHub account created
- [ ] Email verified
- [ ] Profile set up

### Repository Creation
- [ ] Repository created on GitHub
- [ ] Repository name: `shivas-hub` (or your choice)
- [ ] Visibility set (Public/Private)
- [ ] Description added

### Local Git Setup
- [ ] Git initialized (`git init`)
- [ ] All files staged (`git add .`)
- [ ] Initial commit created
- [ ] Remote origin added
- [ ] Branch renamed to main (`git branch -M main`)

### Push to GitHub
- [ ] Code pushed successfully (`git push -u origin main`)
- [ ] All files visible on GitHub
- [ ] `.env` files NOT visible (properly ignored)
- [ ] `package-lock.json` files visible
- [ ] README displays correctly

### Verify Upload
- [ ] Repository accessible online
- [ ] File count looks correct
- [ ] No sensitive data exposed
- [ ] License file present (optional)

**GitHub Repository URL**: `https://github.com/YOUR_USERNAME/shivas-hub`

---

## 🗄️ MongoDB Atlas Checklist

### Account Setup
- [ ] MongoDB Atlas account created
- [ ] Email verified
- [ ] Organization created

### Cluster Setup
- [ ] Free M0 cluster created
- [ ] Cloud provider: AWS selected
- [ ] Region selected (closest to users)
- [ ] Cluster name: `shivas-hub-cluster`
- [ ] Cluster status: Active

### Database User
- [ ] Database user created
- [ ] Username: `shivashub-admin` (or your choice)
- [ ] Strong password generated
- [ ] Password saved securely
- [ ] User privileges: Read and write to any database

### Network Access
- [ ] IP whitelist configured
- [ ] 0.0.0.0/0 added (allow from anywhere)
- [ ] Status: Active

### Connection String
- [ ] Connection string obtained
- [ ] Password replaced in string
- [ ] Database name added: `/shivas-hub`
- [ ] Connection string tested locally
- [ ] Connection string saved for Render

**Example Connection String**:
```
mongodb+srv://shivashub-admin:PASSWORD@cluster.xxxxx.mongodb.net/shivas-hub?retryWrites=true&w=majority
```

---

## 🚀 Render Backend Deployment Checklist

### Account Setup
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] Repository access granted

### Web Service Creation
- [ ] New Web Service created
- [ ] Repository connected: `shivas-hub`
- [ ] Service name: `shivas-hub-backend`
- [ ] Region selected
- [ ] Branch: `main`

### Build Configuration
- [ ] Root Directory: `backend`
- [ ] Runtime: Node
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Instance Type: Free (or Starter)

### Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `MONGO_URI` = MongoDB connection string
- [ ] `JWT_SECRET` = Strong random string (32+ chars)
- [ ] `JWT_REFRESH_SECRET` = Strong random string (32+ chars)
- [ ] `JWT_EXPIRE` = `15m`
- [ ] `JWT_REFRESH_EXPIRE` = `7d`
- [ ] `UPI_ID` = Your UPI ID
- [ ] `BUSINESS_NAME` = Your business name
- [ ] `CLOUDINARY_CLOUD_NAME` = Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` = Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` = Cloudinary API secret
- [ ] `FRONTEND_URL` = Frontend URL (update after frontend deploy)
- [ ] `ADMIN_EMAIL` = Admin email
- [ ] `ADMIN_PASSWORD` = Admin password
- [ ] `SLOT_LOCK_DURATION` = `180`
- [ ] `PORT` = `5000`

### Deployment
- [ ] Service created successfully
- [ ] Build completed without errors
- [ ] Service status: Live
- [ ] Backend URL obtained
- [ ] Backend URL saved

### Testing
- [ ] Health endpoint works: `/health`
- [ ] Returns success JSON
- [ ] API endpoints accessible
- [ ] Database connection successful
- [ ] Logs show no errors

**Backend URL**: `https://shivas-hub-backend.onrender.com`

---

## 🎨 Render Frontend Deployment Checklist

### Static Site Creation
- [ ] New Static Site created
- [ ] Repository connected: `shivas-hub`
- [ ] Site name: `shivas-hub-frontend`
- [ ] Branch: `main`

### Build Configuration
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`

### Environment Variables
- [ ] `VITE_API_URL` = Backend URL + `/api`
- [ ] `VITE_RAZORPAY_KEY_ID` = Razorpay key (if available)

### Deployment
- [ ] Site created successfully
- [ ] Build completed without errors
- [ ] Site status: Live
- [ ] Frontend URL obtained
- [ ] Frontend URL saved

### Testing
- [ ] Website loads correctly
- [ ] No console errors
- [ ] Images load properly
- [ ] Navigation works
- [ ] API calls successful
- [ ] Can view turfs
- [ ] Can view turf details
- [ ] Booking flow works

**Frontend URL**: `https://shivas-hub-frontend.onrender.com`

---

## 🔄 Post-Deployment Checklist

### Update Backend FRONTEND_URL
- [ ] Go to backend service in Render
- [ ] Update `FRONTEND_URL` environment variable
- [ ] Set to actual frontend URL
- [ ] Save changes
- [ ] Wait for automatic redeploy
- [ ] Verify CORS works

### Seed Database (Optional)
- [ ] Access backend shell in Render
- [ ] Run: `npm run seed`
- [ ] Verify admin user created
- [ ] Verify sample data created

### Final Testing
- [ ] Visit frontend URL
- [ ] Homepage loads
- [ ] Turfs display correctly
- [ ] Can click on turf
- [ ] Turf details page works
- [ ] Slots display
- [ ] Can register new user
- [ ] Can login
- [ ] Can book a slot
- [ ] Payment QR displays
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] Can create new turf (admin)
- [ ] Can manage slots (admin)
- [ ] Can view bookings (admin)

### Performance Check
- [ ] Page load time acceptable
- [ ] API response time good
- [ ] Images load quickly
- [ ] No broken links
- [ ] Mobile responsive
- [ ] Works on different browsers

### Security Check
- [ ] HTTPS enabled (automatic on Render)
- [ ] No sensitive data exposed
- [ ] API endpoints protected
- [ ] CORS configured correctly
- [ ] Rate limiting active

---

## 📊 Monitoring Setup

### Render Monitoring
- [ ] Check backend logs regularly
- [ ] Monitor frontend build logs
- [ ] Set up email notifications (optional)
- [ ] Review metrics dashboard

### MongoDB Monitoring
- [ ] Check database metrics
- [ ] Monitor storage usage
- [ ] Review performance advisor
- [ ] Set up alerts (optional)

---

## 📝 Documentation Updates

### Update URLs in Documentation
- [ ] Update README.md with live URLs
- [ ] Update API.md if needed
- [ ] Add deployment date
- [ ] Document any deployment issues

### Share Information
- [ ] Note backend URL
- [ ] Note frontend URL
- [ ] Note admin credentials
- [ ] Share with team (if applicable)

---

## 🎉 Launch Checklist

### Pre-Launch
- [ ] All features working
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation complete

### Launch
- [ ] Announce to users
- [ ] Share live URL
- [ ] Monitor for issues
- [ ] Be ready for support

### Post-Launch
- [ ] Monitor logs for errors
- [ ] Check user feedback
- [ ] Fix any issues quickly
- [ ] Plan next updates

---

## 🔧 Maintenance Checklist

### Regular Tasks
- [ ] Check logs weekly
- [ ] Monitor database size
- [ ] Review error reports
- [ ] Update dependencies monthly
- [ ] Backup database regularly

### Updates
- [ ] Test changes locally first
- [ ] Commit to GitHub
- [ ] Verify auto-deployment
- [ ] Test after deployment
- [ ] Monitor for issues

---

## 📞 Important Information

### URLs
```
GitHub: https://github.com/YOUR_USERNAME/shivas-hub
Backend: https://shivas-hub-backend.onrender.com
Frontend: https://shivas-hub-frontend.onrender.com
MongoDB: https://cloud.mongodb.com
```

### Credentials (Keep Secure!)
```
Admin Email: admin@shivashub.com
Admin Password: [Your secure password]
MongoDB User: shivashub-admin
MongoDB Password: [Your database password]
```

### Support Resources
```
Render Docs: https://render.com/docs
MongoDB Docs: https://docs.mongodb.com
GitHub Docs: https://docs.github.com
```

---

## ✅ Deployment Complete!

**Congratulations!** 🎉

Your Shiva's Hub application is now live and accessible to users worldwide!

**Next Steps:**
1. Share your live URL with users
2. Monitor application performance
3. Gather user feedback
4. Plan feature updates
5. Enjoy your success! 🚀

---

**Deployment Date**: _________________  
**Deployed By**: _________________  
**Status**: ✅ **LIVE**

---

**For future deployments, updates are automatic:**
```bash
git add .
git commit -m "Update: description"
git push
# Render automatically deploys!
```
