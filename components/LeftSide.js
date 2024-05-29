import FollowersCard from "./FollowCard";
// import MiniprofileCard from "./MiniProfileCard";
import style from "../styles/leftSide.module.css";
import ProfileCard from "./ProfileCard";
import { useSelector } from "react-redux";
import Link from "next/link";

const LeftSide = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className={style.leftSide}>
      <div className={style.leftSide__wrapper}>
        <Link href="/" className="logo">
          <h1>weConect</h1>
        </Link>
        {/* <MiniprofileCard/> */}
        {user && (
          <ProfileCard
            name={user.username}
            coverImage={user.coverPicture}
            profileImage={user.profilePicture}
            bio={user.bio}
            employmentStatus={user.employmentStatus}
            country={user.country}
            relationship={user.relationship}
            followers={user.followers.legth}
            following={user.followings.legth}
            showViewBtn={true}
          />
        )}
        <FollowersCard />
      </div>
    </div>
  );
};

export default LeftSide;
