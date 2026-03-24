import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', LoanController.getAll);
router.post('/', LoanController.create);
router.post('/:id/return', LoanController.returnLoan);

export default router;