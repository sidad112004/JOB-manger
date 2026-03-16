import * as Task from '../models/taskModel.js';

export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, due_date, priority, category, company_id } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.createTask(userId, { title, due_date, priority, category, company_id });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks  = await Task.getUserTasks(userId);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

export const completeTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.completeTask(taskId, userId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error completing task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await Task.deleteTask(taskId, userId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

export const getUpcomingTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks  = await Task.getUpcomingTasks(userId, 5);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching upcoming tasks' });
  }
};
