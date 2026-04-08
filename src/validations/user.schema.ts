import { z } from 'zod';

export const createUserSchema = z.object({
name: z.string({
    message: 'Name is required and must be a string.',
  }).min(2, 'Name must be at least 2 characters long.'),

  email: z.email({ error: "Please provide a valid email address." }),

password: z.string({
    message: 'Password is required.',
  }).min(6, 'Password must be at least 6 characters long.')
});

export const updateUserSchema = createUserSchema.partial();