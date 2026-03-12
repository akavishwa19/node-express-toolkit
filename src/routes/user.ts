import express from 'express';
import { create, update, remove, get, list } from '../controllers/user';
import { schemaValidation } from '../middleware/schemaValidation';
import { UserSchema } from '../validators/user';

const router = express.Router();

router.post('/', schemaValidation(UserSchema), create);
router.put('/', schemaValidation(UserSchema), update);
router.delete('/', remove);
router.get('/', get);
router.get('/list', list);

export default router;
