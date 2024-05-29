import { Server } from "socket.io";
import connectDB from "../../server/utils/mongodb";
import Message from "../../server/models/Message";

let users = [];

const addUser = (userId, socketId, io) => {
  users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUserSocketIds = (userId) => {
  const filteredUsers = users.filter((user) => user.userId === userId);
  const socketId = filteredUsers.map((user) => user.socketId);
  return socketId;
};

const getConversation = async (conversation, receiverId) => {
  const lastMessage = await Message.findOne({
    conversationId: conversation._id,
  }).sort({ createdAt: -1 });
  const unreadMessages = await Message.find({
    conversationId: conversation._id,
    read: false,
  }).count();

  const userIdIndex = conversation.members.findIndex((id) => id === receiverId);
  if (userIdIndex === 1) {
    // User is the store ownner so get the details of the buyer
    const user = await User.findById(conversation.members[0]).select([
      "firstname",
      "lastname",
      "storeId",
    ]);
    return {
      id: conversation._id,
      members: conversation.members,
      name: user.firstname + " " + user.lastname,
      lastMessage: lastMessage,
      storeId: user?.storeId,
      createdAt: !lastMessage ? conversation.createdAt : null,
      store: true,
      unreadMessages,
    };
  } else {
    const user = await User.findById(conversation.members[1]).select([
      "firstname",
      "_id",
    ]);
    return {
      id: conversation._id,
      name: user.firstname,
      members: conversation.members,
      lastMessage: lastMessage,
      createdAt: !lastMessage ? conversation.createdAt : null,
      store: false,
      unreadMessages,
    };
  }
};

const SocketHandler = (req, res) => {
  if (!res.socket.server.io) {
    // Initialize socket connection if it's not initialized
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      // when connected
      console.log("a user connected");

      // take userid and socket id from user
      socket.on("addUser", (userId) => {
        addUser(userId, socket.id, io);
        io.emit("getUsers", users);
      });

      socket.on("removeUser", (userId) => {
        users = users.filter((user) => user.userId !== userId);
        io.emit("getUsers", users);
      });

      // send and get message
      socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
        const socketIds = getUserSocketIds(receiverId);
        if (socketIds?.length) {
          // const lastMessage = await Message.findOne({conversationId: conversationId}).sort({createdAt: -1})
          io.to(socketIds).emit("getMessage", {
            senderId,
            text,
          });
        }
      });

      socket.on("readMessages", ({ conversationId, receiverId, count }) => {
        const socketIds = getUserSocketIds(receiverId);
        if (socketIds?.length) {
          io.to(socketIds).emit("updateReadMessages", {
            conversationId,
            count,
          });
        }
      });

      socket.on("startConversation", async ({ conversation, receiverId }) => {
        const socketIds = getUserSocketIds(receiverId);
        if (socketIds?.length) {
          const updatedConversation = await getConversation(
            conversation,
            receiverId
          );
          io.to(socketIds).emit("getConversation", {
            conversation: updatedConversation,
          });
        }
      });

      // when disconnected
      socket.on("disconnect", () => {
        console.log("a user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
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

export default connectDB(SocketHandler);
