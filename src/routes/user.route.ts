import express from 'express';
import passport from 'passport';
import userControllers from '../controllers/user.controller';

const router = express.Router();

router.post('/resetpassword', userControllers.resetPassword);
router.post('/changepassword', passport.authenticate('jwt', { session: false }), userControllers.changePassword);
router.put('/', passport.authenticate('jwt', { session: false }), userControllers.updateProfile);
router.delete('/', passport.authenticate('jwt', { session: false }), userControllers.deleteProfile);

export default router;