import { Router } from "express";

import {
  createComment,
  updateComment,
  deleteComment,
} from "../../controllers/comment/index";
import { verifyJWTstrict } from "../../middleware/common";
const router = Router();
// router.get("/:id", verifyJWTstrict, );
router.post("/create", verifyJWTstrict, createComment);
router.put("/:id", verifyJWTstrict, updateComment);
router.delete("/:id", verifyJWTstrict, deleteComment);

export default router;
