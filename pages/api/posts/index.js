import connectDB from "@/server/utils/mongodb";
import Post from "@/server/models/Post";
import { verifyToken } from "@/server/utils/jwt";

const createPost = async (req, res) => {
  if (!req.body.userId)
    return res.status(403).json({
      status: "error",
      message: "user id is required",
    });
  if (
    typeof req.body.img === "object" &&
    Object.keys(req.body.img).length !== 0 &&
    (!req.body.img.hasOwnProperty("url") ||
      !req.body.img.hasOwnProperty("filename"))
  ) {
    return res.status(403).json({
      status: "error",
      message:
        "img propery most be an object type: {url: <string>, filename: <string>}",
    });
  }
  if (req.user.id !== req.body.userId) {
    return res
      .status(403)
      .json({ status: "error", message: "you can only post to your account" });
  }
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json({ status: "ok", data: savedPost });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.user.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json({ status: "ok" });
    } else {
      res
        .status(403)
        .json({ status: "error", message: "you can update only your post" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getPosts = async (req, res) => {
  const userId = req.user.id;
  try {
    const userPosts = await Post.find({ userId }).sort({ createdAt: "desc" });
    res.status(200).json({ status: "ok", data: userPosts });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await createPost(req, res);
  } else if (req.method === "PUT") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await updatePost(req, res);
  } else if (req.method === "GET") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await getPosts(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
