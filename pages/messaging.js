import Message from "../components/Message";
import PagesNav from "../components/PagesNav";
import style from "../styles/messaging.module.css";

export default function Messaging({ setModalOpened }) {
  return (
    <div className={style.messaging}>
      <PagesNav rotate={true} setModalOpened={setModalOpened} />
      <Message />
    </div>
  );
}
