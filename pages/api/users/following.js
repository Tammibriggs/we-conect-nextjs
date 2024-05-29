import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import { verifyToken } from "@/server/utils/jwt";

const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const following = await Promise.all(
      user.followings.map(async (id) => {
        const follow = await User.findById(id);
        return {
          id: follow._id,
          username: follow.username,
          image: follow.profilePicture,
        };
      })
    );
    res.status(200).json({ status: "ok", data: following });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "unable to get following" });
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await getFollowing(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
