import style from "../styles/chat.module.css";
import SendIcon from "@mui/icons-material/Send";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLazyGetMessagesQuery } from "../redux/services/messaging";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { selectChat, setOpenedChatsMessages } from "@/redux/chatSlice";
import OnlineIndicator from "./OnlineIndicator";
import { IconButton } from "@mui/material";
import Message from "./Message";
import { CircleNotch } from "@phosphor-icons/react";

function ChatWindow({
  conversation,
  socket,
  setCurrentConversationId,
}: ChatWindow) {
  const LIMIT = 20;
  const dispatch = useDispatch();
  const isInFlight = useRef<boolean>();
  const inputRef = useRef<HTMLSpanElement>();
  const messagesRef = useRef<HTMLDivElement>();
  const isFirstScroll = useRef(false);
  const isScrolledButton = useRef(false);
  const scrollHeightBeforeLoadMore = useRef(0);
  const isLoadingMore = useRef(false);
  const totalMessages = useRef(0);
  const { openedChatsMessages } = useSelector(selectChat);
  const { data: sessionData } = useSession() as ClientSession;
  const user = sessionData?.user;

  const [lastMessageElementId, setLastMessageElementId] = useState(null);
  const [isLoadingMessages, setIsLoadingFirstMessages] = useState(false);
  const [messagesQueue, setMessagesQueue] = useState<MessageQueue>([]);
  const [loadedMessagesWrapperId, setLoadedMessagesWrapperId] = useState(null);

  const [getMessages] = useLazyGetMessagesQuery();

  const latestMessage = useMemo(() => {
    if (openedChatsMessages[conversation._id]) {
      const messages = [...openedChatsMessages[conversation._id]];
      return messages.sort(
        (a: MessageDoc, b: MessageDoc) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
    }
    return null;
  }, [openedChatsMessages[conversation._id]]);

  useEffect(() => {
    if (openedChatsMessages[conversation._id] && !isFirstScroll.current) {
      socket.emit("readMessages", {
        conversationId: conversation._id,
        userId: user._id,
        receiverId: getReceiverId(),
      });
    }
  }, [openedChatsMessages[conversation._id]]);

  // Mark messages as seen
  useEffect(() => {
    if (socket) {
      setLastMessageElementId("");
      const markMessagesAsSeen = (conversationId: string) => {
        if (openedChatsMessages[conversationId]) {
          let updatedOpenedChatMessages = { ...openedChatsMessages };
          const messages = JSON.parse(
            JSON.stringify(updatedOpenedChatMessages[conversationId])
          );
          const updatedMessages = messages.map((message: MessageDoc) => {
            message.seen = true;
            return message;
          });
          updatedOpenedChatMessages[conversationId] = updatedMessages;
          dispatch(setOpenedChatsMessages(updatedOpenedChatMessages));
        }
      };
      socket.on("readMessages", markMessagesAsSeen);
      return () => {
        socket.off("readMessages", markMessagesAsSeen);
      };
    }
  }, [socket, openedChatsMessages[conversation._id]?.length]);

  // Load first messages only when they are not already available. i.e When the chat window is first opened.
  useEffect(() => {
    if (socket) {
      if (conversation._id && !openedChatsMessages[conversation._id]?.length) {
        setIsLoadingFirstMessages(true);
        getMessages({
          conversationId: conversation._id,
          limit: LIMIT,
        }).then((res) => {
          if (res.data?.messages?.length) {
            totalMessages.current = res.data.totalMessages;
            const messages = [...res.data.messages];
            let updatedOpenedChatMessages = { ...openedChatsMessages };
            const sortedMessages = messages.sort(
              (a: MessageDoc, b: MessageDoc) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
            updatedOpenedChatMessages[conversation._id] = sortedMessages;
            dispatch(setOpenedChatsMessages(updatedOpenedChatMessages));
          }
          setIsLoadingFirstMessages(false);
        });
      }
    }
  }, [conversation, socket]);

  // Scroll chat window to the bottom either when the chat windows opens, user adds a new message
  // or a new messages arrives and the user's scroll position is at the bottom or near it.
  useEffect(() => {
    const messagesContainer = messagesRef.current;
    if (
      socket &&
      openedChatsMessages[conversation._id] !== undefined &&
      messagesContainer &&
      ((latestMessage && latestMessage.senderId === user._id) ||
        !isFirstScroll.current ||
        isScrolledButton.current)
    ) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      isFirstScroll.current = true;
    }
  }, [openedChatsMessages[conversation._id]?.length, socket]);

  // Runs when previous messaages are loaded and the loading ref state is still true.
  // To preserve the scroll position when newly loaded messages are displayed
  useEffect(() => {
    const messageContainer = messagesRef.current;
    if (loadedMessagesWrapperId && isLoadingMore.current) {
      const loadedMessagesWrapper = document.getElementById(
        loadedMessagesWrapperId
      );
      loadedMessagesWrapper.classList.replace(
        "messages-hidden",
        "messages-flex"
      );
      messageContainer.scrollTop =
        messageContainer.scrollHeight - scrollHeightBeforeLoadMore.current;
      isLoadingMore.current = false;
      setLoadedMessagesWrapperId(null);
    }
  }, [loadedMessagesWrapperId]);

  useEffect(() => {
    if (
      isFirstScroll.current ||
      (!openedChatsMessages[conversation._id]?.length && !isLoadingMessages)
    ) {
      messagesRef.current.classList.remove("invisible");
    }
  }, [isLoadingMessages, openedChatsMessages, conversation]);

  // Emit event to mark new messages as seen only when they have been visible.
  // New messages might have not been seen if a users is scrolled to the top of the chat window.
  useEffect(() => {
    if (
      socket &&
      latestMessage &&
      latestMessage.senderId !== user._id &&
      !latestMessage.seen &&
      lastMessageElementId
    ) {
      const lastMessageElement = document.getElementById(lastMessageElementId);
      // Mark messages as read
      console.log(lastMessageElementId);

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries; // Get the first (and only) entry
          if (entry.isIntersecting) {
            socket.emit("readMessages", {
              conversationId: conversation._id,
              userId: user._id,
              receiverId: getReceiverId(),
            });
          }
        },
        {
          root: messagesRef.current, // Use the browser viewport as the container
          rootMargin: `0px 0px -40px 0px`, // Margin around the root
          threshold: 0, // Percentage of the target's visibility required to trigger the observer (0.1 means 10% visible)
        }
      );

      if (lastMessageElement) {
        observer.observe(lastMessageElement); // Start observing the target element
      }

      return () => {
        if (lastMessageElement) {
          observer.unobserve(lastMessageElement); // Cleanup observer on unmount
        }
      };
    }
  }, [lastMessageElementId, conversation, latestMessage, socket]);

  // Send messages one at a time from the messages queue
  useEffect(() => {
    if (messagesQueue.length && !isInFlight.current && socket?.connected) {
      isInFlight.current = true;
      const firstQueuedMessaage = messagesQueue[0];
      socket.emit("sendMessage", {
        conversationId: firstQueuedMessaage.conversationId,
        userId: user._id,
        receiverId: firstQueuedMessaage.receiverId,
        text: firstQueuedMessaage.text,
      });
    }
  }, [messagesQueue, conversation, socket]);

  // when a new message arrives, add it to the state and remove it from the message queue which will trigger the next message in the queue to be sent.
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message: MessageDoc) => {
        const updatedOpenedChatMessages = { ...openedChatsMessages };

        if (updatedOpenedChatMessages[message.conversationId]) {
          // Update the optimistically addeed message with new socket message if it was sent by the current user
          if (message.senderId === user._id) {
            let updatedMessages: MessageDoc[] = [];
            updatedMessages = [
              ...updatedOpenedChatMessages[message.conversationId].filter(
                (m: MessageDoc) =>
                  m._id !== messagesQueue[messagesQueue.length - 1]._id
              ),
              message,
            ];

            updatedOpenedChatMessages[message.conversationId] = updatedMessages;
            setMessagesQueue((prev) => {
              prev.pop();
              return prev;
            });
            isInFlight.current = false;
          } else {
            // If the new socket message was not sent by the current user
            updatedOpenedChatMessages[message.conversationId] = [
              ...updatedOpenedChatMessages[message.conversationId],
              message,
            ];
          }
        } else {
          updatedOpenedChatMessages[message.conversationId] = [message];
        }
        dispatch(setOpenedChatsMessages(updatedOpenedChatMessages));
      };

      socket.on("getMessage", handleNewMessage);
      return () => {
        socket?.off("getMessage", handleNewMessage);
      };
    }
  }, [socket, conversation, messagesQueue, openedChatsMessages]);

  const getReceiverId = () => {
    return conversation.members.find((id) => id !== user._id);
  };

  const handleMessageListScroll = () => {
    const messagesContainer = messagesRef.current;
    // Scrolled to the bottom of close to it
    if (
      messagesContainer.scrollHeight - messagesContainer.scrollTop <=
      messagesContainer.clientHeight + 15
    ) {
      isScrolledButton.current = true;
    }
    // Load more messages on scroll top
    if (
      openedChatsMessages[conversation._id]?.length &&
      hasMoreMessages() &&
      messagesContainer.scrollTop === 0 &&
      !isLoadingMore.current
    ) {
      scrollHeightBeforeLoadMore.current = messagesContainer.scrollHeight;
      isLoadingMore.current = true;
      getMessages({
        conversationId: conversation._id,
        skip: openedChatsMessages[conversation._id].length,
        limit: LIMIT,
      }).then((res) => {
        if (res.data) {
          totalMessages.current = res.data.totalMessages;
          const messages = [...res.data.messages];
          const sortedMessages = messages.sort(
            (a: MessageDoc, b: MessageDoc) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          let updatedOpenedChatMessages = { ...openedChatsMessages };
          updatedOpenedChatMessages[conversation._id] = [
            ...sortedMessages,
            ...updatedOpenedChatMessages[conversation._id],
          ];
          dispatch(setOpenedChatsMessages(updatedOpenedChatMessages));
        }
      });
    }
  };

  const hasMoreMessages = () => {
    if (totalMessages.current > openedChatsMessages[conversation._id]?.length)
      return true;
    return false;
  };

  // Add new messages to the message queue
  const sendMessage = () => {
    const text = inputRef.current.textContent.trim();
    if (text) {
      const uniqueKey = new Date().getTime().toString();
      const newMessage = {
        _id: uniqueKey,
        senderId: user._id,
        receiverId: getReceiverId(),
        senderName: user.username,
        text,
        seen: false,
        createdAt: uniqueKey,
        updatedAt: uniqueKey,
        isError: false,
        conversationId: conversation._id,
      };
      inputRef.current.textContent = "";
      const updatedOpenedChatMessages = { ...openedChatsMessages };
      const messages = updatedOpenedChatMessages[conversation._id] || [];
      updatedOpenedChatMessages[conversation._id] = [...messages, newMessage];
      dispatch(setOpenedChatsMessages(updatedOpenedChatMessages));
      setMessagesQueue([...messagesQueue, newMessage]);
    }
  };

  const displayMessages = useMemo(() => {
    if (!openedChatsMessages[conversation._id]) return [];

    const updatedMessages = [...openedChatsMessages[conversation._id]];
    const sortedMessages = updatedMessages.sort(
      (a: MessageDoc, b: MessageDoc) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const messageElems = sortedMessages?.map(
      (message: MessageDoc, index: number) => {
        const genenratedLastMessageElementId =
          updatedMessages.length - 1 === index
            ? new Date().getTime().toString()
            : "";

        if (genenratedLastMessageElementId) {
          setLastMessageElementId(genenratedLastMessageElementId);
        }

        return (
          <Message
            key={message._id}
            elementId={genenratedLastMessageElementId}
            senderName={conversation.userName}
            userId={user._id}
            message={message}
          />
        );
      }
    );

    if (isLoadingMore.current) {
      const loadedMessageElements = messageElems.splice(0, LIMIT);

      const wrapperId = new Date().getTime().toString();
      setLoadedMessagesWrapperId(wrapperId);
      const wrappedLoadedMessageElems = (
        <div key={wrapperId} id={wrapperId} className="messages-hidden">
          {loadedMessageElements.map((elem) => elem)}
        </div>
      );
      messageElems.unshift(wrappedLoadedMessageElems);
    }

    return messageElems;
  }, [
    openedChatsMessages[conversation._id],
    conversation?._id,
    setLastMessageElementId,
  ]);

  return (
    <div className={style.chat}>
      <div className={style.chat__head}>
        <span onClick={() => setCurrentConversationId("")}>
          <KeyboardArrowLeft />
        </span>
        <div className={style.chat__profile}>
          <Image
            src={
              conversation.userProfilePic
                ? conversation.userProfilePic
                : "/assets/noProfile.jpg"
            }
            className={style.chat__searchPalImage}
            width={40}
            height={40}
            alt="profile"
          />
          <OnlineIndicator members={conversation.members} />
        </div>
        <span>{conversation.userName}</span>
      </div>
      <div
        className={`${style.chat__messages} invisible`}
        onScroll={handleMessageListScroll}
        ref={messagesRef}
      >
        {hasMoreMessages() && (
          <div
            className={`${style.loadingIconContainer} ${
              !isLoadingMore.current ? "invisible" : ""
            }`}
          >
            <CircleNotch
              size={20}
              className={`${style.loadingIcon} animate-spin `}
            />
          </div>
        )}

        {displayMessages}
      </div>
      <form>
        <span
          className={style.textarea}
          role="textbox"
          contentEditable="true"
          ref={inputRef}
        ></span>
        <IconButton type="button" onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </form>
    </div>
  );
}

export default ChatWindow;
