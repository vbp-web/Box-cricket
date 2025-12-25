import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Slot from '../models/Slot.js';
import { generateUPIPayment, validateUPITransactionId, formatUPITransactionId } from '../utils/upiPayment.js';
import { logger } from '../utils/logger.js';

/**
 * @desc    Generate UPI payment QR code
 * @route   POST /api/payment/generate-qr
 * @access  Private
 */
export const generatePaymentQR = async (req, res, next) => {
    try {
        const { bookingId, amount, customerName } = req.body;

        if (!bookingId || !amount || !customerName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide booking ID, amount, and customer name',
            });
        }

        // Generate UPI payment data
        const paymentData = generateUPIPayment({
            amount,
            bookingId,
            customerName,
        });

        logger.info(`UPI QR generated for booking ${bookingId}`);

        res.status(200).json({
            success: true,
            data: paymentData,
        });
    } catch (error) {
        logger.error('Generate QR Error:', error);
        next(error);
    }
};

/**
 * @desc    Submit UPI transaction ID for verification
 * @route   POST /api/payment/submit-transaction
 * @access  Private
 */
export const submitTransaction = async (req, res, next) => {
    try {
        const { bookingId, upiTransactionId, upiId } = req.body;

        if (!bookingId || !upiTransactionId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide booking ID and UPI transaction ID',
            });
        }

        // Validate transaction ID format
        if (!validateUPITransactionId(upiTransactionId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid UPI transaction ID format. Must be at least 12 alphanumeric characters.',
            });
        }

        // Find booking
        const booking = await Booking.findOne({ bookingId });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        // Check if user owns this booking
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this booking',
            });
        }

        // Check if payment already exists
        let payment = await Payment.findOne({ booking: booking._id });

        const formattedTransactionId = formatUPITransactionId(upiTransactionId);

        // Check if transaction ID already used
        const existingPayment = await Payment.findOne({
            upiTransactionId: formattedTransactionId,
        });

        if (existingPayment && existingPayment.booking.toString() !== booking._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'This transaction ID has already been used for another booking',
            });
        }

        if (payment) {
            // Update existing payment
            payment.upiTransactionId = formattedTransactionId;
            payment.upiId = upiId;
            payment.status = 'pending';
            await payment.save();
        } else {
            // Create new payment record
            payment = await Payment.create({
                booking: booking._id,
                user: booking.user,
                amount: booking.totalAmount,
                paymentMethod: 'UPI',
                upiTransactionId: formattedTransactionId,
                upiId: upiId,
                status: 'pending',
            });
        }

        // Update booking payment reference
        booking.payment = payment._id;
        booking.paymentStatus = 'pending';
        await booking.save();

        logger.info(`Transaction ID submitted for booking ${bookingId}: ${formattedTransactionId}`);

        res.status(200).json({
            success: true,
            message: 'Transaction ID submitted successfully. Payment verification pending.',
            data: {
                paymentId: payment._id,
                status: payment.status,
                bookingId: booking.bookingId,
            },
        });
    } catch (error) {
        logger.error('Submit Transaction Error:', error);
        next(error);
    }
};

/**
 * @desc    Verify payment (Admin only)
 * @route   PUT /api/payment/:id/verify
 * @access  Private/Admin
 */
export const verifyPayment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!['verified', 'failed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be "verified" or "failed"',
            });
        }

        const payment = await Payment.findById(id).populate('booking');
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        payment.status = status;
        payment.verifiedBy = req.user.id;
        payment.verifiedAt = new Date();
        if (notes) payment.notes = notes;

        await payment.save();

        // Update booking status
        const booking = await Booking.findById(payment.booking._id);
        if (booking) {
            if (status === 'verified') {
                booking.status = 'confirmed';
                booking.paymentStatus = 'paid';

                // Update all slots to booked
                await Slot.updateMany(
                    { _id: { $in: booking.slots } },
                    {
                        status: 'booked',
                        bookedBy: booking.user,
                        booking: booking._id,
                        $unset: { lockedBy: 1, lockedAt: 1 },
                    }
                );

                logger.info(`Payment verified for booking ${booking.bookingId}`);
            } else {
                booking.status = 'cancelled';
                booking.paymentStatus = 'failed';
                if (notes) booking.cancellationReason = notes;

                // Release all slots
                await Slot.updateMany(
                    { _id: { $in: booking.slots } },
                    {
                        status: 'available',
                        $unset: { lockedBy: 1, lockedAt: 1, bookedBy: 1, booking: 1 },
                    }
                );

                logger.info(`Payment failed for booking ${booking.bookingId}`);
            }
            await booking.save();
        }

        res.status(200).json({
            success: true,
            message: `Payment ${status} successfully`,
            data: payment,
        });
    } catch (error) {
        logger.error('Verify Payment Error:', error);
        next(error);
    }
};

/**
 * @desc    Get all pending payments (Admin only)
 * @route   GET /api/payment/pending
 * @access  Private/Admin
 */
export const getPendingPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find({ status: 'pending' })
            .populate({
                path: 'booking',
                populate: [
                    { path: 'user', select: 'name email phone' },
                    { path: 'turf', select: 'name boxNumber' },
                    { path: 'slots', select: 'date startTime endTime price' },
                ],
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        logger.error('Get Pending Payments Error:', error);
        next(error);
    }
};

/**
 * @desc    Get payment by ID
 * @route   GET /api/payment/:id
 * @access  Private
 */
export const getPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate({
                path: 'booking',
                populate: [
                    { path: 'user', select: 'name email phone' },
                    { path: 'turf', select: 'name boxNumber location' },
                    { path: 'slots', select: 'date startTime endTime price' },
                ],
            })
            .populate('verifiedBy', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        // Check if user owns this payment or is admin
        if (
            payment.user.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this payment',
            });
        }

        res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        logger.error('Get Payment Error:', error);
        next(error);
    }
};

/**
 * @desc    Get user's payment history
 * @route   GET /api/payment/my-payments
 * @access  Private
 */
export const getMyPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find({ user: req.user.id })
            .populate({
                path: 'booking',
                populate: [
                    { path: 'turf', select: 'name boxNumber location' },
                    { path: 'slots', select: 'date startTime endTime' },
                ],
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        logger.error('Get My Payments Error:', error);
        next(error);
    }
};

/**
 * @desc    Submit QR/UPI payment with screenshot
 * @route   POST /api/payment/qr-payment
 * @access  Private
 */
export const submitQRPayment = async (req, res, next) => {
    try {
        const { bookingId, transactionId, paymentMethod, amount } = req.body;
        const screenshot = req.file;

        // Validate required fields
        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: 'Booking ID is required',
            });
        }

        if (!transactionId) {
            return res.status(400).json({
                success: false,
                message: 'Transaction ID is required',
            });
        }

        if (!screenshot) {
            return res.status(400).json({
                success: false,
                message: 'Payment screenshot is required',
            });
        }

        // Find booking by MongoDB _id
        const booking = await Booking.findById(bookingId)
            .populate('user', 'name email phone')
            .populate('turf', 'name boxNumber')
            .populate('slots', 'date startTime endTime price');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        // Check if user owns this booking
        if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this booking',
            });
        }

        // Check if payment already exists
        let payment = await Payment.findOne({ booking: booking._id });

        // Check if transaction ID already used
        const existingPayment = await Payment.findOne({
            upiTransactionId: transactionId,
        });

        if (existingPayment && existingPayment.booking.toString() !== booking._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'This transaction ID has already been used for another booking',
            });
        }

        if (payment) {
            // Update existing payment
            payment.upiTransactionId = transactionId;
            payment.paymentMethod = paymentMethod || 'UPI/QR';
            payment.paymentScreenshot = screenshot.path;
            payment.status = 'pending';
            await payment.save();
        } else {
            // Create new payment record
            payment = await Payment.create({
                booking: booking._id,
                user: booking.user._id,
                amount: amount || booking.totalAmount,
                paymentMethod: paymentMethod || 'UPI/QR',
                upiTransactionId: transactionId,
                paymentScreenshot: screenshot.path,
                status: 'pending',
            });
        }

        // Update booking payment reference
        booking.payment = payment._id;
        booking.paymentStatus = 'pending';
        await booking.save();

        logger.info(`QR Payment submitted for booking ${booking.bookingId}: ${transactionId}`);

        res.status(200).json({
            success: true,
            message: 'Payment details submitted successfully. Verification pending.',
            data: {
                booking: booking,
                payment: payment,
            },
        });
    } catch (error) {
        logger.error('QR Payment Error:', error);
        next(error);
    }
};

