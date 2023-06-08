import { type Types } from "mongoose";
import type mongoose from "mongoose";
import { model, Schema } from "mongoose";

interface IReport extends mongoose.Document {
  user: Types.ObjectId;
  report: string;
  reportType: "User" | "Post" | "Comment" | "Forum";
  reportID: Types.ObjectId;
}

const reportSchema = new Schema<IReport>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    report: {
      type: String,
      required: true,
    },
    reportType: {
      type: String,
      required: true,
      enum: ["User", "Post", "Comment", "Forum"],
    },
    reportID: {
      type: Schema.Types.ObjectId,
      refPath: "reportType",
    },
  },
  { timestamps: true }
);

export default model<IReport>("Report", reportSchema);
