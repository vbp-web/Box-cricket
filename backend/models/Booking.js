import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
            unique: true,
            // Not required here because it's auto-generated in pre-save hook
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        turf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Turf',
            required: true,
        },
        slots: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Slot',
            required: true,
        }],
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        customerDetails: {
            name: String,
            email: String,
            phone: String,
        },
        numberOfPlayers: {
            type: Number,
            min: 1,
        },
        specialRequests: {
            type: String,
            maxlength: 500,
        },
        cancellationReason: {
            type: String,
        },
        cancelledAt: {
            type: Date,
        },
        invoiceUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Generate unique booking ID before saving
bookingSchema.pre('save', async function (next) {
    if (!this.bookingId) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        this.bookingId = `SH${year}${month}${day}${random}`;
    }
    next();
});

// Index for efficient queries
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ turf: 1, date: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
