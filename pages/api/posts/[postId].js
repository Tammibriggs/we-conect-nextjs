import Post from "@/server/models/Post";
import connectDB from "@/server/utils/mongodb";
import { verifyToken } from "@/server/utils/jwt";

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.query.postId);
    if (post.userId === req.user.id) {
      await post.deleteOne();
      res.status(200).json({ status: "ok" });
    } else {
      res
        .status(403)
        .json({ status: "error", message: "you can delete only your post" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const likeNdislike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({ status: "ok" });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({ status: "ok" });
      url;
    }
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.query.postId);
    res.status(200).json({ status: "ok", data: post });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

const handler = async (req, res) => {
  if (req.method === "DELETE") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await deletePost(req, res);
  } else if (req.method === "PATCH") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await likeNdislike(req, res);
  } else if (req.method === "GET") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await getPost(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
