import User from "@/server/models/User";
import connectDB from "@/server/utils/mongodb";
import { hasDisallowedFields } from "@/server/utils";
import verifySession from "@/server/utils/verifySession";
import { NextApiResponse } from "next";
import { updateUserSchema } from "@/server/utils/yupSchemas";

const updateUser = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    const userId = req.userId;

    let disAllowedFields = [""];

    if (hasDisallowedFields(req.body, disAllowedFields)) {
      console.log("reached");
      return res.status(422).json({
        message:
          'Only the "username", "bio", "profilePicture", "coverPicture" fields are allowed.',
      });
    }
    await updateUserSchema.validate(req.body);

    await User.findByIdAndUpdate(userId, {
      $set: req.body,
    });
    res.status(200).json({ message: "ok" });
  } catch (err) {
    return res.status(500).json({ message: "Interanl Server Error" });
  }
};

const deleteUser = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    const userId = req.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ status: "ok" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUser = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const { password, isAdmin, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json({ message: "Interanl Server Error" });
  }
};

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  if (req.method === "PATCH") {
    return await verifySession(req, res, updateUser);
  } else if (req.method === "DELETE") {
    return await verifySession(req, res, deleteUser);
  } else if (req.method === "GET") {
    return await verifySession(req, res, getUser);
  } else {
    res.status(405).send("Not Allowed");
  }
};

export default connectDB(handler);
