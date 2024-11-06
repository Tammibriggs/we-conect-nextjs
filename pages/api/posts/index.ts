import connectDB from "@/server/utils/mongodb";
import Post from "@/server/models/Post";
import verifySession from "@/server/utils/verifySession";
import { NextApiRequest, NextApiResponse } from "next";
import { createPostSchema } from "@/server/utils/yupSchemas";

const createPost = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    const userId = req.userId;
    await createPostSchema.validate(req.body);
    const newPost = new Post({ userId, ...req.body });
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.log(err, "Error occured while creating post");
    res.status(500).json({ messsage: "Internal Server Error" });
  }
};

const updatePost = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    const userId = req.userId;
    const post = await Post.findById(userId);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json({ message: "ok" });
    } else {
      res.status(403).json({ message: "you can update only your post" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPosts = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  const userId = req.query.userId;
  try {
    const userPosts = await Post.find({ userId }).sort({ createdAt: "desc" });
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return await verifySession(req, res, createPost);
  } else if (req.method === "PUT") {
    return await verifySession(req, res, updatePost);
  } else if (req.method === "GET") {
    return await verifySession(req, res, getPosts);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
