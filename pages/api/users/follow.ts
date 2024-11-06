import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import verifySession from "@/server/utils/verifySession";
import { NextApiResponse } from "next";

const followUser = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ message: "Missing payload property" });
    }

    const userId = req.userId;
    const user = await User.findById(req.body.userId);
    const currentUser = await User.findById(userId);

    if (!user.followers.includes(userId)) {
      await user.updateOne({ $push: { followers: userId } });
      await currentUser.updateOne({ $push: { followings: req.body.userId } });
      res.status(200).json({ message: "user has been followed" });
    } else {
      res.status(403).json({ message: "you already follow this user" });
    }
  } catch (err) {
    res.status(500).json({ message: "Interanl Server Error" });
  }
};

const handler = async (req, res) => {
  if (req.method === "PATCH") {
    return await verifySession(req, res, followUser);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
