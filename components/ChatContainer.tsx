import { useEffect, useState } from "react";
import style from "../styles/chatContainer.module.css";
import ChatWindow from "./ChatWindow";
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
import { useDispatch, useSelector } from "react-redux";
import {
  selectConversations,
  setConversations,
  setOnlineUsers,
} from "@/redux/chatSlice";

export default function ChatContainer() {
  const dispatch = useDispatch();
  const conversations = useSelector(selectConversations);
  const { data: sessionData } = useSession() as ClientSession;
  const user = sessionData?.user;

  const [searchResults, setSearchResults] = useState<SearchForChatsResult>();
  const [query, setQuery] = useState("");
  const [currentConversationId, setCurrentConversationId] =
    useState<string>("");

  const [searchForChat, result] = useLazySearchForChatQuery();
  const { data: fetchedConversations, isLoading: conversationsIsLoading } =
    useGetConversationsQuery(null);
  const [createConversation] = useCreateConversationMutation();

  useEffect(() => {
    if (fetchedConversations?.length) {
      dispatch(setConversations(fetchedConversations));
    }
  }, [fetchedConversations, dispatch]);

  useEffect(() => {
    if (socket && user) {
      socket.emit("addUser", user._id);
      socket.on("getUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        socket.off("getUsers", (onlineUsers) => {
          dispatch(setOnlineUsers(onlineUsers));
        });
      };
    }
  }, [sessionData, user, dispatch]);

  useEffect(() => {
    if (socket) {
      const updatedConversation = (conversation: ConversationData) => {
        if (conversations?.length) {
          const conversationIndex = conversations.findIndex(
            (c) => c._id === conversation._id
          );
          // Update chat if it exists
          if (conversationIndex !== -1) {
            const updatedConversations = [...conversations];
            updatedConversations[conversationIndex] = conversation;

            updatedConversations.sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            );
            dispatch(setConversations(updatedConversations));
          } else {
            dispatch(setConversations([conversation, ...conversations]));
          }
        } else {
          dispatch(setConversations([conversation]));
        }
      };
      socket.on("updatedConversation", updatedConversation);
      return () => {
        socket.off("updatedConversation", updatedConversation);
      };
    }
  }, [conversations, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 1000);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  async function handleSearch() {
    if (query) {
      const res = await searchForChat(query);
      if (res.data) {
        setSearchResults(res.data);
      }
    } else {
      setSearchResults(undefined);
    }
  }

  return (
    <div className={style.chatContainer}>
      {!currentConversationId ? (
        <>
          <h3>Messages</h3>
          <div className="noButtonSearch">
            <MagnifyingGlass size={20} />
            <input
              placeholder="Find a chat pal"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {!query && conversations.length ? (
            <div className={`${style.conversationList} scrollbar-hidden`}>
              {conversations.map((conversation: ConversationData) => (
                <Conversation
                  key={conversation._id}
                  setCurrentConversationId={setCurrentConversationId}
                  conversation={conversation}
                  userId={user?._id}
                />
              ))}
            </div>
          ) : (
            !conversationsIsLoading && (
              <div className={style.noConversations}>
                <div>
                  <Image fill src="/assets/taking.jpg" alt="taliking" />
                </div>
                <span>No conversations</span>
              </div>
            )
          )}

          {query && searchResults && (
            <div className={style.chatSearchResults}>
              {searchResults.matchedChats?.map((result) => (
                <ChatSearchResult key={result.user._id} result={result} />
              ))}

              {!!searchResults.morePeople.length && (
                <>
                  <h4>More People</h4>
                  {searchResults.morePeople?.map((result) => (
                    <ChatSearchResult key={result.user._id} result={result} />
                  ))}
                </>
              )}
            </div>
          )}

          {result.isLoading && <span className="loader"></span>}
        </>
      ) : (
        <ChatWindow
          conversation={conversations.find(
            (conversation: ConversationData) =>
              conversation._id === currentConversationId
          )}
          socket={socket}
          setCurrentConversationId={setCurrentConversationId}
        />
      )}
    </div>
  );
}
