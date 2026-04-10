import { Request, Response } from 'express';
import prisma  from '../lib/prisma';
import { LibraryService } from '../services/services';
import { BookSchema } from '../schemas/schema';
import { asyncHandler } from '../utils/asyncHandler';


export const BookController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const books = await prisma.book.findMany();
    res.json(books);
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const bookId = String(req.params.id);
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const validation = BookSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json(validation.error.format());
    
    const book = await LibraryService.createBook(validation.data);
    res.status(201).json(book);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const validation = BookSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json(validation.error.format());

    try {
      const bookId = String(req.params.id);
      const updatedBook = await LibraryService.updateBook(bookId, validation.data);
      res.json(updatedBook);
    } catch (e) {
      res.status(404).json({ message: 'Book not found' });
    }
  }),

  delete: asyncHandler( async (req: Request, res: Response) => {
    try {
      const bookId = String(req.params.id);
      await LibraryService.deleteBook(bookId);
      res.status(204).send();
    } catch (e) {
      res.status(404).json({ message: 'Book not found' });
    }
  })
};