import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addNote, getNotes, deleteNote } from '../controllers/companyNotesController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/:companyId', addNote);
router.get('/:companyId', getNotes);
router.delete('/:id', deleteNote);

export default router;
