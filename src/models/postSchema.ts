import { type Types } from "mongoose";
import mongoose, { model, Schema } from "mongoose";

export interface IPost extends mongoose.Document {
  admin: Types.ObjectId;
  ForumName: string;
  content: string;
  category:
    | "EDUCATION"
    | "TECHNOLOGY"
    | "TRAVELS"
    | "FOOD"
    | "FASHION"
    | "POLITICS";
  image: Types.ObjectId;
  video: Types.ObjectId;
  Gif: Types.ObjectId;
  comments: Types.ObjectId[];
  likes: Types.ObjectId[];
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  forumMembers: Types.ObjectId[];
  retweets: Types.ObjectId[];
  views: Types.ObjectId[];
  saveForum: Types.ObjectId[];
  location: string;
  ForumRules: string;
  created_at: Date;
  updated_at: Date;
}

const postSchema = new Schema<IPost>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "EDUCATION",
        "TECHNOLOGY",
        "TRAVELS",
        "FOOD",
        "FASHION",
        "POLITICS",
      ],
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
    video: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    Gif: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    retweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    saveForum: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<IPost>("Post", postSchema);
