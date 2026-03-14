import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getRecentActivities } from '../controllers/activityController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getRecentActivities);

export default router;
