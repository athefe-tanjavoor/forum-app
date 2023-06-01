import { type Types } from "mongoose";
import mongoose, { model, Schema } from "mongoose";

export interface IForum extends mongoose.Document {
  admin: Types.ObjectId;
  ForumName: string;
  description: string;
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
  saveForum: Types.ObjectId[];
  location: string;
  ForumRules: string;
  isPrivate: boolean;
  created_at: Date;
  updated_at: Date;
}

const forumSchema = new Schema<IForum>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ForumName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000,
    },
    category: {
      type: String,
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
        ref: "User",
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
    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    forumMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
        ref: "Forum",
      },
    ],
    location: {
      type: String,
    },
    ForumRules: {
      type: String,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IForum>("Forum", forumSchema);
