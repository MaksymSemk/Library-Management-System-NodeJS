import { Router } from 'express';
import { BookController } from '../controllers/book.controller';
const router = Router();

router.get('/', BookController.getAll);           
router.get('/:id', BookController.getOne);       
router.post('/', BookController.create);          
router.put('/:id', BookController.update);        
router.delete('/:id', BookController.delete);     

export default router;