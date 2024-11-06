import style from "../styles/rightSide.module.css";
import Messaging from "./Message";
import SearchPeople from "./SearchPeople";
import { useSession } from "next-auth/react";

const RightSide = () => {
  return (
    <div className={style.rightSide}>
      <div style={{ position: "sticky", top: 10 }}>
        <SearchPeople
          customResultsStyle={style.searchResults}
          customContainer={style.searchPeople}
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
