import Post from "@/server/models/Post";
import connectDB from "@/server/utils/mongodb";
import verifySession from "@/server/utils/verifySession";
import { NextApiRequest, NextApiResponse } from "next";

const deletePost = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    const userId = req.userId;
    const post = await Post.findById(req.query.postId);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json({ message: "ok" });
    } else {
      res.status(403).json({ message: "you can delete only your post" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPost = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    const post = await Post.findById(req.query.postId);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    return await verifySession(req, res, deletePost);
  } else if (req.method === "GET") {
    return await verifySession(req, res, getPost);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
