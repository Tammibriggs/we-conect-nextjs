import { useCreateConversationMutation } from "@/redux/services/messaging";
import style from "../styles/chatSearchResult.module.css";
import Image from "next/image";
import { selectConversations, setConversations } from "@/redux/chatSlice";
import { useDispatch, useSelector } from "react-redux";

function ChatSearchResult({
  setCurrentConversationId,
  setQuery,
  result,
}: ChatSearchResult) {
  const dispatch = useDispatch();
  const conversations = useSelector(selectConversations);

  const [createConversation] = useCreateConversationMutation();

  const startConversation = async () => {
    if (result?.conversationId) {
      setCurrentConversationId(result?.conversationId);
    } else {
      const res = await createConversation({
        receiverId: result.user._id,
      });
      if (res.data) {
        dispatch(setConversations([res.data, ...conversations]));
        setCurrentConversationId(res.data._id);
        setQuery("");
      }
    }
  };

  return (
    <div className={style.chatsearchResult} onClick={startConversation}>
      <div className={style.profileContainer}>
        <Image
          src={
            result.user.profilePicture?.url
              ? result.user.profilePicture?.url
              : `/assets/noProfile.jpg`
          }
          alt="profile"
          width={40}
          height={40}
          className={style.profileImage}
        />
        {/* <span className={style.onlineIndicator}></span> */}
      </div>
      <div className={style.chatsearchResultInfo}>
        <h3 className="truncate">{result.user.username}</h3>
        {result.user.bio && <p>{result.user.bio}</p>}
      </div>
    </div>
  );
}

export default ChatSearchResult;
