import { model, Schema, models } from "mongoose";

const PostSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      url: {
        type: String,
      },
      filename: {
        type: String,
      },
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = models.Post || model("Post", PostSchema);
export default Post;
