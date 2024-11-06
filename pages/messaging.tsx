import Message from "../components/Message";
import PagesNav from "../components/PagesNav";
import style from "../styles/messaging.module.css";

export default function Messaging() {
  return (
    <div className={style.messaging}>
      <PagesNav rotate={true} />
      <Message />
    </div>
  );
}
