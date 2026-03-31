import { Router } from 'express';
import { createTask, getUserTasks, updateTask, deleteTask } from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const taskRoutes = Router();

taskRoutes.post('/tasks', authMiddleware, createTask);
taskRoutes.get('/users/:userId/tasks', authMiddleware, getUserTasks);
taskRoutes.put('/tasks/:id', authMiddleware, updateTask);
taskRoutes.delete('/tasks/:id', authMiddleware, deleteTask);