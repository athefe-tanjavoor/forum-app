import { type Request, type Response } from "express";
import { Post } from "../../../models";
import { resHandler } from "../../../utils";

async function createPost(req: Request, res: Response) {
  try {
    const newPost = await Post.create({
      admin: req.user._id,
      ...req.body,
    });
    return res.status(200).send(newPost);
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

// async function joinForum(req: Request, res: Response) {
//   try {
//     const forum = await Forum.findById(req.params.id);
//     if (!forum) {
//       return res
//         .status(404)
//         .json(resHandler(req, null, "Forum not found", "00009"));
//     }
//     if (
//       forum?.forumMembers.findIndex((x) => x.toString() === req.user._id) === -1
//     ) {
//       await Forum.updateOne(
//         { _id: forum._id },
//         { $push: { forumMembers: req.user._id } }
//       );
//       res.status(200).json({ message: "you joined in this group" });
//     } else {
//       await Forum.updateOne(
//         { _id: forum?._id },
//         { $pull: { forumMembers: req.user._id } }
//       );
//       return res.json({ message: "you left this group" });
//     }
//   } catch (err: any) {
//     return res.status(500).json(resHandler(req, null, err.message, "00008"));
//   }
// }

// async function upvoteForum(req: Request, res: Response) {
//   try {
//     const forum = await Forum.findById(req.params.id);
//     if (!forum) {
//       return res
//         .status(404)
//         .json(resHandler(req, null, "Forum not found", "00009"));
//     }
//     if (
//       forum?.downvotes.findIndex((x) => x.toString() === req.user._id) !== -1
//     ) {
//       await Forum.updateOne(
//         { _id: forum._id },
//         { $pull: { downvotes: req.user._id } }
//       );
//       res.json({ message: "you downvoted the post" });
//     }
//     await Forum.updateOne(
//       { _id: forum._id },
//       { $addToSet: { upvotes: req.user._id } }
//     );
//     return res.json({ message: "you upvoted the post" });
//   } catch (err: any) {
//     return res.status(500).json(resHandler(req, null, err.message, "00008"));
//   }
// }

// async function downvoteForum(req: Request, res: Response) {
//   try {
//     const forum = await Forum.findById(req.params.id);
//     if (!forum) {
//       return res
//         .status(404)
//         .json(resHandler(req, null, "Forum not found", "00009"));
//     }
//     if (forum?.upvotes.findIndex((x) => x.toString() === req.user._id) !== -1) {
//       await Forum.updateOne(
//         { _id: forum._id },
//         { $pull: { upvotes: req.user._id } }
//       );
//     }
//     await Forum.updateOne(
//       { _id: forum._id },
//       { $addToSet: { downvotes: req.user._id } }
//     );
//     return res.json({ message: "you downvoted the post" });
//   } catch (err: any) {
//     return res.status(500).json(resHandler(req, null, err.message, "00008"));
//   }
// }

async function likePost(req: Request, res: Response) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json(resHandler(req, null, "post does not exist", "00039"));
    }
    if (post?.likes.findIndex((x) => x.toString() === req.user._id) === -1) {
      await Post.updateOne(
        { _id: post._id },
        { $push: { likes: req.user._id } }
      );
      return res.json({ message: "you liked the post" });
    } else {
      await Post.updateOne(
        { _id: post?._id },
        { $pull: { likes: req.user._id } }
      );
      return res.status(200).json({ message: "You disliked this post" });
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function viewPost(req: Request, res: Response) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json(resHandler(req, null, "post does not exist", "00039"));
    }
    if (post.views.findIndex((x) => x.toString() === req.user._id) === -1) {
      await Post.updateOne(
        { _id: post._id },
        { $addToSet: { views: req.user._id } }
      );
      res.status(200).json("u viewed");
    } else {
      res.status(200).json("u already viewed");
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}
// need to add condition like per user per day need to increase the view
// async function upvoteForums(req: Request, res: Response) {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) {
//       return res
//         .status(404)
//         .json(resHandler(req, null, "Forum not found", "00009"));
//     }
//     if (post?.upvotes.findIndex((x) => x.toString() === req.user._id) === -1) {
//       await Post.updateOne(
//         { _id: post._id },
//         { $push: { upvotes: req.user._id } }
//       );
//       res.json({ message: "you upvoted the post" });
//     } else {
//       await Post.updateOne(
//         { _id: post._id },
//         { $push: { downvotes: req.user._id } }
//       );
//       res.json({ message: "you downvoted the post" });
//     }
//   } catch (err: any) {
//     return res.status(500).json(resHandler(req, null, err.message, "00008"));
//   }
// }
async function rePost(req: Request, res: Response) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json(resHandler(req, null, "post does not exist", "00039"));
    }
    if (post?.retweets.findIndex((x) => x.toString() === req.user._id) === -1) {
      await Post.updateOne(
        { _id: post._id },
        { $push: { retweets: req.user._id } }
      );
      return res.json({ message: "you retweeted", post });
    } else {
      await Post.updateOne(
        { _id: post?._id },
        { $pull: { retweets: req.user._id } }
      );
      return res.status(200).json({ message: "You removed ur tweet" });
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

// async function comment(req: Request, res: Response) {
//   try {
//     const post = await Forum.findById(req.params.id);
//     if (
//       forum?.comments.findIndex((x) => x.toString() === req.user._id) === -1
//     ) {
//       await Forum.updateOne(
//         { _id: forum._id },
//         { $push: { comments: req.user._id } }
//       );
//       return res.json({ message: "you commented" });
//     } else {
//       await Forum.updateOne(
//         { _id: forum?._id },
//         { $pull: { comments: req.user._id } }
//       );
//       return res.status(200).json({ message: "You removed ur comment" });
//     }
//   } catch (err: any) {
//     return res.status(500).json(resHandler(req, null, err.message, "00008"));
//   }
// }

async function getPost(req: Request, res: Response) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json(resHandler(req, null, "post does not exist", "00039"));
    }
    if (post?.admin.toString() === req.user._id) {
      await Post.find({ _id: post?._id });
      console.log(req.user._id);
      return res.status(200).json({ message: "user post fetched", post });
    } else {
      return res
        .status(401)
        .json(resHandler(req, null, "Post does not belong to you", "00029"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function updatePost(req: Request, res: Response) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json(resHandler(req, null, "post does not exist", "00039"));
    }
    if (post?.admin.toString() === req.user._id) {
      await Post.updateOne({ _id: post._id }, { $set: req.body });
      res.status(200).json("post updated");
    } else {
      return res
        .status(401)
        .json(resHandler(req, null, "post does not belong to you", "00029"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function deletePost(req: Request, res: Response) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json(resHandler(req, null, "post does not exist", "00039"));
    }
    if (post?.admin.toString() === req.user._id) {
      await Post.deleteOne({ _id: post._id }, { $set: req.body });
      res.status(200).json({ message: "Forum Deleted" });
    } else {
      return res
        .status(401)
        .json(resHandler(req, null, "post does not belong to you", "00029"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}
// comment aur comment upvoted and downvote kisa karna

export {
  createPost,
  updatePost,
  deletePost,
  getPost,
  rePost,
  viewPost,
  likePost,
};
