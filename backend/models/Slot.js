import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
    {
        turf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Turf',
            required: true,
        },
        date: {
            type: Date,
            required: [true, 'Please provide slot date'],
        },
        startTime: {
            type: String,
            required: [true, 'Please provide start time'],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
        },
        endTime: {
            type: String,
            required: [true, 'Please provide end time'],
            match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
        },
        status: {
            type: String,
            enum: ['available', 'locked', 'booked'],
            default: 'available',
        },
        price: {
            type: Number,
            required: [true, 'Please provide slot price'],
            min: [0, 'Price cannot be negative'],
        },
        lockedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        lockedAt: {
            type: Date,
        },
        bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate slots
slotSchema.index({ turf: 1, date: 1, startTime: 1 }, { unique: true });

// Index for efficient queries
slotSchema.index({ turf: 1, date: 1, status: 1 });
slotSchema.index({ lockedAt: 1 }, {
    expireAfterSeconds: 180,
    partialFilterExpression: { status: 'locked' }
});

// Middleware to auto-unlock expired slots
slotSchema.pre('save', function (next) {
    if (this.status === 'locked' && this.lockedAt) {
        const lockDuration = parseInt(process.env.SLOT_LOCK_DURATION) || 180;
        const expiryTime = new Date(this.lockedAt.getTime() + lockDuration * 1000);

        if (new Date() > expiryTime) {
            this.status = 'available';
            this.lockedBy = undefined;
            this.lockedAt = undefined;
        }
    }
    next();
});

// Method to check if slot is expired
slotSchema.methods.isLockExpired = function () {
    if (this.status !== 'locked' || !this.lockedAt) return false;

    const lockDuration = parseInt(process.env.SLOT_LOCK_DURATION) || 180;
    const expiryTime = new Date(this.lockedAt.getTime() + lockDuration * 1000);

    return new Date() > expiryTime;
};

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;
