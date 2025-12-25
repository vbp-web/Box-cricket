import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: 'INR',
        },
        paymentMethod: {
            type: String,
            enum: ['UPI', 'Cash', 'Card'],
            default: 'UPI',
        },
        upiTransactionId: {
            type: String,
            trim: true,
            uppercase: true,
            sparse: true, // Allows null but ensures uniqueness when present
        },
        upiId: {
            type: String,
            trim: true,
        },
        paymentScreenshot: {
            type: String, // File path to uploaded screenshot
        },
        status: {
            type: String,
            enum: ['pending', 'verified', 'failed', 'refunded'],
            default: 'pending',
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        verifiedAt: {
            type: Date,
        },
        paymentProof: {
            url: String,
            publicId: String,
        },
        failureReason: {
            type: String,
        },
        refundDetails: {
            refundId: String,
            refundedAt: Date,
            refundAmount: Number,
            refundReason: String,
        },
        notes: {
            type: String,
            maxlength: 500,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
paymentSchema.index({ booking: 1 });
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ upiTransactionId: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
