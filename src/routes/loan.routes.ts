import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller.js';

const router = Router();

router.get('/', LoanController.getAll);           // Переглянути всі
router.post('/', LoanController.create);          // Видати книгу
router.post('/:id/return', LoanController.returnLoan); // Повернути книгу

export default router;