# 🚀 Quick Start Guide - Box Selection & UPI Payment

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

---

## ⚡ Quick Setup (5 Minutes)

### 1. Configure Environment Variables

Create/update `backend/.env`:

```bash
# Copy from example
cp backend/.env.example backend/.env

# Edit the following required fields:
MONGO_URI=your_mongodb_connection_string
UPI_ID=yourname@paytm
BUSINESS_NAME=Shiva's Box Cricket
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

**Output:**
```
✅ Data seeded successfully!

📧 Admin Credentials:
Email: admin@shivashub.com
Password: Admin@123

📧 Sample User Credentials:
Email: rahul@example.com | Password: password123
Email: priya@example.com | Password: password123
```

### 4. Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Server runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 🎯 What's New?

### ✅ Box Selection System
- **Box 1** and **Box 2** are now separate bookable entities
- Each box has independent slot availability
- Users can select which box to book

### ✅ Multiple Slot Booking
- Select 2, 3, or more continuous time slots
- Automatic price calculation
- Example: Book 6:00-7:00, 7:00-8:00, 8:00-9:00 = ₹3600

### ✅ UPI QR Code Payment
- No Razorpay or payment gateway needed
- Generate QR code with exact amount
- Customer scans and pays via any UPI app
- Customer enters Transaction ID (UTR)
- Admin verifies payment manually

---

## 🧪 Testing the New Features

### Test 1: Box Selection

1. Go to homepage
2. You should see **Box 1** and **Box 2** cards
3. Click "Book Now" on Box 1
4. Select a date
5. See available slots for Box 1
6. Go back and click "Book Now" on Box 2
7. See different slots for Box 2

### Test 2: Multiple Slot Booking

1. Select Box 1
2. Choose a date
3. Click on multiple slots (e.g., 6:00-7:00, 7:00-8:00, 8:00-9:00)
4. See total amount update: ₹1200 × 3 = ₹3600
5. Click "Proceed to Book"
6. Fill customer details
7. Create booking

### Test 3: UPI Payment

1. After creating booking, you'll see:
   - **QR Code** with payment amount
   - **UPI ID** to pay to
   - **Booking ID** for reference

2. Scan QR code with Google Pay/PhonePe/Paytm

3. Complete payment

4. Copy the **Transaction ID** (UTR number) from your UPI app

5. Enter Transaction ID on website

6. Click "Submit Transaction ID"

7. You'll see: "Payment verification pending"

### Test 4: Admin Verification

1. Login as admin:
   - Email: `admin@shivashub.com`
   - Password: `Admin@123`

2. Go to Admin Dashboard

3. Click "Pending Payments"

4. You'll see list of payments awaiting verification

5. For each payment, you can see:
   - Booking ID
   - Customer name
   - Amount
   - Transaction ID
   - Date/Time

6. Click "Verify Payment" to confirm

7. Booking status changes to "Confirmed"

8. Slots become "Booked"

---

## 📱 UPI Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER JOURNEY                          │
└─────────────────────────────────────────────────────────────┘

1. Select Box (Box 1 or Box 2)
   ↓
2. Select Date
   ↓
3. Select Multiple Slots (e.g., 6:00-9:00)
   ↓
4. See Total Amount (₹3600)
   ↓
5. Fill Customer Details
   ↓
6. Create Booking
   ↓
7. See UPI QR Code
   ↓
8. Scan QR with UPI App (Google Pay, PhonePe, etc.)
   ↓
9. Complete Payment
   ↓
10. Copy Transaction ID (UTR) from UPI App
   ↓
11. Enter Transaction ID on Website
   ↓
12. Submit Transaction ID
   ↓
13. Status: "Payment Verification Pending"
   ↓
14. Admin Verifies Payment
   ↓
15. Status: "Booking Confirmed" ✅
```

---

## 🔑 API Endpoints

### Box/Turf Endpoints

```http
# Get all boxes
GET /api/turfs

# Get specific box
GET /api/turfs/:id

# Get slots for a box
GET /api/slots/:turfId?date=2025-12-17
```

### Booking Endpoints

```http
# Create booking with multiple slots
POST /api/bookings
{
  "slotIds": ["slot1_id", "slot2_id", "slot3_id"],
  "customerDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}

# Get user's bookings
GET /api/bookings
```

### Payment Endpoints

```http
# Generate UPI QR Code
POST /api/payment/generate-qr
{
  "bookingId": "SH251217001",
  "amount": 3600,
  "customerName": "John Doe"
}

# Submit Transaction ID
POST /api/payment/submit-transaction
{
  "bookingId": "SH251217001",
  "upiTransactionId": "435678901234",
  "upiId": "customer@paytm"
}

# Get pending payments (Admin)
GET /api/payment/pending/all

# Verify payment (Admin)
PUT /api/payment/:id/verify
{
  "status": "verified",
  "notes": "Payment confirmed"
}
```

---

## 🎨 Frontend Components Needed

### 1. BoxSelector Component

```jsx
// Location: frontend/src/components/BoxSelector.jsx

import React from 'react';

const BoxSelector = ({ boxes, selectedBox, onSelectBox }) => {
  return (
    <div className="box-selector">
      <h2>Select a Box</h2>
      <div className="box-grid">
        {boxes.map(box => (
          <div 
            key={box._id}
            className={`box-card ${selectedBox?._id === box._id ? 'selected' : ''}`}
            onClick={() => onSelectBox(box)}
          >
            <h3>{box.name}</h3>
            <p>Box {box.boxNumber}</p>
            <p>₹{box.pricePerHour}/hour</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoxSelector;
```

### 2. MultiSlotSelector Component

```jsx
// Location: frontend/src/components/MultiSlotSelector.jsx

import React, { useState } from 'react';

const MultiSlotSelector = ({ slots, onSlotsChange }) => {
  const [selectedSlots, setSelectedSlots] = useState([]);

  const handleSlotClick = (slot) => {
    if (slot.status !== 'available') return;

    const newSelection = selectedSlots.find(s => s._id === slot._id)
      ? selectedSlots.filter(s => s._id !== slot._id)
      : [...selectedSlots, slot].sort((a, b) => 
          a.startTime.localeCompare(b.startTime)
        );

    setSelectedSlots(newSelection);
    onSlotsChange(newSelection);
  };

  const totalAmount = selectedSlots.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="multi-slot-selector">
      <div className="slots-grid">
        {slots.map(slot => (
          <button
            key={slot._id}
            className={`slot-button ${slot.status} ${
              selectedSlots.find(s => s._id === slot._id) ? 'selected' : ''
            }`}
            onClick={() => handleSlotClick(slot)}
            disabled={slot.status !== 'available'}
          >
            {slot.startTime} - {slot.endTime}
            <br />
            ₹{slot.price}
          </button>
        ))}
      </div>
      
      {selectedSlots.length > 0 && (
        <div className="selection-summary">
          <p>Selected: {selectedSlots.length} slot(s)</p>
          <p>Total: ₹{totalAmount}</p>
        </div>
      )}
    </div>
  );
};

export default MultiSlotSelector;
```

### 3. UPIPayment Component

```jsx
// Location: frontend/src/components/UPIPayment.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UPIPayment = ({ bookingId, amount, customerName }) => {
  const [qrData, setQrData] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    generateQR();
  }, []);

  const generateQR = async () => {
    try {
      const response = await axios.post('/api/payment/generate-qr', {
        bookingId,
        amount,
        customerName
      });
      setQrData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error generating QR:', error);
      setLoading(false);
    }
  };

  const handleSubmitTransaction = async () => {
    if (!transactionId || transactionId.length < 12) {
      alert('Please enter a valid transaction ID (at least 12 characters)');
      return;
    }

    try {
      await axios.post('/api/payment/submit-transaction', {
        bookingId,
        upiTransactionId: transactionId,
        upiId: 'customer@upi'
      });
      setSubmitted(true);
      alert('Transaction ID submitted successfully! Awaiting admin verification.');
    } catch (error) {
      alert('Error submitting transaction ID: ' + error.response?.data?.message);
    }
  };

  if (loading) return <div>Loading payment details...</div>;

  return (
    <div className="upi-payment">
      <h2>Complete Payment</h2>
      
      <div className="payment-amount">
        <h3>Amount to Pay: ₹{amount}</h3>
      </div>

      <div className="qr-section">
        <h4>Scan QR Code with any UPI App</h4>
        <img src={qrData.qrCodeURL} alt="UPI QR Code" className="qr-code" />
        <p>Pay to: <strong>{qrData.upiId}</strong></p>
        <p>Business: {qrData.businessName}</p>
      </div>

      <div className="transaction-section">
        <h4>After Payment, Enter Transaction ID</h4>
        <p className="help-text">
          Find the Transaction ID (UTR number) in your UPI app's transaction history
        </p>
        <input
          type="text"
          placeholder="Enter 12-digit Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
          maxLength={20}
          disabled={submitted}
        />
        <button 
          onClick={handleSubmitTransaction}
          disabled={submitted || !transactionId}
        >
          {submitted ? 'Transaction ID Submitted ✓' : 'Submit Transaction ID'}
        </button>
      </div>

      {submitted && (
        <div className="success-message">
          <p>✅ Transaction ID submitted successfully!</p>
          <p>Your payment is being verified by our admin team.</p>
          <p>You will receive confirmation shortly.</p>
        </div>
      )}
    </div>
  );
};

export default UPIPayment;
```

---

## 🎨 CSS Styling Examples

```css
/* Box Selector */
.box-selector {
  padding: 20px;
}

.box-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.box-card {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.box-card:hover {
  border-color: #4CAF50;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.box-card.selected {
  border-color: #4CAF50;
  background-color: #f1f8f4;
}

/* Slot Selector */
.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  margin: 20px 0;
}

.slot-button {
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.slot-button.available:hover {
  border-color: #4CAF50;
  background-color: #f1f8f4;
}

.slot-button.selected {
  border-color: #4CAF50;
  background-color: #4CAF50;
  color: white;
}

.slot-button.booked {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.selection-summary {
  background: #f1f8f4;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

/* UPI Payment */
.upi-payment {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}

.qr-code {
  width: 300px;
  height: 300px;
  margin: 20px auto;
  display: block;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.transaction-section input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  margin: 12px 0;
}

.transaction-section button {
  width: 100%;
  padding: 14px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.transaction-section button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.success-message {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
}
```

---

## 🐛 Troubleshooting

### Issue: QR Code not generating

**Solution:**
- Check `UPI_ID` in `.env` file
- Verify internet connection (Google Charts API needs internet)
- Check backend logs for errors

### Issue: Transaction ID validation failing

**Solution:**
- Ensure Transaction ID is at least 12 characters
- Use only alphanumeric characters
- Copy exactly from UPI app

### Issue: Slots not showing for Box 2

**Solution:**
- Run `npm run seed` again
- Check if Box 2 exists in database
- Verify `boxNumber` field is set correctly

### Issue: Payment verification not working

**Solution:**
- Ensure you're logged in as admin
- Check admin role in database
- Verify JWT token is valid

---

## 📚 Additional Resources

- **Full Implementation Guide**: `BOX_SELECTION_UPI_PAYMENT_GUIDE.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
- **API Documentation**: `API.md`
- **Project Structure**: `STRUCTURE.md`

---

## 🎯 Next Steps

1. ✅ Backend is ready
2. ⏳ Implement frontend components
3. ⏳ Test complete user flow
4. ⏳ Deploy to production

---

**Need Help?** Check the logs in `backend/logs/` or review the implementation guide.

**Ready to Deploy?** Make sure to:
- Set production MongoDB URI
- Set secure JWT secrets
- Configure correct UPI ID
- Test payment flow thoroughly
