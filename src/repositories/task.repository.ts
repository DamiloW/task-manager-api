import prisma from '../config/database.js';

export const createTask = async (data: any) => {
  return await prisma.task.create({ data });
};

export const findTasksByUserId = async (userId: string, skip: number, take: number) => {
  return await prisma.task.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
    take: take,
    skip: skip
  });
};

export const countTasksByUserId = async (userId: string) => {
  return await prisma.task.count({ where: { userId: userId } });
};

export const findTaskById = async (id: string) => {
  return await prisma.task.findUnique({ where: { id } });
};

export const updateTask = async (id: string, data: any) => {
  return await prisma.task.update({
    where: { id: id },
    data: data,
  });
};

export const deleteTask = async (id: string) => {
  return await prisma.task.delete({
    where: { id: id },
  });
};