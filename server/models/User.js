import { model, Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      min: 3,
      max: 20,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    profilePicture: {
      url: {
        type: String,
      },
      filename: {
        type: String,
      },
      default: {},
    },
    coverPicture: {
      url: {
        type: String,
      },
      filename: {
        type: String,
      },
      default: {},
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      max: 50,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
