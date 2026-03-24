import { Request, Response } from 'express';
import  prisma  from '../lib/prisma';
import { LibraryService } from '../services/services';
import { LoanSchema } from '../schemas/schema';
import { asyncHandler } from '../utils/asyncHandler';


export const LoanController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const where = user.role === 'ADMIN' ? {} : { userId: user.userId };
    
    const loans = await prisma.loan.findMany({
      where,
      include: { book: true, user: { select: { name: true, email: true } } }
    });
    res.json(loans);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const validation = LoanSchema.safeParse(req.body);
    if (!validation.success) return res.status(400).json(validation.error.format());

    try {
      const loan = await LibraryService.createLoan(validation.data.userId, validation.data.bookId);
      res.status(201).json(loan);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  }),

  returnLoan: asyncHandler(async (req: Request, res: Response) => {
    try {
      const loan = await LibraryService.returnBook(req.params.id);
      res.json(loan);
    } catch (e: any) {
      res.status(404).json({ message: e.message });
    }
  })
};