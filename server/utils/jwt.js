import User from "../models/User";
import jwt from "jsonwebtoken";

export function generateAccessToken(id) {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: "1h",
  });
}

export function generatePasResetToken(id) {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: Math.floor(Date.now() / 1000) + 5 * 60,
  });
}

export function generateRefreshToken(id) {
  return jwt.sign({ id }, process.env.SECRET_RTOKEN, {
    expiresIn: "10d",
  });
}

export async function tokenRefresh(req, res, refreshtoken) {
  var decoded = "";

  try {
    decoded = jwt.verify(refreshtoken, process.env.SECRET_RTOKEN);
  } catch (error) {
    throw { status: 401, message: "Can't refresh Invalid Token" };
  }
  if (decoded) {
    if (decoded.exp * 1000 < Date.now())
      throw { status: 401, message: "Expired token" };
    try {
      const user = await User.findById(decoded.id);
      if (!user) throw { status: 404, message: "User not found" };
      const userId = user._id;
      const rtoken = user.refreshToken;
      if (rtoken !== refreshtoken) {
        await User.updateOne({ _id: userId }, { $unset: { refreshToken: "" } });
        throw { status: 401, message: "Can't refresh. Invalid Token" };
      } else {
        const refreshToken = generateRefreshToken(userId);
        const token = generateAccessToken(userId);
        // setTokenCookie(req, res, Date.now() + 3600, refreshToken);

        await User.updateOne({ _id: userId }, { refreshToken });
        return res.status(200).json({
          message: "Token Refreshed",
          accessToken: token,
          refreshToken,
        });
      }
    } catch (err) {
      console.log(err, "Error occurred while refreshing token");
      return res
        .status(err?.status || 500)
        .json({ message: err.message || "Internal Server Error" });
    }
  }
}

export function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const exp = jwt.decode(token)?.exp;
    if (!exp) return { status: 401, error: "Token is invalid" };
    if (Date.now() >= exp * 1000)
      return { status: 401, expired: true, error: "Your session has expired" };
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECT);
      req.user = decoded;
      return { status: 200, decoded };
    } catch (err) {
      return { status: 401, error: "Token is invalid" };
    }
  } else {
    return { status: 401, error: "You are not authenticated!" };
  }
}
