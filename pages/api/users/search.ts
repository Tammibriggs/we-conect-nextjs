import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";

const search = async (req, res) => {
  try {
    let users: User[];
    const limit = 10;
    const query = req.query.search;

    if (query) {
      // Search for users that match the query using MongoDB full-text search
      users = await User.aggregate([
        {
          $search: {
            index: "default",
            compound: {
              should: [
                {
                  autocomplete: {
                    query: query,
                    path: "username",
                    fuzzy: {
                      maxEdits: 2, // Allows for typo tolerance
                      prefixLength: 1,
                    },
                  },
                },
                {
                  text: {
                    query: query,
                    path: "username",
                    fuzzy: {
                      maxEdits: 1, // Enables typo tolerance for full-text search
                    },
                  },
                },
              ],
            },
          },
        },
        { $sort: { score: -1 } },
        { $limit: limit },
      ]);
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Interanl Server Error" });
  }
};

const handler = async (req, res) => {
  if (req.method === "GET") {
    return await search(req, res);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
