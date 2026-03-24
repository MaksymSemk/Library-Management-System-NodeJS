import { z } from 'zod';

export const BookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  year: z.number().int().max(new Date().getFullYear()),
  isbn: z.string().min(10)
});

export const UserSchema = z.object({
  name: z.string().min(2),
  email: z.email()
});

export const LoanSchema = z.object({
 userId: z.string().min(1), 
  bookId: z.string().min(1)
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(2)
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});