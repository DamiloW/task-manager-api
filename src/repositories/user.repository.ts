import prisma from '../config/database.js';
import type { Prisma } from '@prisma/client';

/**
 * Finds a user by their email address.
 */
export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ 
    where: { email } 
  });
};

/**
 * Finds a user by their unique ID.
 */
export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

/**
 * Retrieves all users from the database.
 */
export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

/**
 * Creates a new user in the database.
 * Uses Prisma.UserCreateInput to guarantee strict type safety.
 */
export const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({ data });
};

/**
 * Updates an existing user's data.
 */
export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

/**
 * Deletes a user from the database.
 */
export const deleteUser = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};