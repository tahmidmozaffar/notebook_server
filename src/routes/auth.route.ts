import express from 'express';
import authControllers from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);

export default router;
