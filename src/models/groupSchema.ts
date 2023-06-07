import { type Types } from "mongoose";
import type mongoose from "mongoose";
import { model, Schema } from "mongoose";

interface IGroup extends mongoose.Document {
  admin: Types.ObjectId;
  groupName: string;
  groupDescription: string;
  groupType: "Company" | "College" | "personal";
  groupPic: string;
  groupMembers: Types.ObjectId[];
  message: Types.ObjectId[];
  groupID: Types.ObjectId;
  isPrivate: boolean;
}

const groupSchema = new Schema<IGroup>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    groupDescription: {
      type: String,
    },
    groupType: {
      type: String,
      enum: ["Company", "College", "personal"],
      required: true,
    },
    groupPic: {
      type: String,
    },
    groupMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    message: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
        required: true,
      },
    ],
    groupID: {
      type: Schema.Types.ObjectId,
      ref: "_id",
      // required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default model<IGroup>("Group", groupSchema);
