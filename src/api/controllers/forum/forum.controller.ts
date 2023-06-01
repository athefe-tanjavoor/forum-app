import { type Request, type Response } from "express";
import { Forum } from "../../../models";
import { resHandler } from "../../../utils";

async function createForum(req: Request, res: Response) {
  try {
    const newForum = await Forum.create({
      admin: req.user._id,
      ...req.body,
    });
    return res.status(200).send(newForum);
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function joinForum(req: Request, res: Response) {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res
        .status(404)
        .json(resHandler(req, null, "Forum not found", "00009"));
    }
    if (
      forum?.forumMembers.findIndex((x) => x.toString() === req.user._id) === -1
    ) {
      await Forum.updateOne(
        { _id: forum._id },
        { $push: { forumMembers: req.user._id } }
      );
      res.status(200).json({ message: "you joined in this group" });
    } else {
      await Forum.updateOne(
        { _id: forum?._id },
        { $pull: { forumMembers: req.user._id } }
      );
      return res.json({ message: "you left this group" });
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function upvoteForum(req: Request, res: Response) {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res
        .status(404)
        .json(resHandler(req, null, "Forum not found", "00009"));
    }
    if (
      forum?.downvotes.findIndex((x) => x.toString() === req.user._id) !== -1
    ) {
      await Forum.updateOne(
        { _id: forum._id },
        { $pull: { downvotes: req.user._id } }
      );
      res.json({ message: "you downvoted the post" });
    }
    await Forum.updateOne(
      { _id: forum._id },
      { $addToSet: { upvotes: req.user._id } }
    );
    return res.json({ message: "you upvoted the post" });
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function downvoteForum(req: Request, res: Response) {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res
        .status(404)
        .json(resHandler(req, null, "Forum not found", "00009"));
    }
    if (forum?.upvotes.findIndex((x) => x.toString() === req.user._id) !== -1) {
      await Forum.updateOne(
        { _id: forum._id },
        { $pull: { upvotes: req.user._id } }
      );
    }
    await Forum.updateOne(
      { _id: forum._id },
      { $addToSet: { downvotes: req.user._id } }
    );
    return res.json({ message: "you downvoted the post" });
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function likeForum(req: Request, res: Response) {
  try {
    const forum = await Forum.findById(req.params.id);
    if (forum?.likes.findIndex((x) => x.toString() === req.user._id) === -1) {
      await Forum.updateOne(
        { _id: forum._id },
        { $push: { likes: req.user._id } }
      );
      return res.json({ message: "you liked the post" });
    } else {
      await Forum.updateOne(
        { _id: forum?._id },
        { $pull: { likes: req.user._id } }
      );
      return res.status(200).json({ message: "You disliked this post" });
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function viewForum(req: Request, res: Response) {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res
        .status(404)
        .json(resHandler(req, null, "Forum not found", "00009"));
    }
    if (forum.admin.toString() === req.user._id) {
      await Forum.updateOne({ _id: forum._id }, { $inc: { views: 1 } });
      return res.status(200).json(resHandler(req, forum, "u viewd this forum"));
    }
    return res.status(200).json(resHandler(req, forum, "u viewd this forum"));
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}
// need to add condition like per user per day need to increase the view
async function upvoteForums(req: Request, res: Response) {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res
        .status(404)
        .json(resHandler(req, null, "Forum not found", "00009"));
    }
    if (forum?.upvotes.findIndex((x) => x.toString() === req.user._id) === -1) {
      await Forum.updateOne(
        { _id: forum._id },
        { $push: { upvotes: req.user._id } }
      );
      res.json({ message: "you upvoted the post" });
    } else {
      await Forum.updateOne(
        { _id: forum._id },
        { $push: { downvotes: req.user._id } }
      );
      res.json({ message: "you downvoted the post" });
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}
async function retweet(req: Request, res: Response) {
  try {
    const forum = await Forum.findById(req.params.id);
    if (
      forum?.retweets.findIndex((x) => x.toString() === req.user._id) === -1
    ) {
      await Forum.updateOne(
        { _id: forum._id },
        { $push: { retweets: req.user._id } }
      );
      return res.json({ message: "you retweeted" });
    } else {
      await Forum.updateOne(
        { _id: forum?._id },
        { $pull: { retweets: req.user._id } }
      );
      return res.status(200).json({ message: "You removed ur tweet" });
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function comment(req: Request, res: Response) {
  try {
    const forum = await Forum.findById(req.params.id);
    if (
      forum?.comments.findIndex((x) => x.toString() === req.user._id) === -1
    ) {
      await Forum.updateOne(
        { _id: forum._id },
        { $push: { comments: req.user._id } }
      );
      return res.json({ message: "you commented" });
    } else {
      await Forum.updateOne(
        { _id: forum?._id },
        { $pull: { comments: req.user._id } }
      );
      return res.status(200).json({ message: "You removed ur comment" });
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function getForum(req: Request, res: Response) {
  try {
    const forum = await Forum.findById(req.params.id);
    if (forum?.admin.toString() === req.user._id) {
      await Forum.find({ _id: forum?._id });
      console.log(req.user._id);
      return res.status(200).json({ message: "user post fetched", forum });
    } else {
      return res
        .status(401)
        .json(resHandler(req, null, "Post does not belong to you", "00029"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}
async function updateForum(req: Request, res: Response) {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res
        .status(404)
        .json(resHandler(req, null, "Forum not found", "00009"));
    }
    if (forum?.admin.toString() === req.user._id) {
      await Forum.updateOne({ _id: forum._id }, { $set: req.body });
      res.status(200).json("Forum updated");
    } else {
      return res
        .status(401)
        .json(resHandler(req, null, "Group does not belong to you", "00022"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function deleteForum(req: Request, res: Response) {
  try {
    const forum = await Forum.findById(req.params.id);
    if (!forum) {
      return res
        .status(404)
        .json(resHandler(req, null, "Forum not found", "00009"));
    }
    if (forum?.admin.toString() === req.user._id) {
      await Forum.deleteOne({ _id: forum._id }, { $set: req.body });
      res.status(200).json("Forum Deleted");
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}
// comment aur comment upvoted and downvote kisa karna

export {
  createForum,
  updateForum,
  joinForum,
  upvoteForum,
  downvoteForum,
  likeForum,
  retweet,
  comment,
  getForum,
  upvoteForums,
  deleteForum,
  viewForum,
};
