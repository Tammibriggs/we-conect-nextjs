import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Feed from "../components/Feed";
import FollowCard from "../components/FollowCard";
import PagesNav from "../components/PagesNav";
import ProfileCard from "../components/ProfileCard";
import RightSide from "../components/RightSide";
import Share from "../components/Share";
import ShareModal from "../components/ShareModal";
import { useGetPostsQuery } from "../redux/services/post";
import { useGetUserByIdQuery } from "../redux/services/user";
import style from "../styles/profile.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import withAuth from "@/utils/withAuth";

function Profile({ setModalOpened, modalOpened }) {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const { id: userId } = router.query;
  const [skip, setSkip] = useState(true);
  const { data: userData } = useGetUserByIdQuery({ id: userId }, { skip });
  const { data: postsData } = useGetPostsQuery({ userId }, { skip });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (userId) {
      setSkip(false);
    }
  }, []);

  return (
    <div className={style.profile}>
      <PagesNav rotate={true} setModalOpened={setModalOpened} />
      <div className={style.profile__left}>
        <Link href="/" className="logo">
          <h1>weConect</h1>
        </Link>
        <FollowCard />
      </div>
      <div>
        <div className={style["profile__profile-card-mod"]}>
          <ProfileCard
            name={userData?.data ? userData.data.username : ""}
            coverImage={userData?.data.coverPicture}
            profileImage={userData?.data.profilePicture}
            bio={userData?.data.bio}
            followers={userData?.data.followers.length}
            following={userData?.data.followings.length}
            userId={userId}
            showProfileBtn={userId ? userId === user._id : false}
          />
        </div>

        {userId === user._id && <Share />}
        <Feed postsData={postsData} />
      </div>
      <RightSide setModalOpened={setModalOpened} />
      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />
      <PagesNav />
    </div>
  );
}

export default withAuth(Profile);
