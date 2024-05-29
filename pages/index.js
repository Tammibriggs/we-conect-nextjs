import style from "../styles/home.module.css";
import Feed from "../components/Feed";
import RightSide from "../components/RightSide";
import LeftSide from "../components/LeftSide";
import ShareModal from "../components/ShareModal";
import { useEffect } from "react";
import PagesNav from "../components/PagesNav";
import { useGetTimelinePostQuery } from "../redux/services/post";
import Share from "../components/Share";
import withAuth from "@/utils/withAuth";

function Home({ setModalOpened, modalOpened }) {
  const { data: postsData } = useGetTimelinePostQuery();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className={style.home}>
      <PagesNav rotate={true} setModalOpened={setModalOpened} />
      <LeftSide />
      <div className={style.home__center}>
        <Share />
        <Feed postsData={postsData} />
      </div>
      <RightSide setModalOpened={setModalOpened} />
      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />
      <PagesNav />
    </div>
  );
}

export default withAuth(Home);
