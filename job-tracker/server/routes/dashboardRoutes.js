import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getStats, getActivity } from '../controllers/dashboardController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', getStats);
router.get('/activity', getActivity);

export default router;
