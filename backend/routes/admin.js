import express from 'express';
import User from '../models/User.js';
import Turf from '../models/Turf.js';
import Slot from '../models/Slot.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// @desc    Seed database (public route for initial setup)
// @route   POST /api/admin/seed
// @access  Public (only works if database is empty)
router.post('/seed', async (req, res) => {
    try {
        // Check if database already has data
        const userCount = await User.countDocuments();
        const turfCount = await Turf.countDocuments();

        if (userCount > 0 || turfCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Database already has data. Cannot seed.',
                data: { users: userCount, turfs: turfCount }
            });
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: process.env.ADMIN_EMAIL || 'admin@shivashub.com',
            phone: '9876543210',
            password: process.env.ADMIN_PASSWORD || 'Admin@123',
            role: 'admin',
        });

        // Create turfs
        const turfs = await Turf.create([
            {
                name: "Shiva's Box Cricket - Box 1",
                description: 'Premium box cricket turf with state-of-the-art facilities.',
                location: {
                    address: 'Shiva sports Hub Near Rajdhani Panchvati crossing, Borisana RD, Kalol',
                    city: 'Kalol',
                    state: 'Gujarat',
                    pincode: '382721',
                    coordinates: { latitude: 23.2456, longitude: 72.4987 },
                },
                images: [
                    { url: '/turf-images/1000042249.jpg', publicId: 'shivas-box1-main' },
                    { url: '/turf-images/1000042254.jpg', publicId: 'shivas-box1-2' },
                    { url: '/turf-images/1000043112.jpg', publicId: 'shivas-box1-3' },
                ],
                pricePerHour: 1200,
                boxNumber: 1,
                facilities: ['Parking', 'Washroom', 'Changing Room', 'Drinking Water', 'Lighting', 'Scoreboard', 'Seating Area'],
                turfType: 'Artificial Grass',
                dimensions: { length: 120, width: 80, unit: 'feet' },
                capacity: 22,
                rating: 4.5,
                totalReviews: 45,
                operatingHours: { open: '06:00', close: '23:00' },
                createdBy: admin._id,
            },
            {
                name: "Shiva's Box Cricket - Box 2",
                description: 'Premium box cricket turf with state-of-the-art facilities.',
                location: {
                    address: 'Shiva sports Hub Near Rajdhani Panchvati crossing, Borisana RD, Kalol',
                    city: 'Kalol',
                    state: 'Gujarat',
                    pincode: '382721',
                    coordinates: { latitude: 23.2456, longitude: 72.4987 },
                },
                images: [
                    { url: '/turf-images/1000042249.jpg', publicId: 'shivas-box2-main' },
                    { url: '/turf-images/1000042254.jpg', publicId: 'shivas-box2-2' },
                    { url: '/turf-images/1000043112.jpg', publicId: 'shivas-box2-3' },
                ],
                pricePerHour: 1200,
                boxNumber: 2,
                facilities: ['Parking', 'Washroom', 'Changing Room', 'Drinking Water', 'Lighting', 'Scoreboard', 'Seating Area'],
                turfType: 'Artificial Grass',
                dimensions: { length: 120, width: 80, unit: 'feet' },
                capacity: 22,
                rating: 4.5,
                totalReviews: 45,
                operatingHours: { open: '06:00', close: '23:00' },
                createdBy: admin._id,
            },
        ]);

        // Generate slots for next 7 days
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let slotsCreated = 0;

        for (const turf of turfs) {
            for (let i = 0; i < 7; i++) {
                const slotDate = new Date(today);
                slotDate.setDate(slotDate.getDate() + i);

                const [openHour] = turf.operatingHours.open.split(':').map(Number);
                const [closeHour] = turf.operatingHours.close.split(':').map(Number);

                for (let hour = openHour; hour < closeHour; hour++) {
                    const startTime = `${String(hour).padStart(2, '0')}:00`;
                    const endTime = `${String(hour + 1).padStart(2, '0')}:00`;

                    await Slot.create({
                        turf: turf._id,
                        date: slotDate,
                        startTime,
                        endTime,
                        price: turf.pricePerHour,
                        status: 'available',
                    });
                    slotsCreated++;
                }
            }
        }

        logger.info('Database seeded via API');

        res.status(200).json({
            success: true,
            message: 'Database seeded successfully!',
            data: {
                admin: { email: admin.email },
                turfs: turfs.length,
                slots: slotsCreated,
            },
        });
    } catch (error) {
        logger.error(`Seed API error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to seed database',
            error: error.message,
        });
    }
});

export default router;
