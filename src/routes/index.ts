import express from 'express';
const router = express.Router();

//import other routers
import userRouter from './user';

//define routes
router.use('/users', userRouter);

export default router;
