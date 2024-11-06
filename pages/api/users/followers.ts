import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import verifySession from "@/server/utils/verifySession";

const getFollowers = async (
  req: CustomNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const followers = await Promise.all(
      user.followers.map(async (id) => {
        const follower = await User.findById(id);
        const following = follower.followers.includes(userId); // check if following this user
        return {
          id: follower._id,
          username: follower.username,
          image: follower.profilePicture,
          following,
        };
      })
    );
    res.status(200).json({ data: followers });
  } catch (err) {
    console.log(err, "Error occured while getting followers");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return await verifySession(req, res, getFollowers);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
