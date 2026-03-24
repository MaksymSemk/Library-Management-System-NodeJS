import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/role.middleware';

const router = Router();

router.get('/me', authMiddleware, UserController.getMe);

router.get('/', authMiddleware, adminOnly, UserController.getAll);
router.get('/:id', authMiddleware, adminOnly, UserController.getOne);
export default router;