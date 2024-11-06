import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { RequestHandler } from "next/dist/server/next";

const connectDB =
  (handler: RequestHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (mongoose.connection.readyState) {
      // Use current db connection
      return handler(req, res);
    }
    await mongoose
      .connect(process.env.MONGO_URL, { family: 4 })
      .catch((err) => console.log(err));

    return handler(req, res);
  };

const connectDbWithoutHanlder = async () => {
  if (mongoose.connection.readyState) {
    return;
  }
  await mongoose
    .connect(process.env.MONGO_URL, { family: 4 })
    .then(() => console.log("connected"))
    .catch((err) => console.log(err));
  return;
};

export { connectDbWithoutHanlder };
export default connectDB;
