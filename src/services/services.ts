import { db } from '../storage/storage.js';
import type { Loan, Book, User } from '../storage/storage.js';

let bookIdCounter = 1;
let userIdCounter = 1;
let loanIdCounter = 1;

export class LibraryService {
  static createBook(data: Omit<Book, 'id' | 'available'>): Book {
    const book: Book = { ...data, id: String(bookIdCounter++), available: true };
    db.books.set(book.id, book);
    return book;
  }

  static createUser(data: Omit<User, 'id'>): User {
    const user: User = { ...data, id: String(userIdCounter++) };
    db.users.set(user.id, user);
    return user;
  }

  static createLoan(userId: string, bookId: string): Loan {
    const book = db.books.get(bookId);
    const user = db.users.get(userId);

    if (!book) throw new Error('Книгу не знайдено');
    if(!user) throw new Error('Користувача не знайдено');
    if (!book.available) throw new Error('Книга вже видана');

    const loan: Loan = {
      id: String(loanIdCounter++),
      userId,
      bookId,
      loanDate: new Date(),
      returnDate: null,
      status: 'ACTIVE'
    };

    book.available = false;
    db.loans.set(loan.id, loan);
    return loan;
  }

  static returnBook(loanId: string): Loan {
    const loan = db.loans.get(loanId);
    if (!loan || loan.status === 'RETURNED') throw new Error('Активну позику не знайдено');

    const book = db.books.get(loan.bookId);
    if (book) book.available = true;

    loan.status = 'RETURNED';
    loan.returnDate = new Date();
    
    return loan;
  }
}