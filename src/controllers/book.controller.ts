import type { Request, Response } from 'express';
import { LibraryService } from '../services/services';
import { BookSchema } from '../schemas/schema';
import { db } from '../storage/storage';

export const BookController = {
  // GET /books
  getAll: (req: Request, res: Response) => {
    res.json(Array.from(db.books.values()));
  },

  // GET /books/:id
  getOne: (req: Request, res: Response) => {
    const book = db.books.get(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Книгу не знайдено' });
    }
    res.json(book);
  },

  // POST /books
  create: (req: Request, res: Response) => {
    const validation = BookSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }
    const book = LibraryService.createBook(validation.data);
    res.status(201).json(book);
  },

  // PUT /books/:id
  update: (req: Request, res: Response) => {
    const book = db.books.get(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Книгу не знайдено' });
    }

    const validation = BookSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const updatedBook = { ...book, ...validation.data };
    db.books.set(req.params.id, updatedBook);
    res.json(updatedBook);
  },

  // DELETE /books/:id
  delete: (req: Request, res: Response) => {
    const exists = db.books.has(req.params.id);
    if (!exists) {
      return res.status(404).json({ message: 'Книгу не знайдено' });
    }
    
    db.books.delete(req.params.id);
    res.status(204).send(); // 204 No Content - успішне видалення
  }
};