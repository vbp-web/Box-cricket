import mongoose from 'mongoose';
import Turf from '../models/Turf.js';
import cloudinary from '../config/cloudinary.js';
import { logger } from '../utils/logger.js';

// @desc    Get all turfs
// @route   GET /api/turfs
// @access  Public
export const getTurfs = async (req, res, next) => {
    try {
        const {
            search,
            city,
            minPrice,
            maxPrice,
            rating,
            facilities,
            turfType,
            sortBy = 'createdAt',
            order = 'desc',
            page = 1,
            limit = 10,
        } = req.query;

        // Build query
        const query = { isActive: true };

        // Search
        if (search) {
            query.$text = { $search: search };
        }

        // City filter
        if (city) {
            query['location.city'] = new RegExp(city, 'i');
        }

        // Price range
        if (minPrice || maxPrice) {
            query.pricePerHour = {};
            if (minPrice) query.pricePerHour.$gte = Number(minPrice);
            if (maxPrice) query.pricePerHour.$lte = Number(maxPrice);
        }

        // Rating filter
        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        // Facilities filter
        if (facilities) {
            const facilitiesArray = facilities.split(',');
            query.facilities = { $all: facilitiesArray };
        }

        // Turf type filter
        if (turfType) {
            query.turfType = turfType;
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        // Sort
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        // Execute query
        const turfs = await Turf.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit))
            .select('-__v');

        const total = await Turf.countDocuments(query);

        res.json({
            success: true,
            data: {
                turfs,
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

// @desc    Get single turf
// @route   GET /api/turfs/:id
// @access  Public
export const getTurf = async (req, res, next) => {
    try {
        // Validate turf ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid turf ID format',
            });
        }

        const turf = await Turf.findById(req.params.id).populate('createdBy', 'name email');

        if (!turf) {
            return res.status(404).json({
                success: false,
                message: 'Turf not found',
            });
        }

        res.json({
            success: true,
            data: { turf },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create turf
// @route   POST /api/turfs
// @access  Private/Admin
export const createTurf = async (req, res, next) => {
    try {
        const {
            name,
            description,
            location,
            pricePerHour,
            facilities,
            turfType,
            dimensions,
            capacity,
            operatingHours,
            images,
        } = req.body;

        // Upload images to Cloudinary
        const uploadedImages = [];
        if (images && images.length > 0) {
            for (const image of images) {
                const result = await cloudinary.uploader.upload(image, {
                    folder: 'shivas-hub/turfs',
                    transformation: [
                        { width: 1200, height: 800, crop: 'fill' },
                        { quality: 'auto' },
                    ],
                });

                uploadedImages.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        }

        const turf = await Turf.create({
            name,
            description,
            location,
            pricePerHour,
            facilities,
            turfType,
            dimensions,
            capacity,
            operatingHours,
            images: uploadedImages,
            createdBy: req.user.id,
        });

        logger.info(`New turf created: ${name} by ${req.user.email}`);

        res.status(201).json({
            success: true,
            message: 'Turf created successfully',
            data: { turf },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update turf
// @route   PUT /api/turfs/:id
// @access  Private/Admin
export const updateTurf = async (req, res, next) => {
    try {
        // Validate turf ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid turf ID format',
            });
        }

        let turf = await Turf.findById(req.params.id);

        if (!turf) {
            return res.status(404).json({
                success: false,
                message: 'Turf not found',
            });
        }

        const {
            name,
            description,
            location,
            pricePerHour,
            facilities,
            turfType,
            dimensions,
            capacity,
            operatingHours,
            isActive,
            images,
        } = req.body;

        // Handle image updates
        if (images && images.length > 0) {
            // Delete old images from Cloudinary
            for (const image of turf.images) {
                await cloudinary.uploader.destroy(image.publicId);
            }

            // Upload new images
            const uploadedImages = [];
            for (const image of images) {
                const result = await cloudinary.uploader.upload(image, {
                    folder: 'shivas-hub/turfs',
                    transformation: [
                        { width: 1200, height: 800, crop: 'fill' },
                        { quality: 'auto' },
                    ],
                });

                uploadedImages.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }

            turf.images = uploadedImages;
        }

        // Update other fields
        if (name) turf.name = name;
        if (description) turf.description = description;
        if (location) turf.location = { ...turf.location, ...location };
        if (pricePerHour) turf.pricePerHour = pricePerHour;
        if (facilities) turf.facilities = facilities;
        if (turfType) turf.turfType = turfType;
        if (dimensions) turf.dimensions = { ...turf.dimensions, ...dimensions };
        if (capacity) turf.capacity = capacity;
        if (operatingHours) turf.operatingHours = { ...turf.operatingHours, ...operatingHours };
        if (typeof isActive !== 'undefined') turf.isActive = isActive;

        await turf.save();

        logger.info(`Turf updated: ${turf.name} by ${req.user.email}`);

        res.json({
            success: true,
            message: 'Turf updated successfully',
            data: { turf },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete turf
// @route   DELETE /api/turfs/:id
// @access  Private/Admin
export const deleteTurf = async (req, res, next) => {
    try {
        // Validate turf ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid turf ID format',
            });
        }

        const turf = await Turf.findById(req.params.id);

        if (!turf) {
            return res.status(404).json({
                success: false,
                message: 'Turf not found',
            });
        }

        // Delete images from Cloudinary
        for (const image of turf.images) {
            await cloudinary.uploader.destroy(image.publicId);
        }

        await turf.deleteOne();

        logger.info(`Turf deleted: ${turf.name} by ${req.user.email}`);

        res.json({
            success: true,
            message: 'Turf deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
