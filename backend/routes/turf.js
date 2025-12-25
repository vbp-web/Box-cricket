import express from 'express';
import {
    getTurfs,
    getTurf,
    createTurf,
    updateTurf,
    deleteTurf,
} from '../controllers/turfController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(getTurfs)
    .post(protect, admin, createTurf);

router.route('/:id')
    .get(getTurf)
    .put(protect, admin, updateTurf)
    .delete(protect, admin, deleteTurf);

export default router;
