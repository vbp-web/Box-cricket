import mongoose from 'mongoose';
import Slot from '../models/Slot.js';
import Turf from '../models/Turf.js';
import { logger } from '../utils/logger.js';

// @desc    Get slots for a turf
// @route   GET /api/slots/:turfId
// @access  Public
export const getSlots = async (req, res, next) => {
    try {
        const { turfId } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required',
            });
        }

        // Validate turfId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(turfId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid turf ID format',
            });
        }

        // Check if turf exists
        const turf = await Turf.findById(turfId);
        if (!turf) {
            return res.status(404).json({
                success: false,
                message: 'Turf not found',
            });
        }

        // Parse date
        const slotDate = new Date(date);
        slotDate.setHours(0, 0, 0, 0);

        // Get slots
        const slots = await Slot.find({
            turf: turfId,
            date: slotDate,
        })
            .populate('bookedBy', 'name')
            .sort({ startTime: 1 });

        // Check for expired locks and update
        const updatedSlots = [];
        for (const slot of slots) {
            if (slot.isLockExpired()) {
                slot.status = 'available';
                slot.lockedBy = undefined;
                slot.lockedAt = undefined;
                await slot.save();
            }
            updatedSlots.push(slot);
        }

        res.json({
            success: true,
            data: { slots: updatedSlots },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single slot by ID
// @route   GET /api/slots/slot/:id
// @access  Public
export const getSlotById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate slot ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid slot ID format',
            });
        }

        const slot = await Slot.findById(id).populate('turf');

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Slot not found',
            });
        }

        // Check if lock is expired and update
        if (slot.isLockExpired()) {
            slot.status = 'available';
            slot.lockedBy = undefined;
            slot.lockedAt = undefined;
            await slot.save();
        }

        res.json({
            success: true,
            data: { slot },
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Lock a slot
// @route   POST /api/slots/lock
// @access  Private
export const lockSlot = async (req, res, next) => {
    try {
        const { slotId } = req.body;

        const slot = await Slot.findById(slotId);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Slot not found',
            });
        }

        // Check if slot is already booked
        if (slot.status === 'booked') {
            return res.status(400).json({
                success: false,
                message: 'Slot is already booked',
            });
        }

        // Check if slot is locked by another user
        if (slot.status === 'locked' && slot.lockedBy.toString() !== req.user.id) {
            // Check if lock is expired
            if (!slot.isLockExpired()) {
                return res.status(400).json({
                    success: false,
                    message: 'Slot is currently locked by another user',
                });
            }
        }

        // Lock the slot
        slot.status = 'locked';
        slot.lockedBy = req.user.id;
        slot.lockedAt = new Date();

        await slot.save();

        logger.info(`Slot locked: ${slotId} by ${req.user.email}`);

        res.json({
            success: true,
            message: 'Slot locked successfully',
            data: {
                slot,
                expiresIn: parseInt(process.env.SLOT_LOCK_DURATION) || 180,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Unlock a slot
// @route   POST /api/slots/unlock
// @access  Private
export const unlockSlot = async (req, res, next) => {
    try {
        const { slotId } = req.body;

        const slot = await Slot.findById(slotId);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Slot not found',
            });
        }

        // Check if slot is locked by the current user
        if (slot.status !== 'locked' || slot.lockedBy.toString() !== req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot unlock this slot',
            });
        }

        // Unlock the slot
        slot.status = 'available';
        slot.lockedBy = undefined;
        slot.lockedAt = undefined;

        await slot.save();

        logger.info(`Slot unlocked: ${slotId} by ${req.user.email}`);

        res.json({
            success: true,
            message: 'Slot unlocked successfully',
            data: { slot },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Generate slots for a turf
// @route   POST /api/slots/generate
// @access  Private/Admin
export const generateSlots = async (req, res, next) => {
    try {
        const { turfId, startDate, endDate, slotDuration = 60 } = req.body;

        // Validate turfId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(turfId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid turf ID format',
            });
        }

        // Check if turf exists
        const turf = await Turf.findById(turfId);
        if (!turf) {
            return res.status(404).json({
                success: false,
                message: 'Turf not found',
            });
        }

        const slots = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Generate slots for each day
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const slotDate = new Date(date);
            slotDate.setHours(0, 0, 0, 0);

            // Parse operating hours
            const [openHour, openMinute] = turf.operatingHours.open.split(':').map(Number);
            const [closeHour, closeMinute] = turf.operatingHours.close.split(':').map(Number);

            let currentTime = openHour * 60 + openMinute; // Convert to minutes
            const endTime = closeHour * 60 + closeMinute;

            while (currentTime + slotDuration <= endTime) {
                const startHour = Math.floor(currentTime / 60);
                const startMinute = currentTime % 60;
                const endMinutes = currentTime + slotDuration;
                const endHour = Math.floor(endMinutes / 60);
                const endMinute = endMinutes % 60;

                const startTimeStr = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
                const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

                // Check if slot already exists
                const existingSlot = await Slot.findOne({
                    turf: turfId,
                    date: slotDate,
                    startTime: startTimeStr,
                });

                if (!existingSlot) {
                    slots.push({
                        turf: turfId,
                        date: slotDate,
                        startTime: startTimeStr,
                        endTime: endTimeStr,
                        price: turf.pricePerHour,
                        status: 'available',
                    });
                }

                currentTime += slotDuration;
            }
        }

        // Insert slots
        if (slots.length > 0) {
            await Slot.insertMany(slots);
        }

        logger.info(`Generated ${slots.length} slots for turf ${turf.name}`);

        res.status(201).json({
            success: true,
            message: `${slots.length} slots generated successfully`,
            data: { count: slots.length },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a single slot
// @route   POST /api/slots
// @access  Private/Admin
export const createSlot = async (req, res, next) => {
    try {
        const { turfId, date, startTime, endTime, price } = req.body;

        // Validate required fields
        if (!turfId || !date || !startTime || !endTime || !price) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Validate turfId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(turfId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid turf ID format',
            });
        }

        // Check if turf exists
        const turf = await Turf.findById(turfId);
        if (!turf) {
            return res.status(404).json({
                success: false,
                message: 'Turf not found',
            });
        }

        // Parse date
        const slotDate = new Date(date);
        slotDate.setHours(0, 0, 0, 0);

        // Check if slot already exists
        const existingSlot = await Slot.findOne({
            turf: turfId,
            date: slotDate,
            startTime: startTime,
        });

        if (existingSlot) {
            return res.status(400).json({
                success: false,
                message: 'Slot already exists for this time',
            });
        }

        // Create new slot
        const slot = await Slot.create({
            turf: turfId,
            date: slotDate,
            startTime,
            endTime,
            price: Number(price),
            status: 'available',
        });

        logger.info(`Slot created: ${slot._id} for turf ${turf.name} by ${req.user.email}`);

        res.status(201).json({
            success: true,
            message: 'Slot created successfully',
            data: { slot },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a slot
// @route   DELETE /api/slots/:id
// @access  Private/Admin
export const deleteSlot = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate slot ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid slot ID format',
            });
        }

        const slot = await Slot.findById(id);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Slot not found',
            });
        }

        // Check if slot is booked
        if (slot.status === 'booked') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete a booked slot',
            });
        }

        await slot.deleteOne();

        logger.info(`Slot deleted: ${id} by ${req.user.email}`);

        res.json({
            success: true,
            message: 'Slot deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
