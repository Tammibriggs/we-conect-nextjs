import connectDB from "@/server/utils/mongodb";
import Conversation from "@/server/models/Conversation";
import verifySession from "@/server/utils/verifySession";
import { NextApiRequest, NextApiResponse } from "next";
import User from "@/server/models/User";
import Message from "@/server/models/Message";

const newConversations = async (
  req: CustomNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const userId = req.userId;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(422).json({
        message: "The recieverId must be included in the request body",
      });
    }

    const conversation = await Conversation.findOne({
      members: { $in: [userId, receiverId] },
    });

    if (conversation) return res.status(200).json(conversation);

    const newConversation = Conversation.create({
      members: [userId, receiverId],
    });
    res.status(200).json(newConversation);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateChatWithExtraFields = async ({ conversation, userId }) => {
  try {
    const latestMessage = await Message.findOne({
      conversationId: conversation._id,
    }).sort({ createdAt: -1 });
    const memeber2 = conversation.members.find(
      (member: string) => member !== userId
    );
    const user = await User.findById(memeber2);
    const updatedChatWithExtraFields = { ...conversation };

    updatedChatWithExtraFields.userName = user.username;
    updatedChatWithExtraFields.userProfilePic = user.profilePicture.url;
    updatedChatWithExtraFields.latestMessage = latestMessage;

    return updatedChatWithExtraFields;
  } catch (err) {
    return {};
  }
};

const getConversations = async (
  req: CustomNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    }).sort({ updatedAt: -1 });

    const updateConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const updatedChatWithExtraFields = await updateChatWithExtraFields({
          conversation: conversation._doc,
          userId,
        });
        return updatedChatWithExtraFields;
      })
    );

    res.status(200).json(updateConversations);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return await verifySession(req, res, newConversations);
  } else if (req.method === "GET") {
    return await verifySession(req, res, getConversations);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
export { updateChatWithExtraFields };
