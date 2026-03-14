import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createJob,
  getJobsByCompany,
  updateJobStatus,
  deleteJob
} from '../controllers/jobController.js';

const router = express.Router();

// All job routes require authentication
router.use(authMiddleware);

router.post('/', createJob);
router.get('/company/:companyId', getJobsByCompany);
router.patch('/:id/status', updateJobStatus);
router.delete('/:id', deleteJob);

export default router;
