import * as taskRepository from '../repositories/task.repository.js';
import * as userRepository from '../repositories/user.repository.js';
import type { Prisma } from '@prisma/client';

/**
 * Creates a new task.
 * Verifies if the assigned user exists before allowing the creation.
 */
export const createTaskService = async (taskData: Prisma.TaskUncheckedCreateInput) => {
  const userExists = await userRepository.findUserById(taskData.userId as string);
  
  if (!userExists) {
    throw new Error('USER_NOT_FOUND');
  }

  return await taskRepository.createTask(taskData);
};

/**
 * Retrieves a paginated list of tasks for a specific user.
 * Calculates total pages and offsets for frontend consumption.
 */
export const getUserTasksService = async (userId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const tasks = await taskRepository.findTasksByUserId(userId, skip, limit);
  const totalTasks = await taskRepository.countTasksByUserId(userId);
  const totalPages = Math.ceil(totalTasks / limit);

  return {
    tasks,
    totalItems: totalTasks,
    currentPage: page,
    itemsPerPage: limit,
    totalPages
  };
};

/**
 * Updates an existing task.
 * Ensures the task exists in the database before attempting the update.
 */
export const updateTaskService = async (id: string, updateData: Prisma.TaskUncheckedUpdateInput) => {
  const taskExists = await taskRepository.findTaskById(id);
  
  if (!taskExists) {
    throw new Error('TASK_NOT_FOUND');
  }

  return await taskRepository.updateTask(id, updateData);
};

/**
 * Deletes a task by ID.
 * Ensures the task exists in the database before attempting deletion.
 */
export const deleteTaskService = async (id: string) => {
  const taskExists = await taskRepository.findTaskById(id);
  
  if (!taskExists) {
    throw new Error('TASK_NOT_FOUND');
  }

  return await taskRepository.deleteTask(id);
};