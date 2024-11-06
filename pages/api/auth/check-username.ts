import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";

const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      return res.status(409).json({ message: "Username already exists" });
    }

    return res.status(200).json({ message: "ok" });
  } catch (err) {
    console.log(err, "Error occured while checking username");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    await checkUsername(req, res);
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

export default connectDB(handler);
