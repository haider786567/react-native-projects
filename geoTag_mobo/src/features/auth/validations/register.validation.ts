import {z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z.string().min(8 , { message: 'Confirm Password must be at least 8 characters long' }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], // This will attach the error to the confirmPassword field
});

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
