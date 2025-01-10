import { userModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { BlacklistToken } from "../models/blacklistToken.model.js";
import { captainModel } from "../models/captain.model.js";

const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized.",
    });
  }

  const isBlacklisted = await BlacklistToken.findOne({ token: token });
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

const authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await BlacklistToken.findOne({ token: token });

  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decodedToken._id);
    if (!captain) {
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }

    req.captain = captain;

    return next();
  } catch (error) {
    console.error("Error occurs while decoded the token:", error);
    return res.status(500).json({ message: "Invalid token" });
  }
};

export {
  authUser,
  authCaptain,
};
