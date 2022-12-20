import express from 'express';
import passport from 'passport';
import noteControllers from '../controllers/note.controller';

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), noteControllers.getNotes);
router.get('/:id', passport.authenticate('jwt', { session: false }), noteControllers.getNote);
router.post('/', passport.authenticate('jwt', { session: false }), noteControllers.postNote);
router.put('/:id', passport.authenticate('jwt', { session: false }), noteControllers.updateNote);
router.delete('/:id', passport.authenticate('jwt', { session: false }), noteControllers.deleteNote)
router.put('/restore/:id', passport.authenticate('jwt', { session: false }), noteControllers.undoDeleteNote)

export default router;
