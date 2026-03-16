import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createTask,
  getTasks,
  completeTask,
  deleteTask,
  getUpcomingTasks,
} from '../controllers/taskController.js';

const router = express.Router();

router.get('/',            authMiddleware, getTasks);
router.get('/upcoming',    authMiddleware, getUpcomingTasks);
router.post('/',           authMiddleware, createTask);
router.patch('/:id/complete', authMiddleware, completeTask);
router.delete('/:id',      authMiddleware, deleteTask);

export default router;
