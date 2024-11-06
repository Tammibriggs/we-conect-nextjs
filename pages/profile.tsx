import { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import Head from "next/head";

function Profile() {
  const router = useRouter();
  const userId = router.query?.id as string;
  const { data: sessionData } = useSession() as ClientSession;
  const user = sessionData?.user;

  const [skip, setSkip] = useState(true);

  const { data: userData } = useGetUserByIdQuery({ id: userId }, { skip });
  const { data: posts, isLoading } = useGetPostsQuery({ userId });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (userId) {
      setSkip(false);
    }
  }, [userId]);

  return (
    <div className={style.profile}>
      <Head>
        <title>Profile</title>
      </Head>
      <PagesNav rotate={true} />
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
            showProfileBtn={userId ? userId === user?._id : false}
          />
        </div>

        {userId === user?._id && <Share />}
        {posts ? (
          <Feed posts={posts} />
        ) : (
          isLoading && <span className="loader"></span>
        )}
      </div>
      <RightSide />
      <ShareModal />
      <PagesNav />
    </div>
  );
}

export default Profile;
