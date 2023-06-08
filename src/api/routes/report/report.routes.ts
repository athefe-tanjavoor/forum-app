import express from "express";
import {
  createReport,
  viewReportedPosts,
} from "../../controllers/report/index";
import { verifyJWTstrict } from "../../middleware/common";
const router = express.Router();
router.get("/:type", verifyJWTstrict, viewReportedPosts);
router.post("/:type", verifyJWTstrict, createReport);
export default router;
