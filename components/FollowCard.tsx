import style from "../styles/followCard.module.css";
import { useEffect, useState } from "react";
import { formatNumber } from "../modules/formatNumber";
import {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useFollowMutation,
  useUnfollowMutation,
} from "../redux/services/user";
import { useRouter } from "next/router";

const FollowCard = ({ pathname }: FollowCard) => {
  const router = useRouter();

  const [selected, setSelected] = useState<string>();

  const { data } = useGetFollowersQuery(null);
  const { data: followingData, isLoading } = useGetFollowingQuery(null);
  const [follow] = useFollowMutation();
  const [unfollow] = useUnfollowMutation();

  useEffect(() => {
    setSelected(pathname || "followers");
  }, []);

  const changeSelected = (selected) => {
    setSelected(selected);
    if (pathname) {
      router.push(`/follow/${selected}`);
    }
  };

  return (
    <div className={style.followCard__cont}>
      <div className={style.followCard}>
        <div className={style.followCard__head}>
          <span
            style={{
              background: `${selected === "followers" ? "white" : "none"}`,
            }}
            onClick={() => changeSelected("followers")}
          >
            Followers
            <span className={style.tag}>
              {formatNumber(data?.data.length || 0)}
            </span>
          </span>
          <span
            style={{
              background: `${selected === "following" ? "white" : "none"}`,
            }}
            onClick={() => changeSelected("following")}
          >
            Following
            <span className={style.tag}>
              {formatNumber(followingData?.data.length || 0)}
            </span>
          </span>
        </div>
        {followingData ? (
          <>
            {selected === "following" ? (
              <div className={`${style.followCard__list} scrollbar-hidden`}>
                {followingData?.status === "ok" &&
                  followingData.data.map((follow, i) => {
                    return (
                      <div className={style.followCard__follow} key={i}>
                        <div className="flex items-center">
                          <img
                            src={
                              follow.profilePicture?.url
                                ? follow.profilePicture?.url
                                : "/assets/noPic.webp"
                            }
                            alt=""
                            className={style.followImage}
                          />
                          <span>{follow.username}</span>
                        </div>
                        <span
                          className={style.followCard__action}
                          onClick={async () => {
                            await unfollow({ userId: follow.id });
                          }}
                        >
                          Unfollow
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className={`${style.followCard__list} scrollbar-hidden`}>
                {data?.status === "ok" &&
                  data.data.map((follower, i) => {
                    return (
                      <div className={style.followCard__follow} key={i}>
                        <div className="flex items-center">
                          <img
                            src={
                              follower.profilePicture?.url
                                ? follower.profilePicture?.url
                                : "/assets/noPic.webp"
                            }
                            alt=""
                            className={style.followImage}
                          />
                          <span>{follower.username}</span>
                        </div>
                        <span
                          className={style.followCard__action}
                          onClick={async () => {
                            if (follower.following)
                              await unfollow({ userId: follower.id });
                            else await follow({ userId: follower.id });
                          }}
                        >
                          {follower.following ? "Unfollow" : "Follow"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        ) : (
          isLoading && <span className="loader loader--margin-top"></span>
        )}
      </div>
    </div>
  );
};

export default FollowCard;
