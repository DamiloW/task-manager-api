import type { Request, Response } from 'express';
import { createUserSchema, updateUserSchema } from '../validations/user.schema.js';
import * as userService from '../services/user.service.js';

// --- CREATE USER ---
export const createUser = async (req: Request, res: Response) => {
  const validation = createUserSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid data. Please check the provided information.',
      errors: validation.error.issues.map(issue => ({
        field: issue.path,
        message: issue.message
      }))
    });
  }

  try {
    const newUser = await userService.createUserService(validation.data);
    return res.status(201).json({ status: 'success', data: newUser });

  } catch (error: any) {
    if (error.message === 'EMAIL_ALREADY_IN_USE') {
      return res.status(409).json({ status: 'error', message: 'This email is already in use.' });
    }
    console.error('[DB_ERROR] Error creating user:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
};

// --- LOGIN USER ---
export const loginUser = async (req: Request, res: Response) => {
  try {
    const token = await userService.loginUserService(req.body);
    return res.status(200).json({ status: 'success', token });

  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
    }
    console.error('[DB_ERROR] Error logging in:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error during login.' });
  }
};

// --- GET ALL USERS ---
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsersService();
    return res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    console.error('[DB_ERROR] Error fetching users:', error);
    return res.status(500).json({ status: 'error', message: 'Error fetching users.' });
  }
};

// --- UPDATE USER ---
export const updateUser = async (req: Request, res: Response) => {
  const validation = updateUserSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid data provided.',
      errors: validation.error.issues.map(issue => ({ field: issue.path, message: issue.message }))
    });
  }

  try {
    const { id } = req.params;
    const updatedUser = await userService.updateUserService(id, validation.data);
    return res.status(200).json({ status: 'success', data: updatedUser });

  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }
    console.error('[DB_ERROR] Error updating user:', error);
    return res.status(500).json({ status: 'error', message: 'Error updating user.' });
  }
};

// --- DELETE USER ---
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUserService(id);
    return res.status(200).json({ status: 'success', message: 'User deleted successfully.' });

  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }
    console.error('[DB_ERROR] Error deleting user:', error);
    return res.status(500).json({ status: 'error', message: 'Error deleting user.' });
  }
};