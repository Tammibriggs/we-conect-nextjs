import { checkUsername } from "@/server/utils";
import connectDB from "@/server/utils/mongodb";

const handleCheckUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const result = await checkUsername(username)

    if (result.exists) {
      return res.status(409).json({ message: "Username already exists", suggestedUsername: result.suggestedUsername });
    }

    return res.status(200).json({ message: "ok" });
  } catch (err) {
    console.log(err, "Error occured while checking username");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    await handleCheckUsername(req, res);
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

export default connectDB(handler);
