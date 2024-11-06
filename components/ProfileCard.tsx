import style from "../styles/profileCard.module.css";
import { Button } from "@mui/material";
import { useRef, useState } from "react";
import EditProfile from "./EditProfile";
import { useFollowMutation, useUnfollowMutation } from "../redux/services/user";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function ProfileCard({
  name,
  coverImage,
  profileImage,
  bio,
  following,
  followers,
  showProfileBtn,
  showViewBtn,
  userId,
}: ProfileCard) {
  const router = useRouter();
  const profileImageRef = useRef();
  const coverImageRef = useRef();
  const { data: sessionData } = useSession() as ClientSession;
  const user = sessionData?.user;

  const [editIsLoading, setEditIsLoading] = useState(false);
  const [coverPic, setCoverPic] = useState({ url: "", filename: "" });
  const [profilePic, setProfilePic] = useState({ url: "", filename: "" });
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [follow] = useFollowMutation();
  const [unfollow] = useUnfollowMutation();

  const onImageChange = (event, setImage) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0]["type"].split("/")[0] === "image") {
        let img = event.target.files[0];
        setImage({ url: URL.createObjectURL(img), filename: "" });
      }
    }
  };

  const handleFollow = () => {
    if (user.followings.includes(userId)) unfollow({ userId });
    if (!user.followings.includes(userId)) follow({ userId });
  };

  return (
    <div className={style.profileCard__cont}>
      <div className={style.profileCard}>
        <div className={style.coverImage}>
          <Image
            src={coverImage?.url ? coverImage?.url : "/assets/noCover.avif"}
            alt="cover"
            fill
          />
        </div>
        <div className={style.profileCard__profileImage}>
          <Image
            src={
              profileImage?.url ? profileImage?.url : "/assets/noProfile.jpg"
            }
            width={110}
            height={120}
            alt="profile"
          />
          <div>
            <h2>{name}</h2>
            {showProfileBtn && (
              <Button onClick={() => setIsEditOpen(true)}>
                {editIsLoading ? "Updating..." : "Edit profile"}
              </Button>
            )}
            {user && router.pathname !== "/" && userId !== user._id && (
              <Button onClick={handleFollow}>
                {user.followings.includes(userId) ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>
        </div>
        <div className={style.profileCard__details}>
          <h2>{name}</h2>
          <p>{bio}</p>
          <div className={style.profileCard__follow}>
            <Link href="/follow/followers">
              <span>{followers || 0}</span> Followers
            </Link>
            <Link href="follow/following">
              <span>{following || 0}</span> Following
            </Link>
          </div>
        </div>
        {showViewBtn && (
          <Link href={`/profile/?id=${user?._id}`}>View Profile</Link>
        )}
      </div>
      <EditProfile
        coverImage={coverImage}
        profileImage={profileImage}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        name={name}
        bio={bio}
        profileImageRef={profileImageRef}
        coverImageRef={coverImageRef}
        coverPic={coverPic}
        profilePic={profilePic}
        setProfilePic={setProfilePic}
        setCoverPic={setCoverPic}
        editIsLoading={editIsLoading}
        setEditIsLoading={setEditIsLoading}
      />
      <div style={{ display: "none" }}>
        <input
          type="file"
          name="profile"
          ref={profileImageRef}
          accept="image/*"
          onChange={(e) => onImageChange(e, setProfilePic)}
        />
        <input
          type="file"
          name="cover"
          ref={coverImageRef}
          accept="image/*"
          onChange={(e) => onImageChange(e, setCoverPic)}
        />
      </div>
    </div>
  );
}
