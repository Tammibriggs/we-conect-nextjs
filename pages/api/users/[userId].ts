import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const getUserByParam = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await User.findById(req.query.userId).select([
      "-isAdmin",
      "-password",
    ]);
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json({ data: other });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return await getUserByParam(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
