import mongoose from "mongoose";
import { Env } from "../config";
async function dbConnect() {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(Env.DB_URI);

    console.clear();
    console.log("🚀 Database connected");
  } catch (err: any) {
    console.log(err.message);
    process.exit(1);
  }
}
export default dbConnect;
