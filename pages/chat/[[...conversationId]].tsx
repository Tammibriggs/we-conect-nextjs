import PagesNav from "@/components/PagesNav";
import style from "@/styles/messaging.module.css";
import ChatContainer from "@/components/ChatContainer";
import { useRouter } from "next/router";

export default function Chat() {
  const router = useRouter();
  const conversationId = router.query?.conversationId;

  return (
    <div className={style.messaging}>
      <PagesNav rotate={true} />
      {router.isReady && (
        <ChatContainer
          customStyle={style.customChatContainer}
          urlConversationId={conversationId?.length ? conversationId[0] : ""}
        />
      )}
    </div>
  );
}
