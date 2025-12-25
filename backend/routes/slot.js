import express from 'express';
import {
    getSlots,
    getSlotById,
    lockSlot,
    unlockSlot,
    generateSlots,
    createSlot,
    deleteSlot,
} from '../controllers/slotController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/slot/:id', getSlotById);
router.get('/:turfId', getSlots);
router.post('/lock', protect, lockSlot);
router.post('/unlock', protect, unlockSlot);
router.post('/generate', protect, admin, generateSlots);
router.post('/', protect, admin, createSlot);
router.delete('/:id', protect, admin, deleteSlot);

export default router;
