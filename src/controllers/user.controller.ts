import type { Request, Response } from 'express';
import { createUserSchema, updateUserSchema } from '../validations/user.schema.js';
import * as userService from '../services/user.service.js';

/**
 * Creates a new user in the database.
 */
export const createUser = async (req: Request, res: Response) => {
  const validation = createUserSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid data. Please check the provided information.',
      errors: validation.error.issues.map(issue => ({
        field: issue.path.join('.'),
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
    console.error('[UserController] Error creating user:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
};

/**
 * Authenticates a user and returns a JWT token.
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const token = await userService.loginUserService(req.body);
    return res.status(200).json({ status: 'success', token });

  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
    }
    console.error('[UserController] Error logging in:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error during login.' });
  }
};

/**
 * Retrieves a list of all users.
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsersService();
    return res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    console.error('[UserController] Error fetching users:', error);
    return res.status(500).json({ status: 'error', message: 'Error fetching users.' });
  }
};

/**
 * Updates an existing user's information by ID.
 */
export const updateUser = async (req: Request, res: Response) => {
  const validation = updateUserSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid data provided.',
      errors: validation.error.issues.map(issue => ({ field: issue.path.join('.'), message: issue.message }))
    });
  }

  try {
    const { id } = req.params;
    const updatedUser = await userService.updateUserService(id as string, validation.data);
    return res.status(200).json({ status: 'success', data: updatedUser });

  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }
    console.error('[UserController] Error updating user:', error);
    return res.status(500).json({ status: 'error', message: 'Error updating user.' });
  }
};

/**
 * Deletes a user from the database by ID.
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUserService(id as string);
    return res.status(200).json({ status: 'success', message: 'User deleted successfully.' });

  } catch (error: any) {
    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }
    console.error('[UserController] Error deleting user:', error);
    return res.status(500).json({ status: 'error', message: 'Error deleting user.' });
  }
};