import Message from "@/server/models/Message";
import { verifyToken } from "@/server/utils/jwt";
import connectDB from "@/server/utils/mongodb";

const getLastestMessage = async (req, res) => {
  try {
    const message = await Message.findOne(
      { conversationId: req.query.conversationId },
      {},
      { sort: { created_at: -1 } }
    );
    res.status(200).json({ status: "ok", data: message });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4"))
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    return await getLastestMessage(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
