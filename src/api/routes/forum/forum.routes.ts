import { Router } from "express";
import {
  createForum,
  updateForum,
  deleteForum,
  joinForum,
  upvoteForum,
  downvoteForum,
  upvoteForums,
  likeForum,
  retweet,
  comment,
  getForum,
  viewForum,
} from "../../controllers/forum/index";
import { verifyJWTstrict } from "../../middleware/common";

const router = Router();
router.get("/:id", verifyJWTstrict, getForum);
router.post("/create", verifyJWTstrict, createForum);
router.post("/:id/view", verifyJWTstrict, viewForum);
router.put("/:id/join", verifyJWTstrict, joinForum);
router.put("/:id/upvotes", verifyJWTstrict, upvoteForum);
router.put("/:id/upvoteforum", verifyJWTstrict, upvoteForums);
router.put("/:id/downvoteforum", verifyJWTstrict, downvoteForum);
router.put("/:id/like", verifyJWTstrict, likeForum);
router.put("/:id/retweet", verifyJWTstrict, retweet);
router.put("/:id/comment", verifyJWTstrict, comment);
router.put("/:id", verifyJWTstrict, updateForum);
router.delete("/:id", verifyJWTstrict, deleteForum);
export default router;
