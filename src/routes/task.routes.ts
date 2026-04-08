import { Router } from 'express';
import { createTask, getUserTasks, updateTask, deleteTask } from '../controllers/task.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const taskRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management and operations
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task successfully created
 *       400:
 *         description: Invalid data provided
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
taskRoutes.post('/tasks', authMiddleware, createTask);

/**
 * @swagger
 * /users/{userId}/tasks:
 *   get:
 *     summary: Retrieve a paginated list of tasks for a specific user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A paginated list of tasks retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
taskRoutes.get('/users/:userId/tasks', authMiddleware, getUserTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update an existing task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid data provided
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
taskRoutes.put('/tasks/:id', authMiddleware, updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
taskRoutes.delete('/tasks/:id', authMiddleware, deleteTask);