import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import { verifyToken } from "@/server/utils/jwt";

const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const followers = await Promise.all(
      user.followers.map(async (id) => {
        const follower = await User.findById(id);
        const following = follower.followers.includes(req.user.id); // check if following this user
        return {
          id: follower._id,
          username: follower.username,
          image: follower.profilePicture,
          following,
        };
      })
    );
    res.status(200).json({ status: "ok", data: followers });
  } catch (err) {
    res
      .status(500)
      .json({ status: "error", message: "unable to get followers" });
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await getFollowers(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
