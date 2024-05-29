import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import { verifyToken } from "@/server/utils/jwt";
import { escapeRegex } from "@/server/utils";

const search = async (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    try {
      const users = await User.find({ username: regex });
      res.status(200).json({ status: "ok", data: users });
    } catch (err) {
      res.status(500).json({ status: "error", error: err });
    }
  } else {
    try {
      const users = await User.find({});
      res.status(200).json({ status: "ok", data: users });
    } catch (err) {
      res.status(500).json({ status: "error", error: err });
    }
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    const tokenRes = verifyToken(req, res);
    if (tokenRes.status.toString().includes("4")) {
      return res.status(tokenRes.status).json({ error: tokenRes.error });
    }
    return await search(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
