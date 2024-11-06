import connectDB from "@/server/utils/mongodb";
import Conversation from "@/server/models/Conversation";
import verifySession from "@/server/utils/verifySession";
import { NextApiRequest, NextApiResponse } from "next";

const newConversations = async (
  req: CustomNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const userId = req.userId;
    if (!req.body.senderId || !req.body.receiverId) {
      return res.status(422).json({
        message:
          "the senderId and recieverId must be included in the request body",
      });
    }

    if (req.body.senderId !== userId && req.body.receiverId !== userId) {
      return res.status(403).json({
        message: "you must be included in this conversation",
      });
    }

    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    const conversation = await Conversation.findOne({
      members: { $in: [userId] },
    });
    if (conversation) return res.status(200).json({ data: conversation });
    const savedConversation = await newConversation.save();
    res.status(200).json({ data: savedConversation });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getConversation = async (
  req: CustomNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const userId = req.userId;
    const conversation = await Conversation.find({
      members: { $in: [userId] },
    });
    res.status(200).json({ data: conversation });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return await verifySession(req, res, newConversations);
  } else if (req.method === "GET") {
    return await verifySession(req, res, getConversation);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
