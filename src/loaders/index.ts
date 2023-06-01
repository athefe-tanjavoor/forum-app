import { type Application } from "express";

import expressLoader from "./express";
import dbConnect from "./mongoose";

export default async (app: Application) => {
  await dbConnect();
  expressLoader(app);
};
