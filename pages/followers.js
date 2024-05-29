import { useEffect, useState } from "react";
import FollowCard from "../components/FollowCard";
import PagesNav from "../components/PagesNav";
import style from "../styles/follow.module.css";
import withAuth from "@/utils/withAuth";

function Follow({ setModalOpened }) {
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const pathname = window.location.pathname;
    setPathname(pathname.slice(1, pathname.length));
  }, []);

  return (
    <div className={style.follow}>
      <PagesNav rotate={true} setModalOpened={setModalOpened} />
      <FollowCard pathname={pathname} />
      <PagesNav />
    </div>
  );
}

export default withAuth(Follow);
