import { userModel } from "../models/user.model.js";
import createUser from "../services/user.service.js";
import { validationResult } from "express-validator";

// Register user
const registerUser = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { fullname, email, password } = req.body;

  const hashedPassword = await userModel.hashPassword(password);

  const user = await createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();

  res.status(201).json({ token, user });
};

// Login user
const loginUser = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty) {
    return res.status(400).json({ error: error.array() });
  } 

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("token", token, options);

  res.status(200).json({ token, user });
}

// user profile
const getUserProfile = async (req, res) => {
  return res.status(200).json( req.user );
}

export {
  registerUser,
  loginUser,
  getUserProfile,
};
