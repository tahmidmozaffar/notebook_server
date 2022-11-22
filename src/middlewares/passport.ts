import passport from 'passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import { User } from '../models/user.model';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("bearer"),
  secretOrKey: process.env.JWT_SECRET,
}

passport.use(new Strategy(opts, (jwtPayload, done) => {  
  User.findOne({ where: { id: jwtPayload.id } }).then(user => {
    return done(null, user!);
  }).catch(err => {
    console.log("error "+ err.message);
    return done(null, false);
  });
}));

export default passport;
