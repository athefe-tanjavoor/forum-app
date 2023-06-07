import passport from "passport";
import localStrategy from "passport-local";

import { User } from "../../../models";

passport.use("user-local", new localStrategy.Strategy(User.authenticate()));
