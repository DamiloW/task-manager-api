import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository.js';

export const createUserService = async (userData: any) => {
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('EMAIL_ALREADY_IN_USE');
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return await userRepository.createUser({
    ...userData,
    password: hashedPassword
  });
};

export const loginUserService = async (credentials: any) => {
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

export const getUsersService = async () => {
  return await userRepository.getAllUsers();
};

export const updateUserService = async (id: string, updateData: any) => {
  const userExists = await userRepository.findUserById(id);
  if (!userExists) {
    throw new Error('USER_NOT_FOUND');
  }

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  return await userRepository.updateUser(id, updateData);
};

export const deleteUserService = async (id: string) => {
  const userExists = await userRepository.findUserById(id);
  if (!userExists) {
    throw new Error('USER_NOT_FOUND');
  }

  return await userRepository.deleteUser(id);
};