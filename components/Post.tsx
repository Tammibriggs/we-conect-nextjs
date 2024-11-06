import { useEffect, useState } from "react";
import style from "../styles/post.module.css";
import { formatNumber } from "../modules/formatNumber";
import {
  useDeletePostMutation,
  useLikeNdislikePostMutation,
} from "../redux/services/post";
import { useGetUserByIdQuery } from "../redux/services/user";
import moment from "moment";
import Modal from "./Modal";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase";
import { TrashSimple } from "@phosphor-icons/react";
import { Button } from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

const Post = ({
  id,
  userId,
  likes,
  likesCount,
  image,
  text,
  createdAt,
}: Post) => {
  const router = useRouter();
  const [likeNdislike] = useLikeNdislikePostMutation();
  const { data: sessionData } = useSession() as ClientSession;
  const user = sessionData.user;

  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [openComment] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // const { data: post } = useGetPostQuery({ postId: id });
  const { data: userData } = useGetUserByIdQuery({ id: userId });
  const [deleteFunc, result] = useDeletePostMutation();

  const likeNDdislike = () => {
    setIsLiked(!isLiked);
    likeNdislike({ userId: user._id, postId: id });
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
  };

  const deletePost = async () => {
    if (image.filename) {
      const desertRef = ref(storage, `weConect/${image.filename}`);
      await deleteObject(desertRef);
    }
    const res = await deleteFunc({ postId: id });
    setDeleteModal(false);
    if (res.data) {
      setTimeout(() => setIsDeleted(true), 300);
    }
  };

  useEffect(() => {
    if (likesCount) {
      setIsLiked(likes.includes(user._id));
      setLikeCount(likesCount);
    }
  }, []);

  const sendComment = () => {};

  if (isDeleted) return null; // This approach is used to avoid refetch and re-rendering of posts.

  return (
    <div className={style.post}>
      <div className={style.post__head}>
        <div>
          <Image
            src={
              userData?.data.profilePicture.url
                ? userData?.data.profilePicture.url
                : "/assets/noPic.webp"
            }
            width={50}
            onClick={() => router.push(`/profile?id=${userId}`)}
            height={50}
            alt="profile"
          />
          <span>
            <Link
              href={`/profile?id=${userId}`}
              className={style.post__posterName}
            >
              {userData?.data.username}
            </Link>
            <span>{moment(createdAt).fromNow(true)}</span>
          </span>
        </div>
        {userId === user._id && (
          <Image
            src="/assets/trash.png"
            alt="trash"
            width={17}
            height={17}
            onClick={() => setDeleteModal(true)}
          />
        )}
      </div>
      <p>{text}</p>
      {image.url && (
        <Image
          src={image.url}
          width={0}
          height={0}
          sizes="100vw"
          alt="post pic"
        />
      )}
      <div className={style.postReact}>
        <span>
          <Image
            src={isLiked ? "/assets/like.png" : "/assets/notlike.png"}
            alt="post"
            width={20}
            height={20}
            onClick={likeNDdislike}
          />
          {formatNumber(likeCount)}
        </span>
        {/* <span onClick={() => setOpenComment(!openComment)}>
          <img src='/assets/comment.png' alt="" />
          {post?.data.comments.length}
        </span> */}
      </div>

      {openComment && (
        <div>
          {/* input box for adding comment */}
          <form className={style.post__addComment}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              onClick={sendComment}
            >
              Post
            </button>
          </form>

          {/* comments */}
          {/* {comments.length > 0 && (
            <div className={style.post__comments}>
              {comments.map((comment) => (
                <div key={comment.id} className={style.post__comment}>
                  <Image
                    width={50}
                    height={50}
                    src={comment.userImage}
                    alt="commenter"
                  />
                  <div>
                    <span>{comment.username}</span>{" "}
                    <span>{comment.timestamp}</span>
                    <br />
                    <p>{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )} */}
        </div>
      )}

      <Modal
        open={deleteModal}
        customContainer={style["post__modal-container"]}
        customModal={style.postModal}
        onClose={() => setDeleteModal(false)}
      >
        <div className={style.postDelete}>
          <TrashSimple size={30} className="text-slate-800" />
          <h4>Delete Post</h4>
          <p>Are you sure you want to delete this post?</p>

          <div>
            <Button
              disableElevation
              onClick={() => setDeleteModal(false)}
              className={style.postDeleteCloseBtn}
            >
              Close
            </Button>
            <Button
              onClick={deletePost}
              disableElevation
              disabled={result.isLoading}
              variant="contained"
              className={style.postDeleteBtn}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Post;
