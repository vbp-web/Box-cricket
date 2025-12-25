import express from 'express';
import {
    generatePaymentQR,
    submitTransaction,
    verifyPayment,
    getPendingPayments,
    getPayment,
    getMyPayments,
    submitQRPayment,
} from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public/User routes
router.post('/generate-qr', protect, generatePaymentQR);
router.post('/submit-transaction', protect, submitTransaction);
router.post('/qr-payment', protect, upload.single('screenshot'), submitQRPayment); // QR Code payment with screenshot
router.get('/my-payments', protect, getMyPayments);
router.get('/:id', protect, getPayment);

// Admin routes
router.get('/pending/all', protect, admin, getPendingPayments);
router.put('/:id/verify', protect, admin, verifyPayment);

export default router;
