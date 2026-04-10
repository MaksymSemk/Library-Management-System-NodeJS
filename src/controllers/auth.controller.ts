import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterSchema, LoginSchema, RequestPasswordResetSchema, ResetPasswordSchema } from '../schemas/schema';
import { asyncHandler } from '../utils/asyncHandler';

export const AuthController = {
  register: asyncHandler (async (req: Request, res: Response) => {
      const data = RegisterSchema.parse(req.body);
      const user = await AuthService.register(data);
      res.status(201).json(user);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const data = LoginSchema.parse(req.body);
    const result = await AuthService.login(data);
    res.json(result);
  }),
  
  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await AuthService.refresh(refreshToken);
    res.json(result);
  }),

  requestPasswordReset: asyncHandler(async (req: Request, res: Response) => {
    const data = RequestPasswordResetSchema.parse(req.body);
    await AuthService.requestPasswordReset(data.email);

    res.json({
      message: 'If the provided email is registered, reset instructions have been sent.'
    });
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    const data = ResetPasswordSchema.parse(req.body);
    await AuthService.resetPassword(data.token, data.password);

    res.json({ message: 'Password has been reset successfully.' });
  })
};