import style from "../styles/chatSearchResult.module.css";
import Image from "next/image";

function ChatSearchResult({ result }: ChatSearchResult) {
  return (
    <div className={style.chatsearchResult}>
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
        <span className={style.onlineIndicator}></span>
      </div>
      <div className={style.chatsearchResultInfo}>
        <h3 className="truncate">{result.user.username}</h3>
        {result.user.bio && <p>{result.user.bio}</p>}
      </div>
    </div>
  );
}

export default ChatSearchResult;
