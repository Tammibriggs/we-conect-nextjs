import connectDB from "@/server/utils/mongodb";
import User from "@/server/models/User";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user)
        return res
          .status(404)
          .json({ status: "error", message: "Invalid Username/Password" });

      const hashPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_ENC_SECT
      );
      const Originalpassword = hashPassword.toString(CryptoJS.enc.Utf8);
      if (Originalpassword !== req.body.password)
        return res
          .status(400)
          .json({ status: "error", message: "Invalid Username/Password" });

      const { password, ...others } = user._doc;

      // generated jwt token login user
      const accessToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECT,
        { expiresIn: "2d" }
      );
      res.status(200).json({ status: "ok", data: { ...others, accessToken } });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "An error occured while trying to login",
      });
    }
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
