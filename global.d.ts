type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

type User = {
  username: string;
  _id: string;
  role: string;
  coverPicture: { url: string; filename: string };
  profilePicture: { url: string; filename: string };
  bio: string;
  relationship: string;
  followers: Array<string>;
  followings: Array<string>;
};

type UserSchema = Document &
  User & { password: string; isAdmin: boolean; _doc?: any };

type UpdateUser = {
  username?: string;
  coverPicture?: { url: string; filename: string };
  profilePicture?: { url: string; filename: string };
  bio?: string;
};

type ClientSession = {
  status: "loading" | "unauthenticated";
  data: {
    user?: User;
  } | null;
};

type AuthSession = { user: User };

type CustomNextApiRequest = import("next").NextApiRequest & { userId?: string };

type CustomRequestHandler = (
  req: CustomNextApiRequest,
  res: import("next").NextApiResponse
) => Promise<any>;

type PagesNav = {
  rotate?: boolean;
};

type Modal = {
  open: boolean;
  modalLable?: string;
  children: React.ReactNod;
  onClose: () => void;
  customContainer?: string;
  customModal?: string;
  removeCloseIcon?: boolean;
};

type SearchPeople = {
  setSearchModalOpen?: SetState<boolean>;
  customResultsStyle?: string;
  customContainer?: string;
};

type ProfileCard = {
  name: string;
  coverImage: { url: string; filename: string };
  profileImage: { url: string; filename: string };
  bio: string;
  following: number;
  followers: number;
  showProfileBtn?: boolean;
  showViewBtn?: boolean;
  userId?: string;
};

type FollowCard = { pathname?: "followers" | "following" };

type Post = {
  id: string;
  userId: string;
  text: string;
  comments: Array<{ userId: string; text: string }>;
  likes: Array<string>;
  likesCount: number;
  image: { url: string; filename: string };
  createdAt: string;
};

type PostSchema = Document & {
  _id: string;
  userId: string;
  text: string;
  comments: Array<{ userId: string; text: string }>;
  likes: Array<string>;
  likesCount: number;
  image: { url: string; filename: string };
  createdAt: string;
};

type PostData = {
  _id: string;
  desc: string;
  userId: string;
  comments: Array<{ userId: string; text: string }>;
  likes: Array<string>;
  likesCount: number;
  img: { url: string; filename: string };
  createdAt: string;
};

type Share = {
  closeModal?: () => void;
  setNewPosts?: SetState<PostData[]>;
};

type ConversationDoc = {
  members: Array<string>;
  unReadMessagesCount: number;
  createdAt: string;
  updatedAt: string;
  _doc?: any;
};

type ConversationSchema = Document & ConversationDoc;

type SearchForChatsResult = {
  matchedChats: { conversationId: string; user: User }[];
  morePeople: { user: User }[];
};

type ChatSearchResult = {
  result: { conversationId?: string; user: User };
};

type ConversationData = {
  unReadMessagesCount: number;
  _id: string;
  members: Array<string>;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userProfilePic: string;
  latestMessage: MessageDoc;
};

type SocketServer = HTTPServer & {
  io?: IOServer;
};

type SocketWithIO = NetSocket & {
  server: SocketServer;
};

type NextApiResponseWithSocket = NextApiResponse & {
  socket: SocketWithIO;
};

type ChatWindow = {
  conversation: ConversationData;
  socket: import("socket.io-client").Socket | null;
  setCurrentConversationId: SetState<string>;
};

type MessageDoc = {
  _id: string;
  text: string;
  senderId: string;
  seen: boolean;
  conversationId: string;
  updatedAt: string;
  createdAt: string;
  _doc?: any;
};

type MessageSchema = Document &
  Omit<MessageDoc, "senderId"> & { senderId: import("mongoose").ObjectId };

type MessageQueue = Array<
  Omit<MessageDoc, "updatedAt"> & {
    receiverId?: string;
    isError: boolean;
  }
>;
