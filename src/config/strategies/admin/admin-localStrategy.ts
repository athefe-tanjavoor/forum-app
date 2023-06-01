import passport from "passport";
import localStrategy from "passport-local";

import { Admin } from "../../../models";

passport.use("admin-local", new localStrategy.Strategy(Admin.authenticate()));
