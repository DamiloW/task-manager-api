import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository.js';
import type { Prisma } from '@prisma/client';

// Custom interface for login payload since Prisma doesn't have a specific type for this
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Creates a new user.
 * Checks if the email is already in use and securely hashes the password before saving.
 */
export const createUserService = async (userData: Prisma.UserCreateInput) => {
  const existingUser = await userRepository.findUserByEmail(userData.email);
  
  if (existingUser) {
    throw new Error('EMAIL_ALREADY_IN_USE');
  }

  // Hash the password with a salt round of 10
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return await userRepository.createUser({
    ...userData,
    password: hashedPassword
  });
};

/**
 * Authenticates a user and generates a JWT.
 * Prevents account enumeration by using the same error for wrong email or password.
 */
export const loginUserService = async (credentials: LoginCredentials) => {
  const user = await userRepository.findUserByEmail(credentials.email);
  
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'my_super_secret_key_123',
    { expiresIn: '1h' }
  );

  return token;
};

/**
 * Retrieves all users from the database.
 */
export const getUsersService = async () => {
  return await userRepository.getAllUsers();
};

/**
 * Updates an existing user's data.
 * If a new password is provided, it ensures it is hashed before updating.
 */
export const updateUserService = async (id: string, updateData: Prisma.UserUpdateInput) => {
  const userExists = await userRepository.findUserById(id);
  
  if (!userExists) {
    throw new Error('USER_NOT_FOUND');
  }

  // If the payload includes a password update, hash it first
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password as string, 10);
  }

  return await userRepository.updateUser(id, updateData);
};

/**
 * Deletes a user by their ID.
 */
export const deleteUserService = async (id: string) => {
  const userExists = await userRepository.findUserById(id);
  
  if (!userExists) {
    throw new Error('USER_NOT_FOUND');
  }

  return await userRepository.deleteUser(id);
};