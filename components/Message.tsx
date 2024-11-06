import style from "@/styles/message.module.css";

function Message({
  elementId,
  message,
  userId,
  senderName,
}: {
  elementId: string;
  message: MessageDoc;
  userId: string;
  senderName;
}) {
  const messangerName = (senderId: string) => {
    if (senderId === userId) {
      return "You";
    } else {
      return senderName;
    }
  };

  return (
    <span
      {...(elementId && { id: elementId })}
      className={`${style.message} ${
        message.senderId === userId ? style.myMessage : ""
      }`}
    >
      <span>{messangerName(message.senderId)}</span>
      <span>{message.text}</span>
    </span>
  );
}

export default Message;
