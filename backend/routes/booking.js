import express from 'express';
import {
    createBooking,
    createOfflineBooking,
    getUserBookings,
    getBooking,
    cancelBooking,
    getAllBookings,
    getBookingStats,
    downloadInvoice,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .post(protect, createBooking)
    .get(protect, getUserBookings);

router.post('/offline', protect, admin, createOfflineBooking);
router.get('/admin/all', protect, admin, getAllBookings);
router.get('/admin/stats', protect, admin, getBookingStats);

router.route('/:id')
    .get(protect, getBooking);

router.put('/:id/cancel', protect, cancelBooking);
router.get('/:id/invoice', protect, downloadInvoice);

export default router;
