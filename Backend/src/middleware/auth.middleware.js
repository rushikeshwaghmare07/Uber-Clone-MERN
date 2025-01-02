import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized.",
    });
  }

  const isBlacklisted = await userModel.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    console.error("Error occurs while decoded the token:", error);
    return res.status(500).json({ message: "Invalid token" });
  }
};

export default authUser;
