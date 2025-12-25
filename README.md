# 🏏 Shiva's Hub - Box Cricket Booking Platform

A modern, full-stack web application for managing box cricket turf bookings with real-time slot management, secure payments, and admin dashboard.

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

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for images)
- Git

### Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/shivas-hub.git
cd shivas-hub
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your credentials
# Add MongoDB URI, JWT secrets, Cloudinary keys, etc.

# Start backend server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Start frontend dev server
npm run dev
```

### Access Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/health

---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/shivas-hub

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# UPI Payment
UPI_ID=yourname@paytm
BUSINESS_NAME=Shiva's Box Cricket

# Cloudinary
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

### Frontend Environment Variables

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

---

## 📱 Mobile Access

To test on mobile devices on the same network:

1. Find your computer's IP address:
   ```bash
   ipconfig | findstr IPv4
   ```

2. Access from mobile:
   - Frontend: `http://YOUR_IP:5173`
   - Backend: `http://YOUR_IP:5000`

The app automatically detects and uses the correct API URL!

See `MOBILE_FIX_GUIDE.md` for detailed instructions.

---

## 🗄️ Database Seeding

Seed the database with sample data:

```bash
cd backend
npm run seed
```

This creates:
- Admin user (admin@shivashub.com / Admin@123)
- Sample turfs
- Sample slots
- Sample bookings

---

## 📚 API Documentation

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

See `API.md` for complete API documentation.

---

## 🚀 Deployment

### Deploy to Render + MongoDB Atlas

**Quick Steps:**

1. **Upload to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/shivas-hub.git
   git push -u origin main
   ```

2. **Setup MongoDB Atlas**
   - Create free cluster at https://mongodb.com/cloud/atlas
   - Get connection string

3. **Deploy Backend to Render**
   - Create Web Service
   - Connect GitHub repo
   - Add environment variables
   - Deploy

4. **Deploy Frontend to Render**
   - Create Static Site
   - Connect GitHub repo
   - Add environment variables
   - Deploy

**Detailed Guides:**
- `QUICK_DEPLOYMENT_GUIDE.md` - Quick overview
- `GITHUB_DEPLOYMENT_GUIDE.md` - GitHub setup
- `RENDER_DEPLOYMENT_GUIDE.md` - Complete Render deployment

---

## 📖 Documentation

- `QUICKSTART.md` - Quick start guide
- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `API.md` - API documentation
- `STRUCTURE.md` - Project structure
- `TESTING_GUIDE.md` - Testing instructions
- `MOBILE_FIX_GUIDE.md` - Mobile access setup
- `DEPLOYMENT.md` - Deployment guide

---

## 🎨 Screenshots

### Homepage
Browse available cricket turfs with search and filters.

### Turf Details
View detailed information, facilities, and available time slots.

### Booking Page
Select date, choose slot, and complete payment.

### Admin Dashboard
Manage turfs, slots, and bookings from a comprehensive dashboard.

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on API endpoints
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Secure environment variables
- ✅ Token refresh mechanism

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Manual Testing
See `TESTING_GUIDE.md` for comprehensive testing checklist.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shiva's Hub Team**

- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Email: admin@shivashub.com

---

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js for the robust backend framework
- MongoDB for the flexible database
- Tailwind CSS for beautiful styling
- All open-source contributors

---

## 📞 Support

For support, email admin@shivashub.com or open an issue on GitHub.

---

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] Razorpay payment gateway integration
- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Customer reviews and ratings
- [ ] Loyalty program
- [ ] Automated email reminders

See `UPGRADE_ROADMAP.md` for detailed future plans.

---

## 📊 Project Stats

- **Total Files**: 100+
- **Lines of Code**: 10,000+
- **Components**: 15+
- **API Endpoints**: 25+
- **Database Models**: 6

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐!

---

**Made with ❤️ by Shiva's Hub Team**

---

## Quick Links

- [Live Demo](#) (Coming Soon)
- [Documentation](./QUICKSTART.md)
- [API Docs](./API.md)
- [Deployment Guide](./QUICK_DEPLOYMENT_GUIDE.md)
- [Report Bug](https://github.com/YOUR_USERNAME/shivas-hub/issues)
- [Request Feature](https://github.com/YOUR_USERNAME/shivas-hub/issues)
