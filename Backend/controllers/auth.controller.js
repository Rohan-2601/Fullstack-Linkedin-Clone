import genToken from "../config/Token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    // Destructure values
    const { firstName, lastName, userName, email, password } = req.body;

    // Basic validation
    if (!firstName || !lastName || !userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // Check for existing email and username
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existUsername = await User.findOne({ userName });
    if (existUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword
    });

    // Generate token and set cookie
    const token = await genToken(user._id);
   res.cookie("token", token, {
  httpOnly: true,
 secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 30 * 24 * 60 * 60 * 1000
});


    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};


export const login = async (req, res) => {
  try {
    // Destructure values
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token and set cookie
    const token = await genToken(user._id);
    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // false on localhost, true on Render
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
});

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }

}

export const logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
