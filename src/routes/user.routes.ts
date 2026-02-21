import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = Router();

router.get('/', UserController.getAll);      // Отримати всіх
router.get('/:id', UserController.getOne);   // Отримати за ID
router.post('/', UserController.create);     // Створити нового

export default router;