import Message from "@/server/models/Message";
import { verifyToken } from "@/server/utils/jwt";
import connectDB from "@/server/utils/mongodb";

const addMessage = async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json({ status: "ok", data: savedMessage });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4"))
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    return await addMessage(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
