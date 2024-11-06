import { model, Schema, models, Model } from "mongoose";

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
    },
    comments: {
      type: Array,
      default: [{ userId: String, text: String }],
    },
  },
  { timestamps: true }
);

const Post: Model<PostSchema> =
  models.Post || model<PostSchema>("Post", PostSchema);
export default Post;
