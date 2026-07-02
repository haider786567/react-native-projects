import {z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(5, { message: 'Name must be at least 5 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string().min(6 , { message: 'Confirm Password must be at least 6 characters long' }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], // This will attach the error to the confirmPassword field
});

export type RegisterFormValues = z.infer<typeof RegisterSchema>;