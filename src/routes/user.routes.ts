import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/role.middleware';
import { avatarUpload } from '../middleware/upload.middleware';

const router = Router();

router.get('/me', authMiddleware, UserController.getMe);
router.post('/me/avatar', authMiddleware, avatarUpload.single('avatar'), UserController.uploadAvatar);
router.delete('/me/avatar', authMiddleware, UserController.deleteAvatar);

router.get('/', authMiddleware, adminOnly, UserController.getAll);
router.get('/:id', authMiddleware, adminOnly, UserController.getOne);
export default router;