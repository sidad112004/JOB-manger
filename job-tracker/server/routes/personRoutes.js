import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createPerson,
  getPeopleByCompany,
  deletePerson,
  getPersonDetails,
  updatePerson,
  getPersonByUrl,
  getAllPeopleForUser
} from '../controllers/personController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createPerson);
router.get('/all', getAllPeopleForUser);
router.get('/lookup', getPersonByUrl);
router.get('/company/:companyId', getPeopleByCompany);
router.get('/:id', getPersonDetails);
router.delete('/:id', deletePerson);
router.put('/:id', updatePerson);

export default router;
