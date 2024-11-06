import Message from "@/server/models/Message";
import connectDB from "@/server/utils/mongodb";
import verifySession from "@/server/utils/verifySession";

const getMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query?.limit as string) || 20;
    const skip = parseInt(req.query?.skip as string) || 0;
    const conversationId = req.query?.conversationId;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalMessages = await Message.countDocuments({ conversationId });

    res.status(200).json({ messages, totalMessages });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    return await verifySession(req, res, getMessages);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
