import { z } from 'zod';

export const createTaskSchema = z.object({
title: z.string({
    message: 'Title is required and must be a string.',
  }).min(3, 'Title must be at least 3 characters long.'), // Mensagem direta aqui!
  
  description: z.string({
    message: 'Description must be a string.',
  }).optional(),
  
  userId: z.uuid({ error: "Invalid User ID format." })
});

export const updateTaskSchema = z.object({
title: z.string({
    message: 'Title must be a string.',
  }).min(3, 'Title must be at least 3 characters long.').optional(),
  
  description: z.string({
    message: 'Description must be a string.',
  }).optional(),
  
  completed: z.boolean({
    message: 'Completed status must be a boolean (true or false).',
  }).optional()
});