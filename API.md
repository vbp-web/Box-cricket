# 📡 API Documentation - Shiva's Hub

Base URL: `http://localhost:5000/api` (Development)

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 🔐 Auth Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "user"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

---

## 🏏 Turf Endpoints

### Get All Turfs
```http
GET /turfs?search=&city=&minPrice=&maxPrice=&rating=&page=1&limit=10
```

**Query Parameters:**
- `search` - Search in name/description
- `city` - Filter by city
- `minPrice` - Minimum price per hour
- `maxPrice` - Maximum price per hour
- `rating` - Minimum rating
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "turfs": [
      {
        "_id": "64abc...",
        "name": "Champions Cricket Arena",
        "description": "Premium box cricket turf...",
        "location": {
          "address": "Near GIDC Circle, Kalol",
          "city": "Kalol",
          "state": "Gujarat"
        },
        "images": [
          {
            "url": "https://...",
            "publicId": "..."
          }
        ],
        "pricePerHour": 1200,
        "facilities": ["Parking", "Washroom", ...],
        "rating": 4.5,
        "totalReviews": 45
      }
    ],
    "pagination": {
      "total": 4,
      "page": 1,
      "pages": 1,
      "limit": 10
    }
  }
}
```

### Get Turf by ID
```http
GET /turfs/:id
```

### Create Turf (Admin Only)
```http
POST /turfs
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "New Cricket Arena",
  "description": "Premium turf with all facilities",
  "location": {
    "address": "123 Main St",
    "city": "Kalol",
    "state": "Gujarat",
    "pincode": "382721"
  },
  "pricePerHour": 1500,
  "facilities": ["Parking", "Washroom"],
  "turfType": "Artificial Grass",
  "operatingHours": {
    "open": "06:00",
    "close": "23:00"
  },
  "images": ["base64_image_string"]
}
```

### Update Turf (Admin Only)
```http
PUT /turfs/:id
Authorization: Bearer <admin_token>
```

### Delete Turf (Admin Only)
```http
DELETE /turfs/:id
Authorization: Bearer <admin_token>
```

---

## ⏰ Slot Endpoints

### Get Slots for Turf
```http
GET /slots/:turfId?date=2024-01-15
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "slots": [
      {
        "_id": "64abc...",
        "turf": "64abc...",
        "date": "2024-01-15T00:00:00.000Z",
        "startTime": "06:00",
        "endTime": "07:00",
        "price": 1200,
        "status": "available"
      },
      {
        "_id": "64def...",
        "startTime": "07:00",
        "endTime": "08:00",
        "status": "locked",
        "lockedBy": "64user...",
        "lockedAt": "2024-01-15T06:55:00.000Z"
      },
      {
        "_id": "64ghi...",
        "startTime": "08:00",
        "endTime": "09:00",
        "status": "booked",
        "bookedBy": "64user..."
      }
    ]
  }
}
```

### Lock Slot
```http
POST /slots/lock
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "slotId": "64abc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Slot locked successfully",
  "data": {
    "slot": { ... },
    "expiresIn": 180
  }
}
```

### Unlock Slot
```http
POST /slots/unlock
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "slotId": "64abc..."
}
```

### Generate Slots (Admin Only)
```http
POST /slots/generate
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "turfId": "64abc...",
  "startDate": "2024-01-15",
  "endDate": "2024-01-22",
  "slotDuration": 60
}
```

---

## 📅 Booking Endpoints

### Create Booking
```http
POST /bookings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "slotId": "64abc..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "_id": "64booking...",
      "bookingId": "SH24011500123",
      "user": "64user...",
      "turf": "64turf...",
      "slot": "64slot...",
      "date": "2024-01-15T00:00:00.000Z",
      "startTime": "06:00",
      "endTime": "07:00",
      "totalAmount": 1200,
      "status": "pending",
      "paymentStatus": "pending"
    }
  }
}
```

### Get User Bookings
```http
GET /bookings?status=&page=1&limit=10
Authorization: Bearer <token>
```

### Get Booking by ID
```http
GET /bookings/:id
Authorization: Bearer <token>
```

### Cancel Booking
```http
PUT /bookings/:id/cancel
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Change of plans"
}
```

### Download Invoice
```http
GET /bookings/:id/invoice
Authorization: Bearer <token>
```

Returns PDF file

### Get All Bookings (Admin)
```http
GET /admin/bookings?status=&paymentStatus=&startDate=&endDate=&page=1
Authorization: Bearer <admin_token>
```

### Get Booking Statistics (Admin)
```http
GET /admin/bookings/stats
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalBookings": 150,
    "todayBookings": 12,
    "upcomingBookings": 45,
    "cancelledBookings": 8,
    "totalRevenue": 180000,
    "todayRevenue": 14400
  }
}
```

---

## 💳 Payment Endpoints

### Create Payment Order
```http
POST /payment/create
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "bookingId": "64booking..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "orderId": "order_razorpay123",
    "amount": 120000,
    "currency": "INR",
    "keyId": "rzp_test_...",
    "payment": { ... }
  }
}
```

### Verify Payment
```http
POST /payment/verify
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "razorpayOrderId": "order_razorpay123",
  "razorpayPaymentId": "pay_razorpay456",
  "razorpaySignature": "signature_hash",
  "paymentMethod": "card"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "payment": { ... },
    "booking": {
      "status": "confirmed",
      "paymentStatus": "paid"
    }
  }
}
```

### Handle Payment Failure
```http
POST /payment/failure
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "razorpayOrderId": "order_razorpay123",
  "reason": "Payment cancelled by user"
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized as admin"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## 🔄 Token Refresh Flow

1. Access token expires (15 min)
2. API returns 401 with code "TOKEN_EXPIRED"
3. Frontend automatically calls `/auth/refresh`
4. New access token received
5. Original request retried with new token

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Prices are in INR (Indian Rupees)
- Slot lock duration: 180 seconds (3 minutes)
- Images are uploaded to Cloudinary
- Invoices are generated as PDF files

---

**For testing, use Postman or Thunder Client with the provided endpoints.**
