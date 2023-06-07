import { type Types } from "mongoose";
import type mongoose from "mongoose";
import { model, Schema } from "mongoose";

export interface IComment extends mongoose.Document {
  admin: Types.ObjectId;
  comment: string;
  reply: string;
  upVotes: Types.ObjectId[];
  downVotes: Types.ObjectId[];
}

const commentSchema = new Schema<IComment>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      required: true,
    },
    upVotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downVotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default model<IComment>("Comment", commentSchema);
