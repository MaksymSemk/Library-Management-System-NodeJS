import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import  prisma  from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';

const removeAvatarFile = async (avatarUrl: string) => {
  const normalized = avatarUrl.replace(/^\/+/, '');
  const filePath = path.join(process.cwd(), normalized);

  try {
    await fs.unlink(filePath);
  } catch (error: any) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }
};


export const UserController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true }
    });
    res.json(users);
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const userId = String(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  }),

  getMe: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true }
    });
    res.json(user);
  }),

  uploadAvatar: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Avatar file is required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.avatarUrl) {
      await removeAvatarFile(user.avatarUrl);
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl }
    });

    res.json({
      message: 'Avatar updated successfully.',
      avatarUrl
    });
  }),

  deleteAvatar: asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.avatarUrl) {
      return res.status(404).json({ message: 'Avatar not found' });
    }

    await removeAvatarFile(user.avatarUrl);
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null }
    });

    res.json({ message: 'Avatar deleted.' });
  })
};