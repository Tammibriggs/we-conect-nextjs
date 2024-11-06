import Message from "@/server/models/Message";
import connectDB from "@/server/utils/mongodb";
import verifySession from "@/server/utils/verifySession";

const getLastestMessage = async (req, res) => {
  try {
    const message = await Message.findOne(
      { conversationId: req.query.conversationId },
      {},
      { sort: { created_at: -1 } }
    );
    res.status(200).json({ data: message });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    return await verifySession(req, res, getLastestMessage);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
