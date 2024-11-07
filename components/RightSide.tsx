import style from "../styles/rightSide.module.css";
import ChatContainer from "./ChatContainer";

const RightSide = () => {
  return (
    <div className={style.rightSide}>
      <div style={{ position: "sticky", top: 10 }}>
        {/* <SearchPeople
          customResultsStyle={style.searchResults}
          customContainer={style.searchPeople}
        /> */}
        <ChatContainer />
      </div>
    </div>
  );
};

export default RightSide;
