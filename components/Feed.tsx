import { useEffect, useState } from "react";
import style from "../styles/feed.module.css";
import Post from "./Post";
import { useSession } from "next-auth/react";

export default function Feed({ posts }: { posts: PostData[] }) {
  const { data: sessionData } = useSession() as ClientSession;
  const user = sessionData?.user;

  useEffect(() => {
    const initialWindowHeight = window.innerHeight;
    const feed = document.getElementById("feedAlt");
    if ("visualViewport" in window) {
      window.visualViewport.addEventListener("resize", () =>
        removeFeedPadding(feed, initialWindowHeight)
      );
    }
    return () => {
      window.visualViewport.removeEventListener("resize", () =>
        removeFeedPadding(feed, initialWindowHeight)
      );
    };
  }, []);

  const removeFeedPadding = (feed, initialWindowHeight) => {
    if (
      window.innerHeight + 50 < initialWindowHeight &&
      window.innerWidth < 500
    ) {
      feed.style.paddingBottom = 0;
    }
  };

  return (
    <div className={`${style.feed} ${style["scrollbar-hidden"]}`} id="feedAlt">
      <div className={style.feed__wrapper}>
        {user &&
          posts &&
          posts.map((post) => (
            <Post
              key={post._id}
              id={post._id}
              userId={post.userId}
              likes={post.likes}
              likesCount={post.likesCount}
              image={post.img}
              text={post.desc}
              comments={post.comments}
              createdAt={post.createdAt}
            />
          ))}
      </div>
    </div>
  );
}
