import Post from "@/server/models/Post";
import connectDB from "@/server/utils/mongodb";
import verifySession from "@/server/utils/verifySession";
import { NextApiRequest, NextApiResponse } from "next";

const likeNdislike = async (
  req: CustomNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const userId = req.userId;
    const post = await Post.findById(req.query.postId);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
    }
    res.status(200).json({ message: "ok" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PATCH") {
    return await verifySession(req, res, likeNdislike);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
