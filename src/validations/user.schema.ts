import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters long." }),
  email: z.email({ error: "Please provide a valid email address." }),
  password: z.string().min(6, { error: "Password must be at least 6 characters long." })
});