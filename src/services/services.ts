import prisma from '../lib/prisma';

export class LibraryService {
  static async createBook(data: any) {
    return await prisma.book.create({ data });
  }

  static async updateBook(id: string, data: any) {
    return await prisma.book.update({ where: { id }, data });
  }

  static async deleteBook(id: string) {
    return await prisma.book.delete({ where: { id } });
  }

  static async createLoan(userId: string, bookId: string) {
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    
    if (!book) throw new Error('Book not found');
    if (!book.available) throw new Error('Book is already checked out');

    return await prisma.$transaction([
      prisma.loan.create({
        data: { userId, bookId, status: 'ACTIVE' }
      }),
      prisma.book.update({
        where: { id: bookId },
        data: { available: false }
      })
    ]);
  }

  static async returnBook(loanId: string) {
    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan || loan.status === 'RETURNED') throw new Error('Active loan not found');

    return await prisma.$transaction([
      prisma.loan.update({
        where: { id: loanId },
        data: { status: 'RETURNED', returnDate: new Date() }
      }),
      prisma.book.update({
        where: { id: loan.bookId },
        data: { available: true }
      })
    ]);
  }
}