import ChatContainer from "../components/ChatContainer";
import PagesNav from "../components/PagesNav";
import style from "../styles/messaging.module.css";

export default function Chat() {
  return (
    <div className={style.messaging}>
      <PagesNav rotate={true} />
      <ChatContainer />
    </div>
  );
}
