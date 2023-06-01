import { type Request, type Response } from "express";

import { Forum, User } from "../../../models";
import { resHandler } from "../../../utils";
// import { OTP_PURPOSE } from "../../../utils/constants";
import { sendEmail } from "../../../utils/helpers/email-helper";
import { getToken, getverifyToken, verifyToken } from "../../middleware/common";

// async function createuser(req: Request, res: Response) {
//   const { username, email, password } = req.body;
//   console.log(req.body);
//   try {
//     const user = await User.find({
//       $or: [
//         {
//           email,
//         },
//         {
//           username,
//         },
//       ],
//     });
//     if (!user) {
//       return res.status(400).json({ message: "user doesnt exist" });
//     }
//     // console.log("hi");
//     const newuser = await User.register(
//       new User({
//         username,
//         email,
//       }),

//       password
//     );
//     if (!newuser) {
//       return res
//         .status(401)
//         .json({ message: "account not created successfully" });
//     }
//     const token = getToken({
//       _id: newuser._id,
//       username: newuser.username,
//       email: newuser.email,
//       phoneVerified: newuser.phoneVerified,
//       emailVerified: newuser.emailVerified,
//       createdAt: new Date(),
//       role: newuser.role,
//       phoneNumber: newuser.phoneNumber,
//       isDeleted: false,
//     });
//     return res.status(200).json({ message: "Created", token, newuser });
//   } catch (err: any) {
//     console.log(err);
//     return res.status(400).json({ message: err.message });
//   }
// }

async function createuser(req: Request, res: Response) {
  const { username, email, phoneNumber, password } = req.body;
  try {
    // const user = await User.findOne({
    //   $or: [{ email }, { username }],
    // });
    // if (!user) {
    //   return res
    //     .status(401)
    //     .json(resHandler(req, null, "Account not found", "00036"));
    // }

    if (await User.isEmailExists(email)) {
      return res
        .status(500)
        .json(resHandler(req, null, "Email already exists", "00032"));
    }
    const newuser = await User.register(
      new User({
        username,
        email,
        phoneNumber,
      }),
      password
    );
    if (!newuser) {
      return res
        .status(500)
        .json(resHandler(req, null, "Could not create an account.", "00009"));
    }

    const token = getToken({
      _id: newuser._id,
      username: newuser.username,
      email: newuser.email,
      phoneNumber: newuser.phoneNumber,
      emailVerified: newuser.emailVerified,
      isDeleted: newuser.isDeleted,
      createdAt: new Date(),
      role: newuser.role,
      purpose: "EMAIL_VERIFICATION",
      phoneVerified: newuser.phoneVerified,
    });
    try {
      await sendEmail(newuser.email, "user_verify_email", token);
      return res
        .status(200)
        .json({ message: "Email Verification sent", token });
    } catch (err: any) {
      return res.status(500).json(resHandler(req, null, err.message, "00018"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function loginuser(req: Request, res: Response) {
  try {
    const puser = req.user as any;
    if (!puser) return res.status(400).json({ message: "no pUser" });
    const user = await User.findById(puser?._id as string);
    if (!user) return res.status(400).json({ message: "user not found" });
    const token = getToken({
      _id: puser._id,
      username: puser.username,
      email: puser.email,
      phoneVerified: puser.phoneVerified,
      emailVerified: puser.emailVerified,
      createdAt: new Date(),
      role: puser.role,
      phoneNumber: puser.phoneNumber,
      isDeleted: puser.isDeleted,
    });
    return res
      .status(200)
      .json({ message: "loggedin successfully", token, puser });
  } catch (err: any) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}

// async function logout(req: Request, res: Response) {
//   const { signedCookies = {} } = req;
//   const { refreshToken } = signedCookies;
//   try {
//     if (!refreshToken) {
//       return res
//         .status(401)
//         .json(resHandler(req, null, "Invalid Token", "00012"));
//     }
//     const user = await User.findById(req.user._id).select("session");
//     if (!user) {
//       return res
//         .status(401)
//         .json(resHandler(req, null, "User not found", "00036"));
//     }
//     const tokenIndex = user.sessions.findIndex(
//       (item: any) => item.refreshToken === refreshToken
//     );
//     if (tokenIndex !== -1) {
//       user.sessions.splice(tokenIndex, 1);
//     }
//     await user.save();
//     res.clearCookie("refreshToken", COOKIE_OPTIONS);
//     return res.status(200).json(resHandler(req, null, "Logout success"));
//   } catch (err: any) {
//     return res.status(500).json(resHandler(req, null, err.message, "00008"));
//   }
// }

async function getNewRefreshToken(req: Request, res: Response) {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  if (!refreshToken) {
    return res
      .status(401)
      .json(resHandler(req, null, "Expired Refresh token", "00012"));
  }
}

async function sendEmailVerification(req: Request, res: Response) {
  try {
    // const user = await User.findOne({
    //   _id: req.user._id,
    //   isDeleted: false,
    //   status: "ACTIVE",
    // }).select("emailVerified email username");
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json(resHandler(req, null, "user not found", "00036"));
    console.log(user);
    if (!user) {
      return res
        .status(401)
        .json(resHandler(req, null, "Account not found", "00036"));
    }
    if (!user.email) {
      return res
        .status(401)
        .json(resHandler(req, null, "Email not found", "00036"));
    }
    if (user.emailVerified) {
      return res
        .status(400)
        .json(resHandler(req, null, "Email Already verified", "00088"));
    }
    const token = getverifyToken({
      _id: req.user._id,
      role: req.user.role,
      username: req.user.username,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      emailVerified: req.user.emailVerified,
      phoneVerified: req.user.phoneVerified,
      createdAt: new Date(),
      isDeleted: false,
    });
    try {
      await sendEmail(user.email, "USER_VERIFY_EMAIL", token);
      return res
        .status(200)
        .json({ message: "Email Verification sent", token });
    } catch (err: any) {
      return res
        .status(500)
        .json(resHandler(req, null, err.response.body, "00003"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function verifyEmail(req: Request, res: Response) {
  const token = req.query.token as string;
  const decoded = verifyToken(token);
  if (decoded == null) {
    return res
      .status(401)
      .json(resHandler(req, null, "Invalid Token", "00012"));
  }
  try {
    await User.findByIdAndUpdate(decoded._id, { emailVerified: true });
    return res.status(200).json({ message: "Email Verified" });
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

// async function recoverPassword(req: Request, res: Response) {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(401)
//         .json(resHandler(req, null, "User not found", "00036"));
//     }
//     try {
//       await sendEmail(email, user.role, OTP_PURPOSE.RESET_PASSWORD);
//       return res.status(200).json(resHandler(req, null, "OTP sent"));
//     } catch (err: any) {
//       return res.status(500).json(resHandler(req, null, err.message, "00014"));
//     }
//   } catch (err: any) {
//     return res.status(500).json(resHandler(req, null, err.message, "00008"));
//   }
// }
// async function resetPassword(req: Request, res: Response) {
//   const { token, newPassword } = req.body;
//   try {
//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return res
//         .status(401)
//         .json(resHandler(req, null, "Invalid Token", "00012"));
//     }
//     const user = await User.findOne({ _id: decoded._id });
//     if (!user) {
//       return res
//         .status(401)
//         .json(resHandler(req, null, "User not found", "00036"));
//     }
//     if (decoded.purpose !== OTP_PURPOSE.RESET_PASSWORD) {
//       return res
//         .status(401)
//         .json(resHandler(req, null, "Not a valid purpose", "00008"));
//     }
//     user.setPassword(newPassword);
//     await user.save();
//   } catch (err: any) {
//     return res.status(500).json(resHandler(req, null, err.message, "00008"));
//   }
// }

async function updateUser(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(401)
        .json(resHandler(req, null, "Account not found", "00036"));
    }
    // if (
    //   Object.keys(req.body).includes("isBlocked") &&
    //   req.user.role !== "ADMIN" &&
    //   req.user.role !== "SUPER_ADMIN"
    // ) {
    //   return res.status(401).json({ message: "Forbidden" });
    // }
    if (user?._id.toString() === req.user._id) {
      await User.updateOne({ _id: user._id }, { $set: req.body });
      return res.status(200).json("user account updated");
    } else {
      return res
        .status(401)
        .json(resHandler(req, null, "Account does not belong to you", "00021"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function changePassword(req: Request, res: Response) {
  const { newPassword, oldPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(401)
        .json(resHandler(req, null, "User not found", "00036"));
    }
    user.changePassword(oldPassword, newPassword, (err) => {
      if (err) {
        return res
          .status(422)
          .json(resHandler(req, null, err.message, "00008"));
      }
      return res
        .status(200)
        .json(resHandler(req, null, "Password changed successfully"));
    });
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function deleteUser(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user?._id.toString() === req.user?._id) {
      await User.deleteOne({ _id: user._id });
      res.status(200).json({ message: "user has been deleted" });
    } else {
      return res
        .status(401)
        .json(resHandler(req, null, "Account does not belong to you", "00021"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function followUser(req: Request, res: Response) {
  if (req.user._id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentuser = await User.findById(req.user._id);
      if (
        user?.followers.findIndex((x) => x.toString() === req.user._id) === -1
      ) {
        await user?.updateOne({ $push: { followers: req.user._id } });
        await currentuser?.updateOne({ $push: { following: req.params.id } });
        res.status(200).json({ message: "user has been followed" });
      } else {
        await user?.updateOne({ $pull: { followers: req.user._id } });
        await currentuser?.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json("you unfollowed this user");
      }
    } catch (err: any) {
      return res.status(500).json(resHandler(req, null, err.message, "00008"));
    }
  } else {
    res.status(403).json(resHandler(req, null, "you cant follow u", "00042"));
  }
}
async function deleteUserAccount(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    user.username = `${user?.username}_deleted`;
    user.email = `${user.email}_deleted`;
    user.phoneNumber = `${user.phoneNumber}_deleted`;
    user.status = "DELETED";
    await user.save();
    return res.status(200).json({ message: "Your Account Is Deleted" });
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}
async function deactivateAccount(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user._id.toString() === req.user._id) {
      await User.updateOne(
        { _id: user._id },
        { $set: { status: "DEACTIVATE" } }
      );
      return res.status(200).json({
        message: "Your Account Is Deactivated",
      });
    } else {
      return res
        .status(401)
        .json(resHandler(req, null, "Account does not belong to you", "00021"));
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}

async function savePost(req: Request, res: Response) {
  try {
    console.log("savePost");
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (
      user?.savedPosts.findIndex((x) => x.toString() === req.params.id) === -1
    ) {
      await User?.updateOne({ $push: { savedPosts: req.params.id } });
      res.json({ message: "you saved this post" });
    } else {
      await User.updateOne({ $pull: { savedPosts: req.params.id } });
      return res.status(200).json({ message: "You unsaved this post" });
    }
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}
async function getSavedPost(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user?._id.toString() === req.user._id) {
      await Forum.find({ _id: user._id });
      return res.status(200).json(user);
    }
    return res
      .status(401)
      .json(resHandler(req, null, "Account does not belong to you", "00021"));
  } catch (err: any) {
    return res.status(500).json(resHandler(req, null, err.message, "00008"));
  }
}
// async function verifyEmail(req: Request, res: Response) {
//   const { token } = req.body;

//   try {
//     const decoded = verifyToken(token);
//     if (!decoded?._id) {
//       return res
//         .status(401)
//         .json(resHandler(req, null, "Invalid Token", "00012"));
//     }
//     if (decoded.purpose !== "EMAIL_VERIFICATION") {
//       return res
//         .status(401)
//         .json(resHandler(req, null, "Invalid Token", "00012"));
//     }

//     const s = await User.findByIdAndUpdate(decoded._id, {
//       emailVerified: true,
//     });

//     if (!s) {
//       return res
//         .status(401)
//         .json(resHandler(req, null, "Invalid Token", "00036"));
//     }

//     return res.status(200).json({ message: "Email Verified" });
//   } catch (err: any) {
//     return res.status(500).json(resHandler(req, null, err.message, "00008"));
//   }
// }

export {
  changePassword,
  createuser,
  deactivateAccount,
  deleteUser,
  deleteUserAccount,
  followUser,
  getNewRefreshToken,
  getSavedPost,
  loginuser,
  savePost,
  sendEmailVerification,
  updateUser,
  verifyEmail,
};
