import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import verifySession from "@/server/utils/verifySession";
import { NextApiRequest, NextApiResponse } from "next";

const getFollowing = async (
  req: CustomNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const following = await Promise.all(
      user.followings.map(async (id) => {
        const follow = await User.findById(id);
        return {
          id: follow._id,
          username: follow.username,
          image: follow.profilePicture,
        };
      })
    );
    res.status(200).json({ data: following });
  } catch (err) {
    console.log(err, "Error occured while getting followings");
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return await verifySession(req, res, getFollowing);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
