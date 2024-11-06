import style from "../styles/home.module.css";
import Feed from "../components/Feed";
import RightSide from "../components/RightSide";
import LeftSide from "../components/LeftSide";
import ShareModal from "../components/ShareModal";
import { useEffect, useRef, useState } from "react";
import PagesNav from "../components/PagesNav";
import { useLazyGetTimelinePostQuery } from "../redux/services/post";
import Share from "../components/Share";
import Head from "next/head";

function Home() {
  const loader = useRef(null);

  const [posts, setPosts] = useState<PostData[]>([]);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [newPosts, setNewPosts] = useState<PostData[]>([]);

  const [getTimelinePosts, result] = useLazyGetTimelinePostQuery();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    if (posts.length && newPosts.length && newPosts[0]?._id !== posts[0]._id) {
      setPosts([newPosts[0], ...posts]);
    }
  }, [newPosts, posts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMorePosts();
        }
      },
      { rootMargin: "300px" }
    );

    if (loader.current && hasMorePosts()) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect(); // Cleanup observer on unmount
  }, [loader, page, posts, loadMorePosts]);

 async function loadMorePosts () {
    const res = await getTimelinePosts({ page });
    if (res.data) {
      setTotalPostsCount(res.data.totalCount);
      const removeNewPosts = res.data.posts.filter(
        (post: PostData) =>
          !newPosts.find((newPost) => newPost._id === post._id)
      );
      setPosts([...posts, ...removeNewPosts]);
      setPage((prevPage) => prevPage + 1);
    }
  };

  const hasMorePosts = () => {
    if (result.isUninitialized || posts.length < totalPostsCount) {
      return true;
    }
    return false;
  };

  return (
    <div className={style.home}>
      <Head>
        <title>weConect</title>
      </Head>
      <PagesNav rotate={true} />
      <LeftSide />
      <div className={style.home__center}>
        <Share setNewPosts={setNewPosts} />
        {posts && <Feed posts={posts} />}
        {hasMorePosts() && <span ref={loader} className="loader"></span>}
      </div>
      <RightSide />
      <ShareModal setNewPosts={setNewPosts} />
      <PagesNav />
    </div>
  );
}

export default Home;
