import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterSchema, LoginSchema } from '../schemas/schema';
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
  })
};