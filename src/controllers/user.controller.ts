import { Request, Response } from 'express';
import  prisma  from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';


export const UserController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    res.json(users);
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, name: true, email: true, role: true }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  }),

  getMe: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json(user);
  })
};