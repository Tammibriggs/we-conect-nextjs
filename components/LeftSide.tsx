import FollowersCard from "./FollowCard";
// import MiniprofileCard from "./MiniProfileCard";
import style from "../styles/leftSide.module.css";
import ProfileCard from "./ProfileCard";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { SignOut } from "@phosphor-icons/react";

const LeftSide = () => {
  const { data: sessionData } = useSession() as ClientSession;
  const user = sessionData?.user;

  return (
    <div className={style.leftSide}>
      <div className={style.leftSide__wrapper}>
        <Link href="/" className="logo">
          <h1>weConect</h1>
        </Link>
        {/* <MiniprofileCard/> */}
        <ProfileCard
          name={user?.username}
          coverImage={user?.coverPicture}
          profileImage={user?.profilePicture}
          bio={user?.bio}
          followers={user?.followers?.length}
          following={user?.followings?.length}
          showViewBtn={true}
        />
        <FollowersCard />
        <div className={style.leftSideSignOut} onClick={() => signOut()}>
          <SignOut size={25} /> Sign Out
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
