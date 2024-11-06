import { useEffect, useState } from "react";
import style from "../styles/message.module.css";
import { EmailOutlined, Search } from "@mui/icons-material";
import Chat from "./Chat";
import {
  useCreateConversationMutation,
  useGetConversationsQuery,
} from "../redux/services/messaging";
import {
  useLazyGetUserByIdQuery,
  useLazySearchPeopleQuery,
} from "../redux/services/user";
import { socket } from "@/utils/socket";
import { useSession } from "next-auth/react";

export default function Message() {
  const { data: sessionData } = useSession() as ClientSession;
  const user = sessionData?.user;

  const [search, setSearch] = useState(false);
  const [oldController, setOldController] = useState();
  const [currentController, setCurrentController] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [conversationMembers, setConversationMembers] = useState([]);
  const [conversationMember, setConversationMember] = useState({});
  const [onlineUsers, setOnlineUser] = useState([]);
  const [query, setQuery] = useState("");

  const { data: conversations } = useGetConversationsQuery(null);
  const [createConversation] = useCreateConversationMutation();
  const [getUser] = useLazyGetUserByIdQuery();
  const [searchPeople] = useLazySearchPeopleQuery();

  useEffect(() => {
    if (socket?.connected && user) {
      socket?.emit("addUser", user._id);
      socket?.on("getUsers", (users: User[]) => {
        setOnlineUser(users);
      });
    }
    return () => {
      socket?.off("getUsers", (users: User[]) => {
        setOnlineUser(users);
      });
    };
  }, [sessionData, user]);

  useEffect(() => {
    if (currentController) {
      setOldController(currentController);
    }
  }, [currentController]);

  const isOnline = (user) => {
    return onlineUsers.find((onlineUser) => onlineUser.userId === user._id);
  };

  // get user data of the other member of the conversation
  useEffect(() => {
    if (conversations?.data.length) {
      (async () => {
        const conversationMembers = await Promise.all(
          conversations.data.map(async (conversation) => {
            const friendId = conversation.members.find(
              (id) => id !== sessionData?.user._id
            );
            const friendData = await getUser({ id: friendId });
            if (friendData.error) return null;
            let modFriendData = {
              ...friendData.data.data,
              conversationId: conversation._id,
            };
            return modFriendData;
          })
        );
        if (!conversationMembers.includes(null)) {
          setSearchResults([...conversationMembers]);
          setConversationMembers(conversationMembers);
        }
      })();
    }
  }, [conversations, getUser, sessionData]);

  useEffect(() => {
    if (!query.length) setSearchResults([...conversationMembers]);

    const timer = setTimeout(() => {
      if (query.length) handleSearch();
    }, 1000);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async () => {
    const res = await searchPeople(query);

    if (res.data?.data) {
      const removedCurrentUser = res.data.data.filter(
        (result) => result._id !== sessionData.user._id
      ); // remove authenticated user from search results
      const filteredConversationMembers = conversationMembers.filter((member) =>
        member.username
          .trim()
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      ); // filter members using search value

      if (conversationMembers.length) {
        const removeDuplicates = removedCurrentUser.filter((user) => {
          const d = filteredConversationMembers.filter(
            (member) => member._id === user._id
          );
          if (d.length) return false;
          else return true;
        });
        return setSearchResults([
          ...filteredConversationMembers,
          ...removeDuplicates,
        ]);
      }
      setSearchResults(removedCurrentUser);
    }
  };

  const startConversation = async (user) => {
    if (user.conversationId) {
      setConversationMember(user);
    } else {
      const conversationRes = await createConversation({
        senderId: sessionData.user._id,
        receiverId: user._id,
      });
      if (conversationRes?.error) return null;
      setConversationMember({
        ...user,
        conversationId: conversationRes.data.data._id,
      });
    }
  };

  return (
    <div className={style.message__cont}>
      <div className={style.message}>
        {!search && !conversations?.data.length && (
          <div className={style.message__noMessage}>
            <h3>Messages</h3>
            <img src="/assets/taking.jpg" alt="taliking" />
            <button className="button" onClick={() => setSearch(true)}>
              Start a Conversation
            </button>
          </div>
        )}
        {(search || !!conversations?.data.length) &&
          !Object.keys(conversationMember).length && (
            <div className={style.message__searchContainer}>
              <div className="noButton__search bg-slate-500">
                <Search />
                <input placeholder="Find a chat pal" onChange={handleSearch} />
              </div>
              <div className={style.message__searchResult}>
                {searchResults.map((user) => {
                  return (
                    <div
                      className={style.message__searchPal}
                      onClick={() => startConversation(user)}
                      key={user._id}
                    >
                      <div>
                        <div className="relative">
                          <img
                            src={
                              user.profilePicture?.url
                                ? user.profilePicture?.url
                                : `/assets/noProfile.jpg`
                            }
                            alt="profile"
                            className={style.message__searchPalImage}
                          />
                          {isOnline(user) && (
                            <span
                              className={style.message__searchPalOnline}
                            ></span>
                          )}
                        </div>
                        <div className={style.message__searchPalInfo}>
                          <span className="truncate">{user.username}</span>
                          {user.bio && <span>{user.bio}</span>}
                        </div>
                      </div>
                      <span>
                        <EmailOutlined />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {!!Object.keys(conversationMember).length && (
          <Chat
            setConversationMember={setConversationMember}
            conversationMember={conversationMember}
            currentUser={sessionData.user}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
}
