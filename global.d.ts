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
