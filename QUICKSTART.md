# 🚀 Quick Start Guide - Shiva's Hub

## Overview

Shiva's Hub is a complete MERN stack box cricket turf booking platform with:
- ✅ Real-time slot locking (3-minute timeout)
- ✅ Razorpay payment integration
- ✅ JWT authentication with refresh tokens
- ✅ Admin dashboard
- ✅ Cloudinary image management
- ✅ PDF invoice generation
- ✅ Mobile-responsive UI with Tailwind CSS

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- MongoDB (local or Atlas account)
- Git
- Code editor (VS Code recommended)

## 🛠️ Local Development Setup

### Step 1: Clone & Navigate

```bash
cd "d:/vansh1/shiva's box/shivas-hub"
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env with your credentials
# - MongoDB URI
# - JWT secrets
# - Razorpay keys (test mode)
# - Cloudinary credentials

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Step 3: Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:5000/api
# VITE_RAZORPAY_KEY_ID=your_test_key

# Start frontend server
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🔑 Default Credentials

After seeding, use these credentials:

### Admin Account
```
Email: admin@shivashub.com
Password: Admin@123
```

### Test User Accounts
```
Email: rahul@example.com
Password: password123

Email: priya@example.com
Password: password123
```

## 📁 Project Structure

```
shivas-hub/
├── backend/                 # Node.js + Express backend
│   ├── config/             # Database, Cloudinary, Razorpay config
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   └── server.js           # Entry point
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth)
│   │   ├── utils/         # API client
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── COMPONENTS.md          # Component code reference
├── PAGES.md              # Page code reference
├── DEPLOYMENT.md         # Deployment guide
└── README.md             # Project documentation
```

## 🧪 Testing the Application

### 1. Browse Turfs
- Visit `http://localhost:5173`
- View all available turfs
- Use search and filters

### 2. User Registration
- Click "Sign Up"
- Fill in details
- Auto-login after registration

### 3. Book a Turf
- Click "Book Now" on any turf
- Select date (today or tomorrow)
- Choose an available slot
- Slot locks for 3 minutes
- Proceed to payment

### 4. Payment Testing

Use Razorpay test cards:
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date
```

### 5. Admin Features
- Login as admin
- Access `/admin/dashboard`
- View statistics
- Manage turfs
- View bookings

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register    - Register user
POST /api/auth/login       - Login user
POST /api/auth/refresh     - Refresh token
GET  /api/auth/me          - Get current user
```

### Turfs
```
GET    /api/turfs          - Get all turfs
GET    /api/turfs/:id      - Get turf details
POST   /api/turfs          - Create turf (Admin)
PUT    /api/turfs/:id      - Update turf (Admin)
DELETE /api/turfs/:id      - Delete turf (Admin)
```

### Slots
```
GET  /api/slots/:turfId    - Get slots for turf
POST /api/slots/lock       - Lock a slot
POST /api/slots/unlock     - Unlock a slot
POST /api/slots/generate   - Generate slots (Admin)
```

### Bookings
```
POST /api/bookings              - Create booking
GET  /api/bookings              - Get user bookings
GET  /api/bookings/:id          - Get booking details
PUT  /api/bookings/:id/cancel   - Cancel booking
GET  /api/bookings/:id/invoice  - Download invoice
GET  /api/admin/bookings        - Get all bookings (Admin)
GET  /api/admin/bookings/stats  - Get statistics (Admin)
```

### Payments
```
POST /api/payment/create   - Create Razorpay order
POST /api/payment/verify   - Verify payment
POST /api/payment/failure  - Handle payment failure
```

## 🎨 Key Features Implementation

### 1. Real-time Slot Locking
- User clicks slot → Locked for 3 minutes
- MongoDB TTL index auto-unlocks expired slots
- Prevents double booking

### 2. JWT Authentication
- Access token (15 min expiry)
- Refresh token (7 days expiry)
- Auto-refresh on token expiry

### 3. Payment Flow
1. User selects slot
2. Slot gets locked
3. Razorpay order created
4. User completes payment
5. Payment verified via signature
6. Slot marked as booked
7. Invoice generated

### 4. Admin Dashboard
- Total revenue
- Today's bookings
- Upcoming matches
- Turf management
- Booking management

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
# Verify .env file exists
# Check port 5000 is free
```

### Frontend won't start
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Check port 5173 is free
```

### Database connection error
```bash
# Verify MongoDB is running (local)
# Or check MongoDB Atlas connection string
# Whitelist your IP in Atlas
```

### Payment not working
```bash
# Use Razorpay test mode keys
# Check RAZORPAY_KEY_ID in both backend and frontend
# Verify signature verification logic
```

## 📚 Additional Resources

### Code References
- `COMPONENTS.md` - All React components
- `PAGES.md` - All page components
- `DEPLOYMENT.md` - Production deployment

### External Documentation
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Razorpay](https://razorpay.com/docs/)

## 🔄 Development Workflow

1. **Backend Changes**
   - Edit files in `backend/`
   - Server auto-restarts (nodemon)
   - Test with Postman/Thunder Client

2. **Frontend Changes**
   - Edit files in `frontend/src/`
   - Hot reload enabled
   - Check browser console for errors

3. **Database Changes**
   - Modify models in `backend/models/`
   - Re-run seed if needed: `npm run seed`

## 📝 Next Steps

1. ✅ Complete remaining page components (see PAGES.md)
2. ✅ Test all user flows
3. ✅ Customize branding and colors
4. ✅ Add more turfs via admin panel
5. ✅ Deploy to production (see DEPLOYMENT.md)

## 💡 Tips

- Use MongoDB Compass to view database
- Use React DevTools for debugging
- Check browser Network tab for API calls
- Monitor backend logs for errors
- Use Postman for API testing

## 🆘 Support

For issues or questions:
- Check documentation files
- Review error logs
- Test with sample credentials
- Verify environment variables

---

**Happy Coding! 🚀**
