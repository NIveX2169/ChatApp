import express from "express";
import { UserModel } from "../../models/auth.js";
import jwt from "jsonwebtoken";
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await UserModel.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await UserModel.create({ username, email, password });
    res
      .status(201)
      .json({ status: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ status: true, message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("accessTokenSocketAuth", token, {
      secure: false,
      maxAge: 1000 * 60 * 60 * 12, // 12 hours in ms
      httpOnly: true,
      sameSite: "lax",
    });
    res.json({
      status: true,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.log("message", error);
    res.status(500).json({ status: false, message: error.message });
  }
});

export const UserAuthRoutes = router;
