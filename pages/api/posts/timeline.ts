import Post from "@/server/models/Post";
import connectDB from "@/server/utils/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const getTimelinePosts = async (
  req: CustomNextApiRequest,
  res: NextApiResponse
) => {
  try {
    const page = parseInt(req.query?.page as string) || 1; // Current page, default to 1
    const limit = parseInt(req.query?.limit as string) || 15; // Results per page, default to 10
    const postsData = await Post.aggregate([
      {
        $project: {
          desc: 1,
          img: 1,
          userId: 1,
          likes: 1,
          likesCount: { $size: "$likes" },
          comments: 1,
          createdAt: 1,
        },
      },
      { $sort: { likesCount: -1 } },
      { $skip: (page - 1) * limit }, // Skip to the desired page
      { $limit: limit }, // Limit the number of results
    ]);

    const totalCount = await Post.countDocuments();

    // Format response for ease of access
    const result = {
      posts: postsData,
      totalCount: postsData[0].totalCount || 0, // Default to 0 if no posts
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return await getTimelinePosts(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
