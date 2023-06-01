import {
  type CookieOptions,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import jwt from "jsonwebtoken";
import ms from "ms";
import passport from "passport";

import { Env } from "../../config";
import { resHandler } from "../../utils";

const COOKIE_OPTIONS: CookieOptions =
  Env.NODE_ENV === "development"
    ? {
        domain: "devapi.parrot.in",
        httpOnly: true,
        secure: true,
        sameSite: "none",
        signed: true,
        maxAge: ms(Env.REFRESH_TOKEN_EXPIRY) * 1000,
      }
    : {
        httpOnly: false,
        secure: false,
        maxAge: ms(Env.REFRESH_TOKEN_EXPIRY) * 1000,
        signed: true,
      };

function getToken(user: TokenPayload): string {
  return jwt.sign(user, Env.JWT_SECRET_KEY, {
    expiresIn: Env.session_expiry,
  });
}

function getverifyToken(user: TokenPayload): string {
  return jwt.sign(user, Env.JWT_SECRET_KEY, {
    expiresIn: ms(Env.session_expiry),
  });
}
function getrefreshToken(user: TokenPayload): string {
  return jwt.sign(user, Env.JWT_SECRET_KEY, {
    expiresIn: ms(Env.REFRESH_TOKEN_EXPIRY),
  });
}
function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, Env.JWT_SECRET_KEY) as TokenPayload;
    return decoded;
  } catch (err) {
    return null;
  }
}

// function verifyJWT(req: Request, res: Response, next: NextFunction) {
//   passport.authenticate(
//     "jwt",
//     { session: false },
//     (err: any, user: TokenPayload) => {
//       if (err) {
//         return res.status(500).json({ message: err.message });
//       }
//       if (user === null) {
//         return res
//           .status(403)
//           .json({ req, user, message: "Invalid Credentials" });
//       }
//       if (!user.emailVerified) {
//         return res.status(401).json({ message: "Email not verified" });
//       }
//       if (user.isDeleted) {
//         return res.status(401).json({ message: "User is deleted" });
//       }

//       req.user = user ?? null;
//       next();
//     }
//   )(req, res, next);
// }

function verifyJWTstrict(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: TokenPayload) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (user === null) {
        return res
          .status(403)
          .json({ req, user, message: "Invalid Credentials" });
      }
      if (user.isDeleted) {
        return res.status(401).json({ message: "User is deleted" });
      }
      req.user = user ?? null;
      next();
    }
  )(req, res, next);
}

function allowRole(role: Roles[]) {
  return (adminPermission: Admin_permissions | null) =>
    (req: Request, res: Response, next: NextFunction) => {
      const { user } = req;
      if (user.role === "ADMIN") {
        if (adminPermission && user.adminpermission?.includes(adminPermission))
          next();
        return;
      }
      if (role.includes(user.role)) {
        next();
        return;
      }
      return res
        .status(401)
        .json(resHandler(req, null, "Permission Denied", "00017"));
    };
}
function getRefreshToken(user: TokenPayload): string {
  return jwt.sign(user, Env.REFRESH_TOKEN_EXPIRY, {
    expiresIn: ms(Env.REFRESH_TOKEN_EXPIRY),
  });
}

function generateLoginToken(user: TokenPayload): {
  token: string;
  refreshToken: string;
} {
  const token = getToken(user);
  const refreshToken = getRefreshToken(user);
  return { refreshToken, token };
}

export {
  allowRole,
  COOKIE_OPTIONS,
  generateLoginToken,
  getrefreshToken,
  getToken,
  getverifyToken,
  // verifyJWT,
  verifyJWTstrict,
  verifyToken,
};
