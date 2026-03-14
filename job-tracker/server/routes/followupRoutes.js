import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createFollowup,
  getFollowupsByPerson,
  completeFollowup,
  getUpcomingFollowups
} from '../controllers/followupController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createFollowup);
router.get('/upcoming', getUpcomingFollowups);
router.get('/person/:personId', getFollowupsByPerson);
router.patch('/:id/complete', completeFollowup);

export default router;
