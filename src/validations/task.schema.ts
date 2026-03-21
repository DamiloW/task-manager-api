import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3, { error: "Title must be at least 3 characters long." }),
  description: z.string().optional(),
  userId: z.uuid({ error: "Invalid User ID format." })
});