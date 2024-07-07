import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/user"; // Adjust the path based on your project structure

// Handle user signup
export const signup = async (req: Request, res: Response) => {
  const { full_name, email, password, permissions } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create new user instance
    user = new User({
      full_name,
      email,
      password,
      permissions,
    });

    // Save user to database
    let saveUser = await user.save();

    res.status(201).json({ message: "User registered successfully", data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const signinUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      {
        expiresIn: "12h",
      }
    );

    // Return a success message or token for authentication
    res
      .status(200)
      .json({ message: "User signin successful", data: { user, token } });
  } catch (error) {
    res.status(500).json({ message: "User signin failed" });
  }
};

export const permissionChecker = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id as string;

    const user = await User.findOne({ _id: userId }).select({ permissions: 1 });

    if (user && user.permissions?.includes(req.params.permision)) {
      return res.status(200).json({ message: "Permission Access", data: true });
    }

    return res
      .status(500)
      .json({ message: "You don't have Permision", data: false });
  } catch (error) {
    res.status(500).json({ message: "Unable to Find Permission" });
  }
};

export const allUsers = async (req: Request, res: Response) => {
  try {
    const user = await User.find({ role: "user" }).select({
      permissions: 1,
      full_name: 1,
      email: 1,
    });

    return res.status(201).json({ message: "All Users", data: user });
  } catch (error) {
    res.status(500).json({ message: "Unable to find all Users" });
  }
};

export const editPermission = async (req: Request, res: Response) => {
  try {
    const user = await User.updateOne(
      { _id: req.params.id, role: "user" },
      { $set: { permissions: req.body.permissions } }
    );

    return res.status(201).json({ message: "Permission Updated", data: user });
  } catch (error) {
    res.status(500).json({ message: "Unable to find all Users" });
  }
};
