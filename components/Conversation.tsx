import styles from "../styles/conversation.module.css";
import { Check, Checks } from "@phosphor-icons/react";
import { chatDateDifference } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import OnlineIndicator from "./OnlineIndicator";

function Conversation({
  conversation,
  slug,
  userId,
  setCurrentConversationId,
}: {
  conversation: ConversationData;
  slug?: string;
  userId: string;
  setCurrentConversationId: SetState<string>;
}) {
  const {
    _id,
    userName,
    userProfilePic,
    unReadMessagesCount,
    latestMessage,
    updatedAt,
  } = conversation;
  const router = useRouter();

  const startConversation = async () => {
    if (router.pathname.includes("/chat")) {
      router.push(`/chat/${_id}`, undefined, { shallow: true });
    } else {
      setCurrentConversationId(_id);
    }
  };

  return (
    <div
      className={`${styles.conversation} ${
        _id === slug ? styles.conversationActive : ""
      }`}
      onClick={startConversation}
    >
      <div className={styles.profileContainer}>
        <Image
          src={userProfilePic || "/assets/noProfile.jpg"}
          alt="user image"
          width={40}
          height={40}
          className={styles.profileImage}
        />
        <OnlineIndicator members={conversation.members} />
      </div>
      <div className={styles.conversationDetails}>
        <div className={styles.conversationDetail}>
          <h3>{userName}</h3>
          <span>{chatDateDifference(updatedAt)}</span>
        </div>
        {latestMessage && (
          <div className={styles.messagePreview}>
            <div
              className={`${styles.messageText} ${
                unReadMessagesCount && latestMessage.senderId !== userId
                  ? styles.unreadMessage
                  : styles.readMessage
              }`}
            >
              <span className={styles.messageContent}>
                {latestMessage?.text}
              </span>
            </div>
            {unReadMessagesCount && latestMessage.senderId !== userId ? (
              <span className={styles.unreadCount}>{unReadMessagesCount}</span>
            ) : latestMessage.seen ? (
              <Checks size={20} />
            ) : (
              <Check size={15} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Conversation;
