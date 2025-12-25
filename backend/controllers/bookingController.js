import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Slot from '../models/Slot.js';
import Turf from '../models/Turf.js';
import User from '../models/User.js';
import { generateInvoice } from '../utils/generateInvoice.js';
import { logger } from '../utils/logger.js';

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
    try {
        const { slotIds, customerDetails, numberOfPlayers, specialRequests } = req.body;

        // Validate slotIds is an array
        if (!Array.isArray(slotIds) || slotIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one slot ID',
            });
        }

        // Validate all slot IDs are valid ObjectIds
        const invalidIds = slotIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid slot ID format',
            });
        }

        // Get all slots
        const slots = await Slot.find({ _id: { $in: slotIds } }).populate('turf');

        if (slots.length !== slotIds.length) {
            return res.status(404).json({
                success: false,
                message: 'One or more slots not found',
            });
        }

        // Verify all slots belong to the same turf
        const turfIds = [...new Set(slots.map(s => s.turf._id.toString()))];
        if (turfIds.length > 1) {
            return res.status(400).json({
                success: false,
                message: 'All slots must belong to the same turf',
            });
        }

        // Verify all slots are on the same date
        const dates = [...new Set(slots.map(s => s.date.toISOString().split('T')[0]))];
        if (dates.length > 1) {
            return res.status(400).json({
                success: false,
                message: 'All slots must be on the same date',
            });
        }

        // Check if all slots are locked by current user
        const invalidSlots = slots.filter(
            slot => slot.status !== 'locked' || slot.lockedBy.toString() !== req.user.id
        );

        if (invalidSlots.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'One or more slots are not locked by you',
            });
        }

        // Check if any lock is expired
        const expiredSlots = slots.filter(slot => slot.isLockExpired());
        if (expiredSlots.length > 0) {
            // Release expired slots
            await Slot.updateMany(
                { _id: { $in: expiredSlots.map(s => s._id) } },
                {
                    status: 'available',
                    $unset: { lockedBy: 1, lockedAt: 1 },
                }
            );

            return res.status(400).json({
                success: false,
                message: 'One or more slot locks have expired',
            });
        }

        // Sort slots by start time
        slots.sort((a, b) => {
            const timeA = a.startTime.split(':').map(Number);
            const timeB = b.startTime.split(':').map(Number);
            return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
        });

        // Calculate total amount
        const totalAmount = slots.reduce((sum, slot) => sum + slot.price, 0);

        // Use provided customer details or fallback to user details
        const bookingCustomerDetails = {
            name: customerDetails?.name || req.user.name,
            email: customerDetails?.email || req.user.email,
            phone: customerDetails?.phone || req.user.phone,
        };

        // Create booking with multiple slots
        const booking = await Booking.create({
            user: req.user.id,
            turf: slots[0].turf._id,
            slots: slotIds,
            date: slots[0].date,
            startTime: slots[0].startTime,
            endTime: slots[slots.length - 1].endTime,
            totalAmount,
            customerDetails: bookingCustomerDetails,
            numberOfPlayers: numberOfPlayers || undefined,
            specialRequests: specialRequests || undefined,
        });

        logger.info(`Booking created: ${booking.bookingId} by ${req.user.email} with ${slots.length} slot(s)`);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: { booking },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create offline booking (Admin)
// @route   POST /api/bookings/offline
// @access  Private/Admin
export const createOfflineBooking = async (req, res, next) => {
    try {
        const {
            slotId,
            customerDetails,
            numberOfPlayers,
            specialRequests,
            paymentMethod = 'cash',
            amountPaid
        } = req.body;

        // Validate required fields
        if (!slotId || !customerDetails?.name || !customerDetails?.phone) {
            return res.status(400).json({
                success: false,
                message: 'Slot ID, customer name, and phone are required',
            });
        }

        // Validate slot ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(slotId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid slot ID format',
            });
        }

        // Get slot
        const slot = await Slot.findById(slotId).populate('turf');

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Slot not found',
            });
        }

        // Check if slot is available
        if (slot.status === 'booked') {
            return res.status(400).json({
                success: false,
                message: 'Slot is already booked',
            });
        }

        // Create booking
        const booking = await Booking.create({
            user: req.user.id, // Admin user who created the booking
            turf: slot.turf._id,
            slot: slot._id,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            totalAmount: amountPaid || slot.price,
            status: 'confirmed', // Directly confirmed for offline bookings
            paymentStatus: 'paid', // Mark as paid for offline bookings
            customerDetails: {
                name: customerDetails.name,
                email: customerDetails.email || 'offline@booking.com',
                phone: customerDetails.phone,
            },
            numberOfPlayers: numberOfPlayers || undefined,
            specialRequests: specialRequests || undefined,
        });

        // Update slot status
        slot.status = 'booked';
        slot.bookedBy = req.user.id;
        slot.booking = booking._id;
        slot.lockedBy = undefined;
        slot.lockedAt = undefined;
        await slot.save();

        logger.info(`Offline booking created: ${booking.bookingId} by admin ${req.user.email} for customer ${customerDetails.name}`);

        res.status(201).json({
            success: true,
            message: 'Offline booking created successfully',
            data: { booking },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const query = { user: req.user.id };

        if (status) {
            query.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const bookings = await Booking.find(query)
            .populate('turf', 'name location images')
            .populate('slot', 'date startTime endTime')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Booking.countDocuments(query);

        res.json({
            success: true,
            data: {
                bookings,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / Number(limit)),
                    limit: Number(limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res, next) => {
    try {
        // Validate booking ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID format',
            });
        }

        const booking = await Booking.findById(req.params.id)
            .populate('turf')
            .populate('slot')
            .populate('payment');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        // Check if booking belongs to user or user is admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this booking',
            });
        }

        res.json({
            success: true,
            data: { booking },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
    try {
        const { reason } = req.body;

        // Validate booking ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID format',
            });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        // Check if booking belongs to user
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking',
            });
        }

        // Check if booking can be cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled',
            });
        }

        if (booking.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel completed booking',
            });
        }

        // Update booking
        booking.status = 'cancelled';
        booking.cancellationReason = reason;
        booking.cancelledAt = new Date();

        await booking.save();

        // Update slot status
        const slot = await Slot.findById(booking.slot);
        if (slot) {
            slot.status = 'available';
            slot.bookedBy = undefined;
            slot.booking = undefined;
            await slot.save();
        }

        logger.info(`Booking cancelled: ${booking.bookingId} by ${req.user.email}`);

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: { booking },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
    try {
        const {
            status,
            paymentStatus,
            startDate,
            endDate,
            page = 1,
            limit = 20,
        } = req.query;

        const query = {};

        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const bookings = await Booking.find(query)
            .populate('user', 'name email phone')
            .populate('turf', 'name location')
            .populate('payment')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Booking.countDocuments(query);

        res.json({
            success: true,
            data: {
                bookings,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / Number(limit)),
                    limit: Number(limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get booking statistics (Admin)
// @route   GET /api/admin/bookings/stats
// @access  Private/Admin
export const getBookingStats = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Total bookings
        const totalBookings = await Booking.countDocuments();

        // Today's bookings
        const todayBookings = await Booking.countDocuments({
            date: { $gte: today, $lt: tomorrow },
        });

        // Upcoming bookings
        const upcomingBookings = await Booking.countDocuments({
            date: { $gte: today },
            status: 'confirmed',
        });

        // Cancelled bookings
        const cancelledBookings = await Booking.countDocuments({
            status: 'cancelled',
        });

        // Total revenue
        const revenueData = await Booking.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Today's revenue
        const todayRevenueData = await Booking.aggregate([
            {
                $match: {
                    date: { $gte: today, $lt: tomorrow },
                    paymentStatus: 'paid',
                },
            },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        const todayRevenue = todayRevenueData.length > 0 ? todayRevenueData[0].total : 0;

        res.json({
            success: true,
            data: {
                totalBookings,
                todayBookings,
                upcomingBookings,
                cancelledBookings,
                totalRevenue,
                todayRevenue,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Download invoice
// @route   GET /api/bookings/:id/invoice
// @access  Private
export const downloadInvoice = async (req, res, next) => {
    try {
        // Validate booking ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking ID format',
            });
        }

        const booking = await Booking.findById(req.params.id)
            .populate('turf')
            .populate('user');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        // Check authorization
        if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        // Generate invoice
        const invoicePath = await generateInvoice(booking, booking.user, booking.turf);

        // Update booking with invoice URL
        booking.invoiceUrl = invoicePath;
        await booking.save();

        res.download(invoicePath);
    } catch (error) {
        next(error);
    }
};
