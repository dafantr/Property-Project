import * as z from 'zod';
import { ZodSchema } from 'zod';

export const profileSchema = z.object({
  // firstName: z.string().max(5, { message: 'max length is 5' }),
  firstName: z.string().max(15, { message: 'max length is 15 characters' }),
  lastName: z.string().max(15, { message: 'max length is 15 characters' }),
  username: z.string(),
});