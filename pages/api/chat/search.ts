import Conversation from "@/server/models/Conversation";
import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import verifySession from "@/server/utils/verifySession";
import { NextApiRequest, NextApiResponse } from "next";

const searchForChat = async (
  req: CustomNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const userId = req.userId;
    const query = req.query.query;

    const matchedChats = [];
    const morePeople = [];

    console.log("reached");

    if (query) {
      // Search for users that match the query using MongoDB full-text search
      const users = await User.aggregate([
        {
          $search: {
            index: "default",
            compound: {
              should: [
                {
                  autocomplete: {
                    query: query,
                    path: "username",
                    fuzzy: {
                      maxEdits: 2, // Allows for typo tolerance
                      prefixLength: 1,
                    },
                  },
                },
                {
                  text: {
                    query: query,
                    path: "username",
                    fuzzy: {
                      maxEdits: 1, // Enables typo tolerance for full-text search
                    },
                  },
                },
              ],
            },
          },
        },
        { $sort: { score: -1 } },
      ]);

      const conversations = await Conversation.find({
        members: { $in: [userId] },
      });

      users.forEach((user: User) => {
        const existingChat = conversations.find(
          (conversation: ConversationDoc) => {
            const memeber2 = conversation.members.find(
              (member) => member !== userId
            );
            return memeber2 === user._id.toString();
          }
        );

        if (existingChat) {
          matchedChats.push({
            conversationId: existingChat._id,
            user,
          });
        } else {
          if (user._id.toString() !== userId) {
            morePeople.push({ user });
          }
        }
      });
    }

    res.status(200).json({ matchedChats, morePeople });
  } catch (err) {
    console.log(err, "Error occured while searching for chats");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const hanlder = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    await verifySession(req, res, searchForChat);
  } else {
    return res.status(409).json({ message: "Not Allowed" });
  }
};

export default connectDB(hanlder);
