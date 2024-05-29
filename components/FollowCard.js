import style from "../styles/followCard.module.css";
import { useState } from "react";
import { formatNumber } from "../modules/formatNumber";
import {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useFollowMutation,
  useUnfollowMutation,
} from "../redux/services/user";

const FollowCard = ({ pathname }) => {
  const [selected, setSelected] = useState(pathname || "followers");
  const { data } = useGetFollowersQuery();
  const { data: followData } = useGetFollowingQuery();
  const [follow] = useFollowMutation();
  const [unfollow] = useUnfollowMutation();

  return (
    <div className={style.followCard__cont}>
      <div className={style.followCard}>
        <div className={style.followCard__head}>
          <span
            style={{
              background: `${selected === "followers" ? "white" : "none"}`,
            }}
            onClick={() => setSelected("followers")}
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
            onClick={() => setSelected("following")}
          >
            Following
            <span className={style.tag}>
              {formatNumber(followData?.data.length || 0)}
            </span>
          </span>
        </div>
        {selected === "following" ? (
          <div className={`${style.followCard__list} scrollbar-hidden`}>
            {followData?.status === "ok" &&
              followData.data.map((follow, i) => {
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
      </div>
    </div>
  );
};

export default FollowCard;
