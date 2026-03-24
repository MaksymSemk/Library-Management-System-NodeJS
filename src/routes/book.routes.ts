import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
import { adminOnly } from '../middleware/role.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', BookController.getAll); 
router.get('/:id', BookController.getOne); 

router.post('/', authMiddleware, adminOnly, BookController.create);
router.put('/:id', authMiddleware, adminOnly, BookController.update);
router.delete('/:id', authMiddleware, adminOnly, BookController.delete);

export default router;