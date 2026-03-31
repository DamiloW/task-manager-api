import type { Response } from 'express';
import { createTaskSchema, updateTaskSchema } from '../validations/task.schema.js';
import * as taskService from '../services/task.service.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

// --- CREATE TASK ---
export const createTask = async (req: AuthRequest, res: Response) => {
  const validation = createTaskSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid data. Please check the provided information.',
      errors: validation.error.issues.map(issue => ({ field: issue.path, message: issue.message }))
    });
  }

  try {
    const newTask = await taskService.createTaskService(validation.data);
    return res.status(201).json({ status: 'success', data: newTask });

  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(400).json({ status: 'error', message: 'User not found. Cannot create task for a non-existent user.' });
    }
    console.error('[DB_ERROR] Error creating task:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
};

// --- GET USER TASKS ---
export const getUserTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await taskService.getUserTasksService(userId, page, limit);

    return res.status(200).json({ 
      status: 'success', 
      meta: {
        totalItems: result.totalItems,
        currentPage: result.currentPage,
        itemsPerPage: result.itemsPerPage,
        totalPages: result.totalPages
      },
      data: result.tasks
    });

  } catch (error) {
    console.error('[DB_ERROR] Error fetching user tasks:', error);
    return res.status(500).json({ status: 'error', message: 'Error fetching user tasks.'});
  }
};

// --- UPDATE TASK ---
export const updateTask = async (req: AuthRequest, res: Response) => {
  const validation = updateTaskSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid data. Please check the provided information.',
      errors: validation.error.issues.map(issue => ({ field: issue.path, message: issue.message }))
    });
  }

  try {
    const { id } = req.params;
    const updatedTask = await taskService.updateTaskService(id, validation.data);
    return res.status(200).json({ status: 'success', data: updatedTask });

  } catch (error: any) {
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({ status: 'error', message: 'Task not found.' });
    }
    console.error('[DB_ERROR] Error updating task:', error);
    return res.status(500).json({ status: 'error', message: 'Error updating task.' });
  }
};

// --- DELETE TASK ---
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await taskService.deleteTaskService(id);
    return res.status(200).json({ status: 'success', message: 'Task deleted successfully.'});

  } catch (error: any) {
    if (error.message === 'TASK_NOT_FOUND') {
      return res.status(404).json({ status: 'error', message: 'Task not found.' });
    }
    console.error('[DB_ERROR] Error deleting task:', error);
    return res.status(500).json({ status: 'error', message: 'Error deleting task.' });
  }
};