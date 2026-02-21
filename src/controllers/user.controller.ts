import { UserSchema } from '../schemas/schema.js';
import type { Request, Response } from 'express';
import { LibraryService } from '../services/services.js';
import { db } from '../storage/storage.js';

export const UserController = {
  // GET /users
  getAll: (req: Request, res: Response) => {
    const users = Array.from(db.users.values());
    res.json(users);
  },

  // GET /users/:id
  getOne: (req: Request, res: Response) => {
    const user = db.users.get(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    res.json(user);
  },

  // POST /users
  create: (req: Request, res: Response) => {
    const validation = UserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }
    
    const user = LibraryService.createUser(validation.data);
    res.status(201).json(user);
  }
};