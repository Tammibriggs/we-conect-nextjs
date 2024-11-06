import Message from "@/server/models/Message";
import connectDB from "@/server/utils/mongodb";
import verifySession from "@/server/utils/verifySession";
import { NextApiRequest, NextApiResponse } from "next";

const addMessage = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json({ data: savedMessage });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return await verifySession(req, res, addMessage);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
