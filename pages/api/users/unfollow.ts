import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import verifySession from "@/server/utils/verifySession";

const unFollowUser = async (
  req: CustomNextApiRequest,
  res: NextApiResponse
) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ message: "Missing payload property" });
    }
    const userId = req.userId;
    const user = await User.findById(req.body.userId);
    const currentUser = await User.findById(userId);
    if (user.followers.includes(userId)) {
      await user.updateOne({ $pull: { followers: userId } });
      await currentUser.updateOne({ $pull: { followings: req.body.userId } });
      res.status(200).json({ message: "user has been unfollowed" });
    } else {
      res.status(403).json({ message: "you don't follow this user" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PATCH") {
    return await verifySession(req, res, unFollowUser);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
