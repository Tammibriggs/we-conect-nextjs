import { useSelector } from "react-redux";
import style from "../styles/rightSide.module.css";
import Messaging from "./Message";
import SearchPeople from "./SearchPeople";

const RightSide = ({ setModalOpened }) => {
  const userData = useSelector((state) => state.auth);

  return (
    <div className={style.rightSide}>
      <div style={{ position: "sticky", top: 10 }}>
        <SearchPeople
          userData={userData}
          customResultsStyle={style.search__results}
          customContainer={style.SearchPeople}
        />
        <Messaging />
        {/* <div className={style["action-cont"]}>
          <button
            className={`button ${style["r-button"]}`}
            onClick={() => setModalOpened(true)}
          >
            Share
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default RightSide;
