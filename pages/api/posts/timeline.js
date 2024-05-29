import Post from "@/server/models/Post";
import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import { verifyToken } from "@/server/utils/jwt";

const getTimelinePosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const userPosts = await Post.find({ userId: currentUser._id }).sort({
      createdAt: "desc",
    });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId }).sort({ createdAt: "desc" });
      })
    );
    const timelinePosts = userPosts.concat(...friendPosts);
    timelinePosts.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).json({ status: "ok", data: timelinePosts });
  } catch (err) {
    res.status(500).json({ status: "error", error: "an error occured" });
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await getTimelinePosts(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
