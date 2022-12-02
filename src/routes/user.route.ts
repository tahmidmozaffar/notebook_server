import express from 'express';
import passport from 'passport';
import userControllers from '../controllers/user.controller';
import { fieldValidation, confirmPasswordValidation, emailValidation } from '../middlewares/validation';

const router = express.Router();

router.post('/resetpassword', emailValidation, userControllers.resetPassword);
router.put('/resetpassword', userControllers.updatePassword);


router.post('/changepassword', passport.authenticate('jwt', { session: false }),
  fieldValidation('currentPassword'),
  fieldValidation('newPassword'),
  fieldValidation('confirmPassword'),
  confirmPasswordValidation,
  userControllers.changePassword);

router.put('/', passport.authenticate('jwt', { session: false }), userControllers.updateProfile);
router.delete('/', passport.authenticate('jwt', { session: false }), userControllers.deleteProfile);

export default router;
