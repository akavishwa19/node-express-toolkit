import { z } from 'zod';

export const UserSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
  age: z.number()
});
