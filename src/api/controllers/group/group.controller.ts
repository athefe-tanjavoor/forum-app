import { type Request, type Response } from "express";
import { Group } from "../../../models";
import { resHandler } from "../../../utils";

async function createGroup(req: Request, res: Response) {
  try {
    const newPost = await Group.create({
      admin: req.user._id,
      ...req.body,
    });
    return res.status(200).send(newPost);
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}
async function joinGroup(req: Request, res: Response) {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (
      group?.groupMembers.findIndex((x) => x.toString() === req.user._id) === -1
    ) {
      await Group.updateOne(
        { _id: group._id },
        { $push: { groupMembers: req.user._id } }
      );
      res.status(200).json({ message: "you joined in this group" });
    } else {
      await Group.updateOne(
        { _id: group?._id },
        { $pull: { groupMembers: req.user._id } }
      );
      return res.json({ message: "you left this group" });
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function updateGroup(req: Request, res: Response) {
  try {
    console.log("reached");
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (group?.admin.toString() === req.user._id) {
      await Group.updateOne({ _id: group._id }, { $set: req.body });
      res.status(200).json("Group updated");
    } else {
      return res
        .status(401)
        .json(resHandler(req, null, "Group does not belong to you", "00022"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function deleteGroup(req: Request, res: Response) {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    console.log("hiii2");
    if (group?.admin.toString() === req.user._id) {
      await group?.deleteOne({ _id: group._id });
      res.status(200).json("Group deleted");
    } else {
      return res
        .status(401)
        .json(resHandler(req, null, "Group does not belong to you", "00022"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

export { createGroup, joinGroup, updateGroup, deleteGroup };
