import express from "express";
import passport from "passport";

import {
  createuser,
  deactivateAccount,
  deleteUserAccount,
  followUser,
  getSavedPost,
  loginuser,
  savePost,
  sendEmailVerification,
  verifyEmail,
} from "../../controllers/user/index";
import { verifyJWTstrict } from "../../middleware/common";
const router = express.Router();

// verifying the user with email
router.get("/", verifyEmail);

// get the SavedPost
router.get("/:id/savedpost", verifyJWTstrict, getSavedPost);

router.post("/register", createuser);
router.post(
  "/login",
  passport.authenticate("user-local", { session: false }),
  loginuser
);
router.post("/email", verifyJWTstrict, sendEmailVerification);

// follow  the account
router.put("/:id/follow", verifyJWTstrict, followUser);

router.put("/email/:token", verifyEmail);

// deactivate the account
router.put("/deactivate", verifyJWTstrict, deactivateAccount);

// deactivate the account
router.put("/delete", verifyJWTstrict, deleteUserAccount);

// save the posts
router.put("/:id/savepost", verifyJWTstrict, savePost);

export default router;
