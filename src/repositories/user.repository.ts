import prisma from '../config/database.js';

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ 
    where: { email } 
  });
};

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const createUser = async (data: any) => {
  return await prisma.user.create({ 
    data
   });
};

export const updateUser = async (id: string, data: any) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};