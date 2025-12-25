import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        turf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Turf',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            maxlength: [500, 'Comment cannot exceed 500 characters'],
        },
        images: [
            {
                url: String,
                publicId: String,
            },
        ],
        isVerified: {
            type: Boolean,
            default: false,
        },
        response: {
            comment: String,
            respondedAt: Date,
            respondedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        },
    },
    {
        timestamps: true,
    }
);

// Prevent multiple reviews for same booking
reviewSchema.index({ booking: 1 }, { unique: true });
reviewSchema.index({ turf: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

// Update turf rating after review save
reviewSchema.post('save', async function () {
    const Review = this.constructor;
    const Turf = mongoose.model('Turf');

    const stats = await Review.aggregate([
        { $match: { turf: this.turf } },
        {
            $group: {
                _id: '$turf',
                avgRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await Turf.findByIdAndUpdate(this.turf, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            totalReviews: stats[0].totalReviews,
        });
    }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
