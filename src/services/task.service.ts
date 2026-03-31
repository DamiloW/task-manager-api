import * as taskRepository from '../repositories/task.repository.js';
import * as userRepository from '../repositories/user.repository.js';

export const createTaskService = async (taskData: any) => {
  const userExists = await userRepository.findUserById(taskData.userId);
  if (!userExists) {
    throw new Error('USER_NOT_FOUND');
  }

  return await taskRepository.createTask(taskData);
};

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

export const updateTaskService = async (id: string, updateData: any) => {
  const taskExists = await taskRepository.findTaskById(id);
  if (!taskExists) {
    throw new Error('TASK_NOT_FOUND');
  }

  return await taskRepository.updateTask(id, updateData);
};

export const deleteTaskService = async (id: string) => {
  const taskExists = await taskRepository.findTaskById(id);
  if (!taskExists) {
    throw new Error('TASK_NOT_FOUND');
  }

  return await taskRepository.deleteTask(id);
};