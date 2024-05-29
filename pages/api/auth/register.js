import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import CryptoJS from "crypto-js";

const validateCredentials = (req, res) => {
  const { username, password, password1 } = req.body;

  if (!username || typeof username !== "string") {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid username" });
  }
  if (!password || typeof password !== "string") {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid password" });
  } else if (password !== password1) {
    return res
      .status(401)
      .json({ status: "error", message: "Password does not match" });
  } else if (password.length < 5) {
    return res.status(401).json({
      status: "error",
      message: "Password too short. Should be at least 5 characters",
    });
  }
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    validateCredentials(req, res);
    const { username, password } = req.body;
    const encryptedPass = CryptoJS.AES.encrypt(
      password,
      process.env.PASS_ENC_SECT
    ).toString();

    try {
      await User.create({
        username,
        password: encryptedPass,
      });
      res.status(200).json({ status: "ok" });
    } catch (err) {
      // duplicate key error
      if (err.code === 11000) {
        return res.status(409).json({
          status: "error",
          message: "Username already exists",
          error: err,
        });
      }
      res.status(500).json({ status: "error", error: err });
    }
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
