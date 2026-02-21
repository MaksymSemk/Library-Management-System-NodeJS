import type { Request, Response } from 'express';
import { LibraryService } from '../services/services';
import { db } from '../storage/storage';
import { LoanSchema } from '../schemas/schema';

export const LoanController = {
  // GET /loans
  getAll: (req: Request, res: Response) => {
    const loans = Array.from(db.loans.values());
    res.json(loans);
  },

  // POST /loans
  create: (req: Request, res: Response) => {
    const validation = LoanSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json(validation.error);
    
    try {
      const loan = LibraryService.createLoan(validation.data.userId, validation.data.bookId);
      res.status(201).json(loan);
    } catch (e: any) {
      // Помилка, якщо книгу вже видано або id невірні
      res.status(400).json({ message: e.message });
    }
  },

  // POST /loans/:id/return
  returnLoan: (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const loan = LibraryService.returnBook(id!);
      res.json(loan);
    } catch (e: any) {
      res.status(404).json({ message: e.message });
    }
  }
};