import passport from "passport";
import jwtstrategy, { type StrategyOptions } from "passport-jwt";

import { Env } from "..";
const opts: StrategyOptions = {
  secretOrKey: Env.JWT_SECRET_KEY,
  jwtFromRequest: jwtstrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
};
passport.use(
  "jwt",
  new jwtstrategy.Strategy(opts, (user, done) => {
    done(null, user);
  })
);
