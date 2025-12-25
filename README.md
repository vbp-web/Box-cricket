# 🏏 Shiva's Hub - Box Cricket Booking Platform

A modern, full-stack web application for managing box cricket turf bookings with real-time slot management, secure UPI payments, and comprehensive admin dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

---

## ✨ Features

### For Users
- 🏟️ **Browse Turfs** - View available cricket turfs with detailed information
- 📅 **Real-time Booking** - Book slots with live availability updates
- 🔒 **Slot Locking** - Automatic 3-minute slot reservation during booking
- 💳 **UPI Payments** - Secure QR code-based payment integration
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🔐 **User Authentication** - Secure login and registration with JWT
- 📧 **Booking Confirmations** - Email notifications for bookings
- 📄 **Invoice Generation** - Automatic PDF invoice creation

### For Admins
- 📊 **Dashboard** - Comprehensive overview of bookings and revenue
- ➕ **Turf Management** - Add, edit, and manage cricket turfs
- 🎯 **Slot Management** - Create and manage time slots for each turf
- 📋 **Booking Management** - View and manage all bookings
- 💰 **Offline Bookings** - Create bookings for walk-in customers
- 📈 **Analytics** - Track bookings, revenue, and performance

---

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Vite** - Fast build tool
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **PDFKit** - PDF generation
- **Nodemailer** - Email service
- **Winston** - Logging

---

## 📦 Local Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for images)
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/vbp-web/Box-cricket.git
cd Box-cricket
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# Add MongoDB URI, JWT secrets, Cloudinary keys, etc.
```

**Backend Environment Variables (.env):**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/shivas-hub

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_characters
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# UPI Payment
UPI_ID=yourname@paytm
BUSINESS_NAME=Shiva's Box Cricket

# Cloudinary (Get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
FRONTEND_URL=http://localhost:5173

# Admin
ADMIN_EMAIL=admin@shivashub.com
ADMIN_PASSWORD=Admin@123

# Slot Lock Duration (seconds)
SLOT_LOCK_DURATION=180
```

**Start Backend:**
```bash
npm run dev
# Backend runs on http://localhost:5000
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install

# Create .env file (optional, auto-detects API URL)
cp .env.example .env
```

**Frontend Environment Variables (.env) - Optional:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

**Start Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 4: Seed Database (Optional)
```bash
cd backend
npm run seed
```

This creates:
- Admin user (admin@shivashub.com / Admin@123)
- Sample turfs
- Sample slots
- Sample bookings

### Step 5: Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 📱 Mobile Access (Same Network)

To test on mobile devices:

1. **Find your computer's IP address:**
   ```bash
   ipconfig | findstr IPv4
   ```
   Example: `192.168.1.100`

2. **Access from mobile:**
   - Frontend: `http://192.168.1.100:5173`
   - Backend: `http://192.168.1.100:5000`

The app automatically detects and uses the correct API URL! ✨

---

## 🌐 Production Deployment (Render + MongoDB Atlas)

### Prerequisites
- GitHub account (code already pushed)
- MongoDB Atlas account
- Render account
- Cloudinary account

---

### Part 1: Setup MongoDB Atlas (10 minutes)

1. **Create Account & Cluster**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free account
   - Create new cluster (FREE M0 tier)
   - Choose AWS, closest region
   - Cluster name: `shivas-hub-cluster`

2. **Create Database User**
   - Click "Database Access" → "Add New Database User"
   - Username: `shivashub-admin`
   - Click "Autogenerate Secure Password" → **SAVE IT**
   - Privileges: "Read and write to any database"

3. **Whitelist IP Addresses**
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere"
   - IP: `0.0.0.0/0` (for Render)

4. **Get Connection String**
   - Click "Database" → "Connect" → "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://shivashub-admin:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `/shivas-hub`
   ```
   mongodb+srv://shivashub-admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/shivas-hub?retryWrites=true&w=majority
   ```
   - **SAVE THIS** for Render

---

### Part 2: Deploy Backend to Render (15 minutes)

1. **Create Render Account**
   - Go to: https://render.com
   - Sign up with GitHub account
   - Authorize Render to access repositories

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect repository: `vbp-web/Box-cricket`
   
   **Configure:**
   - Name: `shivas-hub-backend`
   - Region: Choose closest to users
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free** (or Starter for production)

3. **Add Environment Variables**
   
   Click "Advanced" → "Add Environment Variable" and add these:

   ```env
   NODE_ENV=production
   
   MONGO_URI=mongodb+srv://shivashub-admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/shivas-hub?retryWrites=true&w=majority
   
   JWT_SECRET=generate_a_strong_random_32_character_string_here
   JWT_REFRESH_SECRET=generate_another_strong_random_32_character_string
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
   - Generate JWT secrets: https://randomkeygen.com/
   - Get Cloudinary credentials: https://cloudinary.com
   - Update FRONTEND_URL after deploying frontend

4. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://shivas-hub-backend.onrender.com`
   - **SAVE THIS URL**

5. **Test Backend**
   - Visit: `https://shivas-hub-backend.onrender.com/health`
   - Should return: `{"success": true, "message": "Shiva's Hub API is running"}`

---

### Part 3: Deploy Frontend to Render (10 minutes)

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect repository: `vbp-web/Box-cricket`
   
   **Configure:**
   - Name: `shivas-hub-frontend`
   - Branch: `main`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Add Environment Variables**
   
   ```env
   VITE_API_URL=https://shivas-hub-backend.onrender.com/api
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
   ```
   
   **Replace** `shivas-hub-backend.onrender.com` with your actual backend URL from Part 2.

3. **Deploy**
   - Click "Create Static Site"
   - Wait 5-10 minutes
   - You'll get a URL like: `https://shivas-hub-frontend.onrender.com`

4. **Update Backend FRONTEND_URL**
   - Go to backend service in Render
   - Click "Environment"
   - Update `FRONTEND_URL` to your frontend URL
   - Click "Save Changes" (backend will redeploy)

---

### Part 4: Final Steps

1. **Test Your Live App**
   - Visit your frontend URL
   - Homepage should load with turfs
   - Click on a turf → Details should load
   - Register/Login should work
   - Booking flow should work

2. **Seed Database (Optional)**
   - In Render backend service, click "Shell"
   - Run: `npm run seed`
   - This creates admin user and sample data

---

## 🎯 Deployment Checklist

### MongoDB Atlas
- [ ] Cluster created (free M0)
- [ ] Database user created
- [ ] IP whitelist: 0.0.0.0/0
- [ ] Connection string obtained

### Render Backend
- [ ] Web Service created
- [ ] Environment variables configured
- [ ] Deployed successfully
- [ ] Health check working
- [ ] Backend URL saved

### Render Frontend
- [ ] Static Site created
- [ ] Environment variables configured
- [ ] Deployed successfully
- [ ] Website loads
- [ ] API calls working

### Final Configuration
- [ ] Backend FRONTEND_URL updated
- [ ] All features tested
- [ ] Database seeded (optional)

---

## 🔄 Updating Your Deployment

Render automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update: description of changes"
git push

# Render automatically detects and deploys!
```

---

## 🆘 Troubleshooting

### Backend Deploy Failed
- Check build logs in Render dashboard
- Verify all environment variables are set
- Test MongoDB connection string locally

### Frontend Build Failed
- Verify `VITE_API_URL` is correct
- Check build command: `npm install && npm run build`
- Ensure publish directory is `dist`

### API Calls Not Working
- Check backend is running (visit health endpoint)
- Verify CORS configuration
- Check browser console for errors
- Ensure `VITE_API_URL` includes `/api`

### Database Connection Failed
- Verify MongoDB URI is correct
- Check IP whitelist includes 0.0.0.0/0
- Ensure password doesn't have special characters (URL encode if needed)

### Mobile Access Not Working (Local Development)
- Ensure both devices on same Wi-Fi
- Backend must listen on 0.0.0.0 (already configured)
- Check Windows Firewall allows Node.js
- Frontend auto-detects correct API URL

---

## 💰 Cost Breakdown

### Free Tier (Testing)
- MongoDB Atlas: **FREE** (M0, 512MB)
- Render Backend: **FREE** (spins down after 15 min inactivity)
- Render Frontend: **FREE** (100GB bandwidth/month)
- **Total: $0/month**

### Production (Recommended)
- MongoDB Atlas: **FREE** (M0 sufficient for small apps)
- Render Backend: **$7/month** (Starter, always on)
- Render Frontend: **FREE**
- **Total: $7/month**

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Turfs
- `GET /api/turfs` - Get all turfs (with filters)
- `GET /api/turfs/:id` - Get single turf
- `POST /api/turfs` - Create turf (Admin)
- `PUT /api/turfs/:id` - Update turf (Admin)
- `DELETE /api/turfs/:id` - Delete turf (Admin)

### Slots
- `GET /api/slots/:turfId` - Get slots for turf
- `POST /api/slots` - Create slots (Admin)
- `POST /api/slots/lock` - Lock slot for booking
- `DELETE /api/slots/:id` - Delete slot (Admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/all` - Get all bookings (Admin)
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update booking status (Admin)

### Payments
- `POST /api/payment/verify` - Verify UPI payment

---

## 🔐 Security Features

- ✅ JWT-based authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on API endpoints
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Secure environment variables
- ✅ HTTPS in production (automatic on Render)

---

## 📝 Default Admin Credentials

After seeding the database:
- **Email**: admin@shivashub.com
- **Password**: Admin@123

**⚠️ Change these in production!**

---

## 🎨 Project Structure

```
Box-cricket/
├── backend/
│   ├── config/          # Database, Cloudinary, Razorpay config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth, error handling, logging
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── server.js        # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/       # Page components
│   │   ├── utils/       # API client, helpers
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Shiva's Hub Team**

- GitHub: [@vbp-web](https://github.com/vbp-web)
- Repository: [Box-cricket](https://github.com/vbp-web/Box-cricket)

---

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js for the robust backend framework
- MongoDB for the flexible database
- Tailwind CSS for beautiful styling
- Render for easy deployment
- All open-source contributors

---

## 📞 Support

For support or questions:
- Open an issue on GitHub
- Email: admin@shivashub.com

---

## 🗺️ Future Roadmap

- [ ] Razorpay payment gateway integration
- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Customer reviews and ratings
- [ ] Loyalty program
- [ ] Automated email reminders
- [ ] SMS notifications
- [ ] Social media integration

---

## ⭐ Star This Repository

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

**Made with ❤️ by Shiva's Hub Team**

🏏 **Happy Booking!** 🎉
