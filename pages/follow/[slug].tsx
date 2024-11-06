import FollowCard from "@/components/FollowCard";
import PagesNav from "@/components/PagesNav";
import style from "@/styles/follow.module.css";
import Head from "next/head";
import { useRouter } from "next/router";

function Follow() {
  const router = useRouter();
  const slug = router.query.slug as "followers" | "following";

  return (
    <div className={style.follow}>
      <Head>
        <title>Followers</title>
      </Head>
      <PagesNav rotate={true} />
      <FollowCard pathname={slug} />
      <PagesNav />
    </div>
  );
}

export default Follow;
