import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  addNote,
  getNotes,
  deleteNote
} from '../controllers/personNotesController.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', addNote);
router.get('/:personId', getNotes);
router.delete('/:id', deleteNote);

export default router;
