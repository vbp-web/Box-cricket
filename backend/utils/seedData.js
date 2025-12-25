import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Turf from '../models/Turf.js';
import Slot from '../models/Slot.js';
import connectDB from '../config/db.js';
import { logger } from '../utils/logger.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Turf.deleteMany();
        await Slot.deleteMany();

        logger.info('Existing data cleared');

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: process.env.ADMIN_EMAIL || 'admin@shivashub.com',
            phone: '9876543210',
            password: process.env.ADMIN_PASSWORD || 'Admin@123',
            role: 'admin',
        });

        logger.info('Admin user created');

        // Create sample users
        const users = await User.create([
            {
                name: 'Rahul Sharma',
                email: 'rahul@example.com',
                phone: '9876543211',
                password: 'password123',
            },
            {
                name: 'Priya Patel',
                email: 'priya@example.com',
                phone: '9876543212',
                password: 'password123',
            },
        ]);

        logger.info('Sample users created');

        // Create Box 1 and Box 2 at Shiva's Box Cricket
        const turfs = await Turf.create([
            {
                name: "Shiva's Box Cricket - Box 1",
                description:
                    'Premium box cricket turf with state-of-the-art facilities. Perfect for corporate matches and tournaments. Features include professional lighting, scoreboard, and comfortable seating area.',
                location: {
                    address: 'Shiva sports Hub Near Rajdhani Panchvati crossing,Borisana RD, Kalol',
                    city: 'Kalol',
                    state: 'Gujarat',
                    pincode: '382721',
                    coordinates: {
                        latitude: 23.2456,
                        longitude: 72.4987,
                    },
                },
                images: [
                    {
                        url: '/turf-images/1000042249.jpg',
                        publicId: 'shivas-box1-main',
                    },
                    {
                        url: '/turf-images/1000042254.jpg',
                        publicId: 'shivas-box1-2',
                    },
                    {
                        url: '/turf-images/1000043112.jpg',
                        publicId: 'shivas-box1-3',
                    },
                ],
                pricePerHour: 1200,
                boxNumber: 1,
                facilities: [
                    'Parking',
                    'Washroom',
                    'Changing Room',
                    'Drinking Water',
                    'Lighting',
                    'Scoreboard',
                    'Seating Area',
                ],
                turfType: 'Artificial Grass',
                dimensions: {
                    length: 120,
                    width: 80,
                    unit: 'feet',
                },
                capacity: 22,
                rating: 4.5,
                totalReviews: 45,
                operatingHours: {
                    open: '06:00',
                    close: '23:00',
                },
                createdBy: admin._id,
            },
            {
                name: "Shiva's Box Cricket - Box 2",
                description:
                    'Premium box cricket turf with state-of-the-art facilities. Perfect for corporate matches and tournaments. Features include professional lighting, scoreboard, and comfortable seating area.',
                location: {
                    address: 'Shiva sports Hub Near Rajdhani Panchvati crossing,Borisana RD, Kalol',
                    city: 'Kalol',
                    state: 'Gujarat',
                    pincode: '382721',
                    coordinates: {
                        latitude: 23.2456,
                        longitude: 72.4987,
                    },
                },
                images: [
                    {
                        url: '/turf-images/1000042249.jpg',
                        publicId: 'shivas-box2-main',
                    },
                    {
                        url: '/turf-images/1000042254.jpg',
                        publicId: 'shivas-box2-2',
                    },
                    {
                        url: '/turf-images/1000043112.jpg',
                        publicId: 'shivas-box2-3',
                    },
                ],
                pricePerHour: 1200,
                boxNumber: 2,
                facilities: [
                    'Parking',
                    'Washroom',
                    'Changing Room',
                    'Drinking Water',
                    'Lighting',
                    'Scoreboard',
                    'Seating Area',
                ],
                turfType: 'Artificial Grass',
                dimensions: {
                    length: 120,
                    width: 80,
                    unit: 'feet',
                },
                capacity: 22,
                rating: 4.5,
                totalReviews: 45,
                operatingHours: {
                    open: '06:00',
                    close: '23:00',
                },
                createdBy: admin._id,
            },
        ]);

        logger.info('Sample turfs created');

        // Generate slots for the next 7 days for each turf
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const turf of turfs) {
            for (let i = 0; i < 7; i++) {
                const slotDate = new Date(today);
                slotDate.setDate(slotDate.getDate() + i);

                // Parse operating hours
                const [openHour] = turf.operatingHours.open.split(':').map(Number);
                const [closeHour] = turf.operatingHours.close.split(':').map(Number);

                // Generate hourly slots
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
                }
            }
        }

        logger.info('Sample slots generated for 7 days');

        console.log('✅ Data seeded successfully!');
        console.log('\n📧 Admin Credentials:');
        console.log(`Email: ${admin.email}`);
        console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
        console.log('\n📧 Sample User Credentials:');
        console.log('Email: rahul@example.com | Password: password123');
        console.log('Email: priya@example.com | Password: password123');

        process.exit(0);
    } catch (error) {
        logger.error(`Error seeding data: ${error.message}`);
        console.error('Error:', error);
        process.exit(1);
    }
};

seedData();
