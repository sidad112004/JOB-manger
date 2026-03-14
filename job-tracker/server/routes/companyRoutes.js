import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createCompany,
  getCompanies,
  deleteCompany,
  getCompany
} from '../controllers/companyController.js';

const router = express.Router();

// All company routes require authentication
router.use(authMiddleware);

router.post('/', createCompany);
router.get('/', getCompanies);
router.get('/:id', getCompany);
router.delete('/:id', deleteCompany);

export default router;
