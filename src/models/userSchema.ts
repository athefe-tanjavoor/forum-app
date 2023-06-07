import type {
  Model,
  PassportLocalDocument,
  PassportLocalModel,
  PassportLocalSchema,
  Types,
} from "mongoose";
import { model, Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

// import sessionSchema, { type ISession } from "./common/sessionSchema";

export interface IUser extends PassportLocalDocument {
  username: string;
  phoneNumber: string;
  phoneVerified: boolean;
  email: string;
  emailVerified: boolean;
  profilepicture: string;
  bio: string;
  dob: Date;
  gender?: "MALE" | "FEMALE" | "OTHER";
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  authProviders: Array<"GOOGLE" | "LOCAL">;
  isDeleted: boolean;
  role: Roles;
  status: "ACTIVE" | "BLOCKED" | "DEACTIVATE" | "DELETED";
  // sessions: Types.DocumentArray<ISession>;
  createdAt: Date;
  deletedAt?: Date;
  sms?: {
    code: string;
    expires: Date;
    purpose: OtpPurpose;
  };
}

interface IUserModel extends PassportLocalModel<IUser> {
  isUsernameExists: (username: string) => Promise<boolean>;
  isEmailExists: (email: string) => Promise<boolean>;
  isPhoneExists: (phoneNumber: string) => Promise<boolean>;
}

const userSchema = new Schema(
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
      lowercase: true,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    profilepicture: {
      type: String,
    },
    coverpicture: {
      type: String,
    },
    bio: {
      type: String,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPERADMIN"],
      default: "USER",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED", "DEACTIVATE", "DELETED"],
      default: "ACTIVE",
    },
    // sessions: [sessionSchema],
    sms: {
      code: String,
      expires: Date,
      purpose: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
) as PassportLocalSchema<IUserModel, Model<IUser>>;

userSchema.set("toJSON", {
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

userSchema.static(
  "isEmailExists",
  async function isEmailExists(this: any, email: string): Promise<boolean> {
    const user = await this.findOne({ email });
    return !!user;
  }
);
userSchema.static(
  "isUsernameExists",
  async function isUsernameExists(
    this: any,
    username: string
  ): Promise<boolean> {
    const user = await this.findOne({ username });
    return !!user;
  }
);
userSchema.static(
  "isPhoneExists",
  async function isPhoneExists(
    this: any,
    phoneNumber: string
  ): Promise<boolean> {
    const user = await this.findOne({ phoneNumber });
    return !!user;
  }
);
userSchema.plugin(passportLocalMongoose, {
  usernameQueryFields: ["email", "phoneNumber"],
  maxAttempts: 5,
  unlockInterval: 1000 * 60 * 10,
});
export default model<IUser, IUserModel>("User", userSchema);
