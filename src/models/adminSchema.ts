import mongoose, { model, type PassportLocalDocument } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IAdmin extends PassportLocalDocument {
  username: string;
  phoneNumber: string;
  phoneVerified: boolean;
  email: string;
  emailVerified: boolean;
  role: Roles;
  createdAt: Date;
  deletedAt?: Date;
  sms?: {
    code: string;
    expires: Date;
    purpose: OtpPurpose;
  };
}

const AdminSchema = new mongoose.Schema<IAdmin>(
  {
    username: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "ADMIN",
    },
    sms: {
      code: String,
      expires: Date,
      purpose: String,
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.set("toJSON", {
  transform(_, ret) {
    delete ret.sessions;
    delete ret.salt;
    delete ret.hash;
    delete ret.sms;
    delete ret.isDeleted;
    delete ret.deletedAt;
    return ret;
  },
});

AdminSchema.plugin(passportLocalMongoose, {
  usernameQueryFields: ["email", "phoneNumber"],
  maxAttempts: 5,
  unlockInterval: 1000 * 60 * 10,
});
export default model<IAdmin>("Admin", AdminSchema);
