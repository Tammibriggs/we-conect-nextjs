import { useEffect, useState } from "react";
import style from "../styles/post.module.css";
import { formatNumber } from "../modules/formatNumber";
import { useSelector } from "react-redux";
import {
  useDeletePostMutation,
  useGetPostQuery,
  useLikeNdislikePostMutation,
} from "../redux/services/post";
import { useGetUserByIdQuery } from "../redux/services/user";
import moment from "moment";
import Modal from "./Modal";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase";
import { TrashSimple } from "@phosphor-icons/react";
import { Button } from "@mui/material";

const Post = ({ id, userId }) => {
  const [likeNdislike] = useLikeNdislikePostMutation();
  const user = useSelector((state) => state.auth.user);
  const { data: post } = useGetPostQuery({ postId: id });
  const { data: userData } = useGetUserByIdQuery({ id: userId });
  const [deleteFunc] = useDeletePostMutation();

  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [openComment] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

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
    if (post.data.img.filename) {
      const desertRef = ref(storage, `weConect/${post.data.img.filename}`);
      await deleteObject(desertRef);
    }
    await deleteFunc({ postId: post.data._id });
    setDeleteModal(false);
  };

  useEffect(() => {
    if (post?.data) {
      setIsLiked(post?.data.likes.includes(user._id));
      setLikeCount(post?.data.likes.length);
    }
  }, [post, userData, user._id]);

  const sendComment = () => {};

  return (
    <div className={style.post}>
      <div className={style.post__head}>
        <div>
          <img
            src={
              userData?.data.profilePicture.url
                ? userData?.data.profilePicture.url
                : "/assets/noPic.webp"
            }
            alt="profile"
          />
          <span>
            <span className={style.post__posterName}>
              {userData?.data.username}
            </span>
            <span>{moment(post?.data.createdAt).fromNow(true)}</span>
          </span>
        </div>
        {post?.data.userId === user._id && (
          <img
            src="/assets/trash.png"
            alt="trash"
            onClick={() => setDeleteModal(true)}
          />
        )}
      </div>
      <p>{post?.data.desc}</p>
      {post?.data?.img?.url && <img src={post?.data.img.url} alt="post pic" />}
      <div className={style.postReact}>
        <span>
          <img
            src={isLiked ? "/assets/like.png" : "/assets/notlike.png"}
            alt=""
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
          {post?.data.comments.length > 0 && (
            <div className={style.post__comments}>
              {post.data.comments.map((comment) => (
                <div key={comment.id} className={style.post__comment}>
                  <img src={comment.userImage} alt="commenter" />
                  <div>
                    <span>{comment.username}</span>{" "}
                    <span>{comment.timestamp}</span>
                    <br />
                    <p>{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal
        open={deleteModal}
        customContainer={style["post__modal-container"]}
        customModal={style.post__modal}
        onClose={() => setDeleteModal(false)}
      >
        <div className="bg-white p-5 rounded-md">
          <TrashSimple size={30} className="text-slate-800" />
          <p className="text-lg font-semibold">Delete Item</p>
          <p className="text-sm text-slate-500">
            Are you sure you want to delete this post
          </p>

          <div className="ml-auto w-fit mt-5">
            <Button
              disableElevation
              onClick={() => setDeleteModal(false)}
              className="normal-case rounded-md text-slate-500 w-fit mt-[10px] ml-auto"
            >
              Close
            </Button>
            <Button
              onClick={deletePost}
              disableElevation
              variant="contained"
              className="ml-2 normal-case rounded-[md bg-transparent hover:bg-transparent text-red-500 w-fit mt-[10px]"
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
