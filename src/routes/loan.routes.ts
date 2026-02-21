import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';

const router = Router();

router.get('/', LoanController.getAll);           
router.post('/', LoanController.create);          
router.post('/:id/return', LoanController.returnLoan);

export default router;