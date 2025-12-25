import mongoose from 'mongoose';

const turfSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide turf name'],
            trim: true,
            maxlength: [100, 'Turf name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please provide turf description'],
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        location: {
            address: {
                type: String,
                required: [true, 'Please provide address'],
            },
            city: {
                type: String,
                required: [true, 'Please provide city'],
                default: 'Kalol',
            },
            state: {
                type: String,
                default: 'Gujarat',
            },
            pincode: {
                type: String,
                match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode'],
            },
            coordinates: {
                latitude: Number,
                longitude: Number,
            },
        },
        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                publicId: {
                    type: String,
                    required: true,
                },
            },
        ],
        pricePerHour: {
            type: Number,
            required: [true, 'Please provide price per hour'],
            min: [0, 'Price cannot be negative'],
        },
        facilities: [
            {
                type: String,
                enum: [
                    'Parking',
                    'Washroom',
                    'Changing Room',
                    'Drinking Water',
                    'First Aid',
                    'Seating Area',
                    'Lighting',
                    'Scoreboard',
                    'Equipment Rental',
                ],
            },
        ],
        boxNumber: {
            type: Number,
            required: [true, 'Please provide box number'],
            enum: [1, 2],
            default: 1,
        },
        turfType: {
            type: String,
            enum: ['Artificial Grass', 'Natural Grass', 'Concrete', 'Matting'],
            default: 'Artificial Grass',
        },
        dimensions: {
            length: Number,
            width: Number,
            unit: {
                type: String,
                enum: ['feet', 'meters'],
                default: 'feet',
            },
        },
        capacity: {
            type: Number,
            default: 22,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        operatingHours: {
            open: {
                type: String,
                default: '06:00',
            },
            close: {
                type: String,
                default: '23:00',
            },
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search and filtering
turfSchema.index({ name: 'text', 'location.city': 'text', description: 'text' });
turfSchema.index({ pricePerHour: 1, rating: -1 });

const Turf = mongoose.model('Turf', turfSchema);

export default Turf;
