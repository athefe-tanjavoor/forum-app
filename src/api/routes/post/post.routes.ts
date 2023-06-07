import { Router } from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  rePost,
  viewPost,
  likePost,
} from "../../controllers/posts/index";
import { verifyJWTstrict } from "../../middleware/common";

const router = Router();
router.get("/:id", verifyJWTstrict, getPost);
router.post("/create", verifyJWTstrict, createPost);
router.post("/:id/view", verifyJWTstrict, viewPost);
// router.put("/:id/join", verifyJWTstrict, joinForum);
// router.put("/:id/upvotes", verifyJWTstrict, upvoteForum);
// router.put("/:id/upvoteforum", verifyJWTstrict, upvoteForums);
// router.put("/:id/downvoteforum", verifyJWTstrict, downvoteForum);
router.put("/:id/like", verifyJWTstrict, likePost);
router.put("/:id/retweet", verifyJWTstrict, rePost);
// router.put("/:id/comment", verifyJWTstrict, comment);
router.put("/:id", verifyJWTstrict, updatePost);
router.delete("/:id", verifyJWTstrict, deletePost);
export default router;
