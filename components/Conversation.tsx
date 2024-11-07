import styles from "../styles/conversation.module.css";
import { Check, Checks } from "@phosphor-icons/react";
import { chatDateDifference } from "@/utils";
import Image from "next/image";
import { useRouter } from "next/router";

function Conversation({
  conversation,
}: {
  conversation: ConversationData & { slug?: string };
}) {
  const router = useRouter();
  const {
    _id,
    userName,
    userProfilePic,
    slug,
    unReadMessagesCount,
    latestMessage,
    updatedAt,
  } = conversation;

  const onlineUsers = [];

  const handleClick = () => {
    router.push(`/inbox/${_id}`, undefined, { shallow: true });
  };

  return (
    <div
      className={`${styles.conversation} ${
        _id === slug ? styles.conversationActive : ""
      }`}
      onClick={handleClick}
    >
      <div className={styles.profileContainer}>
        <Image
          src={userProfilePic || "/assets/noProfile.jpg"}
          alt="user image"
          width={40}
          height={40}
          className={styles.profileImage}
        />
        <span className={styles.onlineIndicator}></span>
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
                unReadMessagesCount ? styles.unreadMessage : styles.readMessage
              }`}
            >
              <span className={styles.messageContent}>
                {latestMessage?.text}
              </span>
            </div>
            {unReadMessagesCount ? (
              <span className={styles.unreadCount}>{unReadMessagesCount}</span>
            ) : latestMessage.read ? (
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
