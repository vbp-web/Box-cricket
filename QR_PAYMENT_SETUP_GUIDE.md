# Google Pay / UPI QR Code Payment Setup Guide

## 📱 Overview
This guide will help you set up **QR Code-based payment** for your Shiva's Hub booking system using Google Pay, PhonePe, Paytm, or any UPI app.

---

## 🎯 What's Been Implemented

### ✅ Frontend Changes:
1. **QRPaymentModal Component** - A beautiful modal that shows:
   - Your payment QR code
   - UPI ID for manual payment
   - Transaction ID input field
   - Screenshot upload functionality
   - Payment instructions

2. **Updated BookingPage** - Now uses QR payment instead of Razorpay

### ⚠️ What You Need to Do:

---

## 📋 Step 1: Get Your UPI QR Code

### Option A: Google Pay Business QR Code (Recommended)
1. Open **Google Pay** app
2. Tap on your **profile picture** → **Business tools** → **QR code**
3. Download your **QR code image**
4. Save it as `qr-code.png`

### Option B: PhonePe Business QR Code
1. Open **PhonePe** app
2. Go to **My Money** → **QR Code**
3. Download your business QR code
4. Save it as `qr-code.png`

### Option C: Paytm Business QR Code
1. Open **Paytm** app
2. Go to **Paytm for Business** → **QR Code**
3. Download your QR code
4. Save it as `qr-code.png`

---

## 📋 Step 2: Add QR Code to Your Project

1. **Place the QR code image** in your frontend public folder:
   ```
   shivas-hub/frontend/public/qr-code.png
   ```

2. **Update the QRPaymentModal component**:
   
   Open: `frontend/src/components/QRPaymentModal.jsx`
   
   Find line ~100 (in the QR Code section) and **uncomment** this code:
   ```javascript
   <img 
       src="/qr-code.png" 
       alt="Payment QR Code" 
       className="w-full h-full object-contain"
   />
   ```
   
   And **remove/comment** the placeholder div above it.

---

## 📋 Step 3: Update Your UPI ID

Open: `frontend/src/components/QRPaymentModal.jsx`

Find line ~12 and update with **your actual UPI ID**:

```javascript
// BEFORE (line 12):
const UPI_ID = "your-upi-id@paytm"; // Replace with your actual UPI ID

// AFTER (example):
const UPI_ID = "9876543210@paytm"; // Your actual UPI ID
```

**Where to find your UPI ID:**
- **Google Pay**: Profile → Settings → UPI ID
- **PhonePe**: Profile → Payment Settings → UPI ID
- **Paytm**: Profile → UPI & Linked Bank Accounts

---

## 📋 Step 4: Create Backend API Route

You need to create a backend route to handle QR payments.

### Create: `backend/routes/paymentRoutes.js`

Add this route:

```javascript
// QR Code Payment Route
router.post('/qr-payment', auth, upload.single('screenshot'), async (req, res) => {
    try {
        const { bookingId, transactionId, paymentMethod, amount } = req.body;
        const screenshot = req.file;

        if (!screenshot) {
            return res.status(400).json({
                success: false,
                message: 'Payment screenshot is required'
            });
        }

        // Find the booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Update booking with payment details
        booking.paymentStatus = 'pending'; // Will be verified by admin
        booking.paymentMethod = paymentMethod;
        booking.transactionId = transactionId;
        booking.paymentScreenshot = screenshot.path; // Save screenshot path
        booking.paymentAmount = amount;

        await booking.save();

        // TODO: Send notification to admin for verification
        // TODO: Send confirmation email to customer

        res.status(200).json({
            success: true,
            message: 'Payment details submitted successfully',
            data: {
                booking
            }
        });

    } catch (error) {
        console.error('QR Payment Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process payment details'
        });
    }
});
```

### Install Multer for File Uploads

```bash
cd backend
npm install multer
```

### Create Upload Configuration

Create: `backend/middleware/upload.js`

```javascript
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/payment-screenshots/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

module.exports = upload;
```

### Create Uploads Directory

```bash
mkdir -p backend/uploads/payment-screenshots
```

---

## 📋 Step 5: Update Booking Model

Add these fields to your Booking model:

```javascript
// In backend/models/Booking.js

paymentScreenshot: {
    type: String,
    default: null
},
transactionId: {
    type: String,
    default: null
},
paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'UPI/QR', 'cash', 'other'],
    default: 'UPI/QR'
},
```

---

## 📋 Step 6: Update Payment Success Page

Update: `frontend/src/pages/PaymentSuccess.jsx`

Add support for pending payments:

```javascript
const { booking, isPending } = location.state || {};

// In the render:
{isPending ? (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-yellow-800 font-semibold mb-2">
            ⏳ Payment Verification Pending
        </h3>
        <p className="text-yellow-700 text-sm">
            Your payment is being verified by our team. You will receive a confirmation 
            within 5-10 minutes via email/SMS.
        </p>
    </div>
) : (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="text-green-800 font-semibold mb-2">
            ✅ Payment Confirmed
        </h3>
    </div>
)}
```

---

## 🎨 How It Works

### Customer Flow:
1. Customer selects slots and fills booking details
2. Clicks "Proceed to Payment"
3. **QR Payment Modal opens** showing:
   - Your QR code to scan
   - Your UPI ID for manual payment
   - Instructions
4. Customer pays via any UPI app
5. Customer enters **Transaction ID** and uploads **screenshot**
6. Clicks "Confirm Payment"
7. Booking is created with status "pending"
8. Customer sees success page with "verification pending" message

### Admin Flow (Manual Verification):
1. Admin receives notification of new payment
2. Admin checks payment screenshot
3. Admin verifies transaction ID in their UPI app
4. Admin approves/rejects the booking
5. Customer receives confirmation

---

## 🔧 Testing

### Test the Payment Flow:

1. **Start your servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Make a test booking:**
   - Select a slot
   - Fill in details
   - Click "Proceed to Payment"
   - QR modal should open

3. **Test payment submission:**
   - Enter a test transaction ID: `TEST123456789`
   - Upload any image as screenshot
   - Click "Confirm Payment"

---

## 📱 Mobile Optimization

The QR Payment Modal is fully responsive:
- ✅ Works on mobile, tablet, and desktop
- ✅ "Pay with UPI App" button on mobile (opens UPI apps directly)
- ✅ Touch-friendly buttons
- ✅ Optimized image sizes

---

## 🔒 Security Considerations

1. **Validate Transaction IDs** - Check format and uniqueness
2. **Verify Screenshots** - Manual admin verification required
3. **Prevent Duplicate Payments** - Check transaction ID uniqueness
4. **Secure File Storage** - Store screenshots securely
5. **Email Notifications** - Send confirmation emails

---

## 📧 Optional: Email Notifications

Add email notifications when payment is submitted:

```javascript
// In backend after saving booking
const nodemailer = require('nodemailer');

// Send to customer
await sendEmail({
    to: booking.customerDetails.email,
    subject: 'Payment Received - Verification Pending',
    html: `
        <h2>Thank you for your booking!</h2>
        <p>We have received your payment details.</p>
        <p>Transaction ID: ${transactionId}</p>
        <p>Your booking will be confirmed within 5-10 minutes.</p>
    `
});

// Send to admin
await sendEmail({
    to: 'admin@shivashub.com',
    subject: 'New Payment to Verify',
    html: `
        <h2>New Payment Received</h2>
        <p>Booking ID: ${booking._id}</p>
        <p>Amount: ₹${amount}</p>
        <p>Transaction ID: ${transactionId}</p>
        <p>Please verify the payment screenshot.</p>
    `
});
```

---

## ✅ Checklist

- [ ] Downloaded QR code from UPI app
- [ ] Placed QR code in `frontend/public/qr-code.png`
- [ ] Updated UPI ID in `QRPaymentModal.jsx`
- [ ] Uncommented QR code image in modal
- [ ] Installed multer: `npm install multer`
- [ ] Created upload middleware
- [ ] Created uploads directory
- [ ] Added QR payment route to backend
- [ ] Updated Booking model with new fields
- [ ] Updated PaymentSuccess page
- [ ] Tested the complete flow

---

## 🎉 You're Done!

Your customers can now pay using:
- 📱 Google Pay
- 📱 PhonePe
- 📱 Paytm
- 📱 Any UPI app

**No payment gateway fees!** 🎊

---

## 🆘 Troubleshooting

### QR Code not showing?
- Check if `qr-code.png` exists in `frontend/public/`
- Check browser console for errors
- Verify image path is `/qr-code.png`

### Upload not working?
- Check if `uploads/payment-screenshots/` directory exists
- Check file permissions
- Verify multer is installed

### Payment not saving?
- Check backend console for errors
- Verify API route is correct: `/api/payment/qr-payment`
- Check if booking exists before payment

---

**Last Updated:** December 23, 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready to Use
