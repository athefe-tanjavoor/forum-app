import type { Request, Response } from "express";

import { Admin } from "../../../models";
import { resHandler } from "../../../utils";
import { getToken } from "../../middleware/common";

async function createAdmin(req: Request, res: Response) {
  const { firstname, username, DateOfBirth, mobileNumber, email, password } =
    req.body;
  console.log(req.body);
  try {
    console.log("0");
    const admin = await Admin.find({
      $or: [
        {
          email,
        },
        {
          username,
        },
      ],
    });
    if (!admin) {
      return res.status(400).json({ message: "email doesnt exist" });
    }
    // console.log("1");
    const newadmin = await Admin.register(
      new Admin({
        firstname,
        username,
        DateOfBirth,
        mobileNumber,
        email,
      }),
      password
    );
    // console.log("2");
    if (!newadmin) {
      return res
        .status(401)
        .json({ message: "account not created successfully" });
    }
    // console.log("3");
    const token = getToken({
      _id: newadmin._id,
      username: newadmin.username,
      email: newadmin.email,
      phoneVerified: newadmin.phoneVerified,
      emailVerified: newadmin.emailVerified,
      isDeleted: false,
      createdAt: new Date(),
      role: newadmin.role,
      phoneNumber: newadmin.phoneNumber,
    });
    // console.log(token);
    return res.status(200).json({ message: "Created", token, newadmin });
  } catch (err: any) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}

async function loginAdmin(req: Request, res: Response) {
  try {
    const pAdmin = req.user as any;
    if (!pAdmin) return res.status(400).json({ message: "err.message" });

    const admin = await Admin.findById(pAdmin?._id as string);
    if (!admin) return res.status(400).json({ message: "user not found" });

    const token = getToken({
      _id: admin._id,
      email: admin.email,
      username: admin.username,
      emailVerified: admin.emailVerified,
      createdAt: new Date(),
      phoneNumber: admin.phoneNumber,
      role: admin.role,
      phoneVerified: admin.phoneVerified,
      isDeleted: false,
    });
    return res
      .status(200)
      .json({ message: "loggedin successfully", token, pAdmin });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

async function updateAdmin(req: Request, res: Response) {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!Admin) {
      return res.status(404).json({ message: "user not found" });
    }
    if (admin?._id.toString() === req.user._id) {
      await Admin.updateOne({ _id: admin._id }, { $set: req.body });
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

async function deleteAdmin(req: Request, res: Response) {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!Admin) {
      return res.status(404).json({ message: "user not found" });
    }
    if (admin?._id.toString() === req.user?._id) {
      await Admin.deleteOne({ _id: admin._id });
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

export { createAdmin, deleteAdmin, loginAdmin, updateAdmin };
