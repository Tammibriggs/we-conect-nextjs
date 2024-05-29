import connectDB from "@/server/utils/mongodb";
import { verifyToken } from "@/server/utils/jwt";
import Conversation from "@/server/models/Conversation";

const newConversations = async (req, res) => {
  if (!req.body.senderId || !req.body.receiverId) {
    return res.status(403).json({
      status: "error",
      message:
        "the senderId and recieverId must be included in the request body",
    });
  }

  if (
    req.body.senderId !== req.user.id &&
    req.body.receiverId !== req.user.id
  ) {
    return res.status(403).json({
      status: "error",
      message: "you must be included in this conversation",
    });
  }

  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const conversation = await Conversation.findOne({
      members: { $in: [req.user.id] },
    });
    if (conversation)
      return res.status(200).json({ status: "ok", data: conversation });
    const savedConversation = await newConversation.save();
    res.status(200).json({ status: "ok", data: savedConversation });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.user.id] },
    });
    res.status(200).json({ status: "ok", data: conversation });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    const tokenRes = verifyToken(req);
    if (tokenRes.status.toString().includes("4"))
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    return await newConversations(req, res);
  } else if (req.method === "GET") {
    const tokenRes = verifyToken(req);
    if (tokenRes.status.toString().includes("4"))
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    return await getConversation(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
