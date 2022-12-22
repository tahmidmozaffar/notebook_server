import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import userService from "../services/user.service";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("bearer"),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new Strategy(opts, (jwtPayload, done) => {
    userService
      .getUserByUserId(jwtPayload.id)
      .then((user) => {
        return done(null, user!);
      })
      .catch((err) => {
        console.log("error " + err.message);
        return done(null, false);
      });
  })
);

export default passport;
