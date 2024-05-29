import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import { verifyToken } from "@/server/utils/jwt";

const getUserByParam = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json({ status: "ok", data: other });
  } catch (err) {
    res.status(500).json({ status: "error", error: err });
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await getUserByParam(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
