import express from "express";

import {
  createGroup,
  deleteGroup,
  updateGroup,
  joinGroup,
} from "../../controllers/group/index";
import { verifyJWTstrict } from "../../middleware/common";

const router = express.Router();

// User can Create Group with this Router
router.post("/create", verifyJWTstrict, createGroup);

// User can Update his  Group with this Router with his own id
router.put("/:id/update", verifyJWTstrict, updateGroup);

// User can Update his  Group with this Router with his own id
router.put("/:id/join", verifyJWTstrict, joinGroup);

// User can delete his own Group with this Router with his own id
router.delete("/:id", verifyJWTstrict, deleteGroup);

export default router;
