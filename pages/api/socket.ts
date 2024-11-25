import { Server } from "socket.io";
import connectDB, { connectDbWithoutHanlder } from "../../server/utils/mongodb";
import Message from "../../server/models/Message";
import Conversation from "@/server/models/Conversation";

import { NextApiRequest } from "next";
import { updateChatWithExtraFields } from "./chat/conversations";

let onlineUsers = {};

// const getConversation = async (conversation, receiverId) => {
//   const lastMessage = await Message.findOne({
//     conversationId: conversation._id,
//   }).sort({ createdAt: -1 });

//   const userIdIndex = conversation.members.findIndex((id) => id === receiverId);
//   if (userIdIndex === 1) {
//     // User is the store ownner so get the details of the buyer
//     const user = await User.findById(conversation.members[0]).select([
//       "firstname",
//       "lastname",
//       "storeId",
//     ]);
//     return {
//       id: conversation._id,
//       members: conversation.members,
//       name: user.firstname + " " + user.lastname,
//       lastMessage: lastMessage,
//       storeId: user?.storeId,
//       createdAt: !lastMessage ? conversation.createdAt : null,
//       store: true,
//     };
//   } else {
//     const user = await User.findById(conversation.members[1]).select([
//       "firstname",
//       "_id",
//     ]);
//     return {
//       id: conversation._id,
//       name: user.firstname,
//       members: conversation.members,
//       lastMessage: lastMessage,
//       createdAt: !lastMessage ? conversation.createdAt : null,
//       store: false,
//     };
//   }
// };

const sendMessage = async ({ conversationId, senderId, text }) => {
  try {
    await connectDbWithoutHanlder();

    const lastMessage = await Message.findOne({ conversationId }).sort({
      createdAt: -1,
    });

    if (lastMessage && lastMessage?.senderId?.toString() !== senderId) {
      await Conversation.updateOne(
        { _id: conversationId },
        { unReadMessagesCount: 0 }
      );
      await Message.updateMany({ conversationId, seen: false }, { seen: true });
    }

    const newMessage = await Message.create({
      conversationId,
      senderId,
      text,
    });

    const updatedConversation = await Conversation.findOneAndUpdate(
      { _id: conversationId },
      { $inc: { unReadMessagesCount: 1 } },
      { new: true }
    );

    return {
      isError: false,
      newMessage,
      updatedConversation: updatedConversation._doc,
    };
  } catch (err) {
    console.log(err, "Error occured while sending message");
    return { isError: true, message: "Internal Server Error" };
  }
};

const markMessagesAsSeen = async ({ conversationId, userId }) => {
  try {
    await connectDbWithoutHanlder();
    const latestMessage = await Message.findOne({ conversationId }).sort({
      createdAt: -1,
    });
    let updatedConversation;

    if (latestMessage && latestMessage?.senderId?.toString() !== userId) {
      updatedConversation = await Conversation.findOneAndUpdate(
        { _id: conversationId },
        { unReadMessagesCount: 0 },
        { new: true }
      );
      await Message.updateMany({ conversationId, seen: false }, { seen: true });
    }

    return { isError: false, updatedConversation: updatedConversation?._doc };
  } catch (err) {
    return { isError: true, message: "Internal Server Error" };
  }
};

const SocketHandler = async (
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) => {
  if (!res.socket.server.io) {
    // Initialize socket connection if it's not initialized
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    res.socket.server.io = io;

    io.on("connection", async (socket) => {
      console.log("a user connected");

      socket.on("addUser", (userId) => {
        onlineUsers[userId] = socket.id;
        io.emit("getUsers", onlineUsers);
      });

      socket.on("removeUser", (userId) => {
        delete onlineUsers[userId];
        io.emit("getUsers", onlineUsers);
      });

      // send and get message
      socket.on(
        "sendMessage",
        async ({ conversationId, userId, receiverId, text }) => {
          const { newMessage, updatedConversation } = await sendMessage({
            conversationId,
            senderId: userId,
            text,
          });

          const userSocketId = onlineUsers[userId];
          const receiverSocketId = onlineUsers[receiverId];

          io.to([userSocketId, receiverSocketId]).emit(
            "getMessage",
            newMessage
          );

          const senderChatWithExtraFields = await updateChatWithExtraFields({
            conversation: updatedConversation,
            userId,
          });
          const recieverChatWithExtraFields = await updateChatWithExtraFields({
            conversation: updatedConversation,
            userId: receiverId,
          });

          io.to(userSocketId).emit(
            "updatedConversation",
            senderChatWithExtraFields
          );
          io.to(receiverSocketId).emit(
            "updatedConversation",
            recieverChatWithExtraFields
          );
        }
      );

      socket.on(
        "readMessages",
        async ({ conversationId, userId, receiverId }) => {
          const { isError, updatedConversation } = await markMessagesAsSeen({
            conversationId,
            userId,
          });

          if (!isError) {
            const userSocketId = onlineUsers[userId];
            const receiverSocketId = onlineUsers[receiverId];

            io.to(receiverSocketId).emit("readMessages", conversationId);

            if (updatedConversation) {
              const userChatWithExtraFields = await updateChatWithExtraFields({
                conversation: updatedConversation,
                userId,
              });
              const recieverChatWithExtraFields =
                await updateChatWithExtraFields({
                  conversation: updatedConversation,
                  userId: receiverId,
                });
              io.to(userSocketId).emit(
                "updatedConversation",
                userChatWithExtraFields
              );
              io.to(receiverSocketId).emit(
                "updatedConversation",
                recieverChatWithExtraFields
              );
            }
          }
        }
      );

      socket.on("disconnect", () => {
        const removedDisconnectedUser = Object.entries(onlineUsers).reduce(
          (acc, [key, value]) => {
            if (value !== socket.id) {
              acc[key] = value;
            }
            return acc;
          },
          {}
        );
        onlineUsers = removedDisconnectedUser;
        io.emit("getUsers", onlineUsers);
      });
    });
  } else {
    console.log("Socket is already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default SocketHandler;
