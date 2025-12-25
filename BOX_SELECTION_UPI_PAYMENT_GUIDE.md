# 🎯 Box Selection & UPI Payment System - Implementation Guide

## Overview

This document outlines the complete implementation of the BookMyShow-style booking system with box selection and UPI QR code payment for Shiva's Box Cricket.

---

## ✅ STEP 1: BOX SELECTION & SLOT BOOKING SYSTEM

### Features Implemented

#### 1. **Dual Box System**
- **Box 1** and **Box 2** are now separate entities in the database
- Each box has independent slot availability
- Slots for Box 1 and Box 2 are completely isolated

#### 2. **Multiple Slot Selection**
- Users can select multiple continuous time slots
- Automatic price calculation based on selected slots
- Validation ensures all slots belong to the same box and date

#### 3. **Box-Specific Booking**
- Each box displays only its own available slots
- Booked slots appear disabled and unavailable
- Real-time slot status updates

### Database Changes

#### **Turf Model** (`backend/models/Turf.js`)
```javascript
boxNumber: {
    type: Number,
    required: [true, 'Please provide box number'],
    enum: [1, 2],
    default: 1,
}
```

#### **Booking Model** (`backend/models/Booking.js`)
```javascript
slots: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slot',
    required: true,
}]
```
- Changed from single `slot` to array of `slots`
- Supports multiple slot booking in one transaction

### API Endpoints

#### Get Slots for a Box
```http
GET /api/slots/:turfId?date=2025-12-17
```

#### Create Booking with Multiple Slots
```http
POST /api/bookings
Content-Type: application/json

{
  "slotIds": ["slot_id_1", "slot_id_2", "slot_id_3"],
  "customerDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  },
  "numberOfPlayers": 12,
  "specialRequests": "Need equipment"
}
```

---

## ✅ STEP 2: UPI QR CODE PAYMENT SYSTEM

### Features Implemented

#### 1. **Dynamic UPI QR Code Generation**
- QR codes generated using Google Charts API (free, no authentication)
- Includes exact payable amount
- Contains booking reference in transaction note

#### 2. **UPI Transaction ID Submission**
- Customers enter UTR number after payment
- Transaction ID validation (12+ alphanumeric characters)
- Duplicate transaction ID prevention

#### 3. **Admin Verification System**
- Pending payments dashboard for admin
- Manual verification/rejection workflow
- Automatic booking confirmation upon verification

#### 4. **Payment Status Tracking**
- **Pending**: Transaction ID submitted, awaiting verification
- **Verified**: Admin confirmed payment
- **Failed**: Admin rejected payment
- **Refunded**: Payment refunded

### Database Changes

#### **Payment Model** (`backend/models/Payment.js`)
```javascript
{
    paymentMethod: 'UPI',
    upiTransactionId: String,  // UTR number
    upiId: String,              // Customer's UPI ID
    status: 'pending' | 'verified' | 'failed' | 'refunded',
    verifiedBy: ObjectId,       // Admin who verified
    verifiedAt: Date,
    notes: String
}
```

### UPI Payment Flow

```
1. User selects slots → Creates booking
2. System generates UPI QR code with amount
3. User scans QR → Pays via any UPI app
4. User enters Transaction ID (UTR) on website
5. Booking status: "Pending"
6. Admin verifies payment manually
7. Booking status: "Confirmed" (if verified) or "Cancelled" (if failed)
```

### API Endpoints

#### Generate UPI QR Code
```http
POST /api/payment/generate-qr
Content-Type: application/json

{
  "bookingId": "SH251217001",
  "amount": 3600,
  "customerName": "John Doe"
}

Response:
{
  "success": true,
  "data": {
    "upiId": "yourname@paytm",
    "businessName": "Shiva's Box Cricket",
    "amount": 3600,
    "qrCodeURL": "https://chart.googleapis.com/chart?cht=qr&chl=...",
    "upiString": "upi://pay?pa=yourname@paytm&pn=Shiva's Box Cricket&am=3600.00&tn=Booking SH251217001 - John Doe&cu=INR"
  }
}
```

#### Submit Transaction ID
```http
POST /api/payment/submit-transaction
Content-Type: application/json

{
  "bookingId": "SH251217001",
  "upiTransactionId": "435678901234",
  "upiId": "customer@paytm"
}
```

#### Verify Payment (Admin Only)
```http
PUT /api/payment/:paymentId/verify
Content-Type: application/json

{
  "status": "verified",  // or "failed"
  "notes": "Payment verified successfully"
}
```

#### Get Pending Payments (Admin Only)
```http
GET /api/payment/pending/all
```

---

## 🔧 Configuration

### Environment Variables

Add to `backend/.env`:

```bash
# UPI Payment Configuration
UPI_ID=yourname@paytm
BUSINESS_NAME=Shiva's Box Cricket
```

Replace `yourname@paytm` with your actual UPI ID (Google Pay, PhonePe, Paytm, etc.)

---

## 📦 Seed Data

The seed data has been updated to create **Box 1** and **Box 2**:

```bash
cd backend
npm run seed
```

This will create:
- Admin account
- Box 1 at Shiva's Box Cricket
- Box 2 at Shiva's Box Cricket
- Slots for next 7 days for both boxes

---

## 🎨 Frontend Implementation Guide

### 1. **Box Selection Component**

```jsx
const BoxSelector = ({ selectedBox, onBoxChange }) => {
  return (
    <div className="box-selector">
      <button 
        className={selectedBox === 1 ? 'active' : ''}
        onClick={() => onBoxChange(1)}
      >
        Box 1
      </button>
      <button 
        className={selectedBox === 2 ? 'active' : ''}
        onClick={() => onBoxChange(2)}
      >
        Box 2
      </button>
    </div>
  );
};
```

### 2. **Multiple Slot Selection**

```jsx
const [selectedSlots, setSelectedSlots] = useState([]);

const handleSlotClick = (slot) => {
  if (slot.status !== 'available') return;
  
  setSelectedSlots(prev => {
    const isSelected = prev.find(s => s._id === slot._id);
    if (isSelected) {
      return prev.filter(s => s._id !== slot._id);
    } else {
      return [...prev, slot].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      );
    }
  });
};

const totalAmount = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);
```

### 3. **UPI Payment Component**

```jsx
const UPIPayment = ({ bookingId, amount, customerName }) => {
  const [qrData, setQrData] = useState(null);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    // Generate QR code
    fetch('/api/payment/generate-qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, amount, customerName })
    })
    .then(res => res.json())
    .then(data => setQrData(data.data));
  }, []);

  const handleSubmitTransaction = async () => {
    const response = await fetch('/api/payment/submit-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId,
        upiTransactionId: transactionId,
        upiId: 'customer@upi'
      })
    });
    
    if (response.ok) {
      alert('Transaction ID submitted! Awaiting verification.');
    }
  };

  return (
    <div className="upi-payment">
      <h3>Scan QR Code to Pay ₹{amount}</h3>
      {qrData && (
        <>
          <img src={qrData.qrCodeURL} alt="UPI QR Code" />
          <p>Pay to: {qrData.upiId}</p>
          <p>Amount: ₹{qrData.amount}</p>
        </>
      )}
      
      <div className="transaction-input">
        <label>Enter UPI Transaction ID (UTR):</label>
        <input 
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
          placeholder="e.g., 435678901234"
        />
        <button onClick={handleSubmitTransaction}>
          Submit Transaction ID
        </button>
      </div>
    </div>
  );
};
```

### 4. **Admin Payment Verification**

```jsx
const AdminPaymentVerification = () => {
  const [pendingPayments, setPendingPayments] = useState([]);

  useEffect(() => {
    fetch('/api/payment/pending/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setPendingPayments(data.data));
  }, []);

  const handleVerify = async (paymentId, status) => {
    await fetch(`/api/payment/${paymentId}/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    
    // Refresh list
    // ...
  };

  return (
    <div className="payment-verification">
      <h2>Pending Payments</h2>
      {pendingPayments.map(payment => (
        <div key={payment._id} className="payment-card">
          <p>Booking: {payment.booking.bookingId}</p>
          <p>Amount: ₹{payment.amount}</p>
          <p>Transaction ID: {payment.upiTransactionId}</p>
          <p>Customer: {payment.booking.user.name}</p>
          
          <button onClick={() => handleVerify(payment._id, 'verified')}>
            Verify Payment
          </button>
          <button onClick={() => handleVerify(payment._id, 'failed')}>
            Reject Payment
          </button>
        </div>
      ))}
    </div>
  );
};
```

---

## 🚀 Testing Guide

### 1. **Test Box Selection**
- Navigate to booking page
- Switch between Box 1 and Box 2
- Verify slots are different for each box

### 2. **Test Multiple Slot Booking**
- Select 2-3 continuous slots
- Verify total amount calculation
- Create booking
- Check all slots are marked as booked

### 3. **Test UPI Payment**
- Create a booking
- Generate QR code
- Scan with any UPI app (Google Pay, PhonePe, etc.)
- Complete payment
- Note the Transaction ID (UTR)
- Submit Transaction ID on website
- Verify booking status is "Pending"

### 4. **Test Admin Verification**
- Login as admin
- Go to pending payments
- Verify a payment
- Check booking status changes to "Confirmed"
- Check slots status changes to "Booked"

---

## 📝 Important Notes

### ⚠️ UPI Payment Limitations

1. **No Automatic Verification**: Payment verification is manual. Admin must check their UPI app/bank statement to confirm payment.

2. **Transaction ID Format**: UPI transaction IDs (UTR) are typically 12+ alphanumeric characters. The system validates this format.

3. **QR Code Generation**: Uses Google Charts API which is free but has rate limits. For production, consider:
   - Caching QR codes
   - Using a dedicated QR code library
   - Implementing your own QR generator

4. **Security**: Transaction IDs are checked for duplicates to prevent fraud.

### 🔒 Security Considerations

1. **Admin Verification**: Only admins can verify payments
2. **Duplicate Prevention**: Same transaction ID cannot be used twice
3. **Slot Locking**: Slots are locked during booking process
4. **JWT Authentication**: All payment endpoints require authentication

---

## 🎯 Next Steps

### Optional Enhancements

1. **WhatsApp Notifications**: Send payment confirmation via WhatsApp
2. **Email Receipts**: Auto-send receipts after verification
3. **Payment Reminders**: Remind users to submit transaction ID
4. **Analytics Dashboard**: Track payment success rate
5. **Bulk Verification**: Verify multiple payments at once
6. **Payment Proof Upload**: Allow users to upload payment screenshots

---

## 📞 Support

For any issues or questions:
- Check backend logs: `backend/logs/`
- Verify environment variables in `.env`
- Ensure MongoDB is running
- Check UPI ID is correctly configured

---

## ✅ Checklist

- [ ] Backend models updated (Turf, Booking, Payment)
- [ ] UPI payment utility created
- [ ] Payment controller implemented
- [ ] Payment routes configured
- [ ] Booking controller updated for multiple slots
- [ ] Seed data updated with Box 1 and Box 2
- [ ] Environment variables configured
- [ ] Database seeded with test data
- [ ] Frontend box selector implemented
- [ ] Frontend multiple slot selection implemented
- [ ] Frontend UPI payment component created
- [ ] Frontend admin verification page created
- [ ] Testing completed

---

**Status**: ✅ Backend Implementation Complete
**Ready for**: Frontend Integration
**Documentation**: Complete
