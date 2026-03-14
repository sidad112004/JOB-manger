import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createPerson,
  getPeopleByCompany,
  deletePerson,
  getPersonDetails
} from '../controllers/personController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createPerson);
router.get('/company/:companyId', getPeopleByCompany);
router.get('/:id', getPersonDetails);
router.delete('/:id', deletePerson);

export default router;
