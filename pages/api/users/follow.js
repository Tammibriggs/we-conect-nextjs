import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import { verifyToken } from "@/server/utils/jwt";

const followUser = async (req, res) => {
  if (!req.body.userId)
    return res
      .status(400)
      .json({ status: "error", message: "Missing payload property" });
  try {
    const user = await User.findById(req.body.userId);
    const currentUser = await User.findById(req.user.id);
    if (!user.followers.includes(req.user.id)) {
      await user.updateOne({ $push: { followers: req.user.id } });
      await currentUser.updateOne({ $push: { followings: req.body.userId } });
      res.status(200).json({ status: "ok", message: "user has been followed" });
    } else {
      res
        .status(403)
        .json({ status: "error", message: "you already follow this user" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

const handler = async (req, res) => {
  if (req.method === "PATCH") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await followUser(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
