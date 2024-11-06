import Message from "@/server/models/Message";
import connectDB from "@/server/utils/mongodb";
import verifySession from "@/server/utils/verifySession";

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.query.conversationId,
    });
    res.status(200).json({ data: messages });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    return await verifySession(req, res, getAllMessages);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
