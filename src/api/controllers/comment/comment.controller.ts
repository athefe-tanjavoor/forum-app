import { type Request, type Response } from "express";
import { Comment } from "../../../models";
import { resHandler } from "../../../utils";

async function createComment(req: Request, res: Response) {
  try {
    const newComment = await Comment.create({
      admin: req.user._id,
      ...req.body,
    });
    return res.status(200).send(newComment);
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function updateComment(req: Request, res: Response) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json(resHandler(req, null, "Comment does not exist", "00040"));
    }
    if (comment?.admin.toString() === req.user._id) {
      await Comment.updateOne({ _id: comment._id }, { $set: req.body });
      res.status(200).json("post updated");
    } else {
      return res
        .status(401)
        .json(resHandler(req, null, "Comment does not belong to you", "00030"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function deleteComment(req: Request, res: Response) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res
        .status(404)
        .json(resHandler(req, null, "Comment does not exist", "00040"));
    }
    if (comment?.admin.toString() === req.user._id) {
      await Comment.deleteOne({ _id: comment._id }, { $set: req.body });
      res.status(200).json({ message: "Forum Deleted" });
    } else {
      return res
        .status(401)
        .json(resHandler(req, null, "Comment does not belong to you", "00030"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

export { createComment, updateComment, deleteComment };
