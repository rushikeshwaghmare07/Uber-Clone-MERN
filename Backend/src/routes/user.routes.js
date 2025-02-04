import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser, getUserProfile, logoutUser } from "../controllers/user.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", [
  body("email").isEmail().withMessage("Invalid email"),
  body("fullname.firstname").isLength({ min: 2 }).withMessage("First name must be at least 2 characters long."),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long.")
],
  registerUser
);

router.post("/login", [
  body("email").isEmail().withMessage("Invalid emil"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long.")
],
  loginUser
)

router.get("/profile", authUser, getUserProfile);
router.get("/logout", authUser, logoutUser);
export default router;