import { useEffect, useState } from "react";
import style from "../styles/chatContainer.module.css";
import Chat from "./ChatWindow";
import {
  useCreateConversationMutation,
  useGetConversationsQuery,
  useLazySearchForChatQuery,
} from "../redux/services/messaging";
import { socket } from "@/utils/socket";
import { useSession } from "next-auth/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import ChatSearchResult from "./ChatSearchResult";
import Image from "next/image";
import Conversation from "./Conversation";

export default function ChatContainer() {
  const { data: sessionData } = useSession() as ClientSession;
  const user = sessionData?.user;

  const [searchResults, setSearchResults] = useState<SearchForChatsResult>();
  const [conversationMember, setConversationMember] = useState({});
  const [onlineUsers, setOnlineUser] = useState([]);
  const [query, setQuery] = useState("");

  const [searchForChat] = useLazySearchForChatQuery();
  const { data: conversations, isLoading: conversationsIsLoding } =
    useGetConversationsQuery(null);
  const [createConversation] = useCreateConversationMutation();

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

  const isOnline = (user) => {
    return onlineUsers.find((onlineUser) => onlineUser.userId === user._id);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 1000);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async () => {
    const res = await searchForChat(query);
    if (res.data) {
      setSearchResults(res.data);
    }
  };

  const startConversation = async (user) => {
    if (user.conversationId) {
      setConversationMember(user);
    } else {
      const conversationRes = await createConversation({
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
    <div className={style.chatContainer}>
      <h3>Messages</h3>
      <div className="noButtonSearch">
        <MagnifyingGlass size={20} />
        <input
          placeholder="Find a chat pal"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {!query && (
        <>
          {conversations?.length ? (
            <div className={`${style.conversationList} scrollbar-hidden`}>
              {conversations.map((conversation: ConversationData) => (
                <Conversation conversation={conversation} />
              ))}
            </div>
          ) : (
            !conversationsIsLoding && (
              <div className={style.noConversations}>
                <div>
                  <Image fill src="/assets/taking.jpg" alt="taliking" />
                </div>
                <span>No conversations</span>
              </div>
            )
          )}
        </>
      )}

      {searchResults && query && (
        <div className={style.chatSearchResults}>
          {searchResults.matchedChats?.map((result) => (
            <ChatSearchResult result={result} />
          ))}

          {!!searchResults.morePeople.length && (
            <>
              <h4>More People</h4>
              {searchResults.morePeople?.map((result) => (
                <ChatSearchResult result={result} />
              ))}
            </>
          )}
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
  );
}
