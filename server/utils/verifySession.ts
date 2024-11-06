import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

const verifySession = async (
  req: NextApiRequest,
  res: NextApiResponse,
  handler: CustomRequestHandler
) => {
  const session: AuthSession | null = await getServerSession(
    req,
    res,
    authOptions
  );

  if (!session) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  const customRequest = req as CustomNextApiRequest;
  customRequest.userId = session.user._id;

  return handler(customRequest, res);
};

export default verifySession;
