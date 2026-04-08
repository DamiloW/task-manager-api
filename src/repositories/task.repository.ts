import prisma from '../config/database.js';
import type { Prisma } from '@prisma/client';

/**
 * Creates a new task in the database.
 * Using Prisma.TaskUncheckedCreateInput ensures type safety,
 * allowing us to pass the raw userId directly.
 */
export const createTask = async (data: Prisma.TaskUncheckedCreateInput) => {
  return await prisma.task.create({ data });
};

/**
 * Retrieves a paginated list of tasks for a specific user.
 */
export const findTasksByUserId = async (userId: string, skip: number, take: number) => {
  return await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take,
    skip
  });
};

/**
 * Counts the total number of tasks for a specific user.
 */
export const countTasksByUserId = async (userId: string) => {
  return await prisma.task.count({ where: { userId } });
};

/**
 * Finds a single task by its unique ID.
 */
export const findTaskById = async (id: string) => {
  return await prisma.task.findUnique({ where: { id } });
};

/**
 * Updates an existing task's data.
 */
export const updateTask = async (id: string, data: Prisma.TaskUncheckedUpdateInput) => {
  return await prisma.task.update({
    where: { id },
    data,
  });
};

/**
 * Deletes a task from the database.
 */
export const deleteTask = async (id: string) => {
  return await prisma.task.delete({
    where: { id },
  });
};