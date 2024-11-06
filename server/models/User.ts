import { model, Schema, models, Model } from "mongoose";

const UserSchema = new Schema<UserSchema>(
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
      type: [{ type: String }],
      default: [],
    },
    followings: {
      type: [{ type: String }],
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

const User: Model<UserSchema> =
  models.User || model<UserSchema>("User", UserSchema);
export default User;
