import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import { verifyToken } from "@/server/utils/jwt";

const validateUpdateUser = (req, res) => {
  if (!req.body.username) {
    return res
      .status(403)
      .json({ status: "error", message: "username is required" });
  }

  if (req.body.password || req.body.followers || req.body.followings) {
    return res.status(400).json({ status: "error" });
  }
  if (
    req.body.hasOwnProperty("profilePicture") &&
    typeof req.body.profilePicture === "object" &&
    Object.keys(req.body.profilePicture).length
  ) {
    if (
      !req.body.profilePicture.hasOwnProperty("url") ||
      !req.body.profilePicture.hasOwnProperty("filename")
    ) {
      return res.status(403).json({
        status: "error",
        message:
          "profilePicture propetry most be an object type: {url: <string>, filename: <string>}",
      });
    }
  } else if (
    req.body.hasOwnProperty("profilePicture") &&
    typeof req.body.profilePicture !== "object"
  ) {
    return res.status(403).json({
      status: "error",
      message: "profilePicture propetry most be an object",
    });
  }

  if (
    req.body.hasOwnProperty("coverPicture") &&
    typeof req.body.coverPicture === "object" &&
    Object.keys(req.body.coverPicture).length
  ) {
    if (
      !req.body.coverPicture.hasOwnProperty("url") ||
      !req.body.coverPicture.hasOwnProperty("filename")
    ) {
      return res.status(403).json({
        status: "error",
        message:
          "coverPicture propetry most be an object type: {url: <string>, filename: <string>}",
      });
    }
  } else if (
    req.body.hasOwnProperty("coverPicture") &&
    typeof req.body.coverPicture !== "object"
  ) {
    return res.status(403).json({
      status: "error",
      message: "coverPicture propetry most be an object",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    validateUpdateUser(req, res);
    await User.findByIdAndUpdate(req.user.id, {
      $set: req.body,
    });
    res.status(200).json({ status: "ok" });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ status: "ok" });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err });
  }
};

const getUserByTokenId = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json({ status: "ok", data: other });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

const handler = async (req, res) => {
  if (req.method === "PATCH") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await updateUser(req, res);
  } else if (req.method === "DELETE") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await deleteUser(req, res);
  } else if (req.method === "GET") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await getUserByTokenId(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
