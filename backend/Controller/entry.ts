import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Entry from "../models/entry";
import User from "../models/user";

// Handle user signup
export const createEntry = async (req: Request, res: Response) => {
  const { name, url } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    // Create new user instance
    const userId = (req as any).user._id as string;
    let entry = new Entry({
      name,
      url,
      userId: userId,
    });

    // Save user to database
    let saveEntry = await entry.save();

    res
      .status(201)
      .json({ message: "Entry registered successfully", data: saveEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getEntries = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id as string;

    const user = await User.findOne({ _id: userId }).select({
      permissions: 1,
    });

    let entries;

    if (user && user.permissions?.includes("View All")) {
      entries = await Entry.find({
        is_deleted: false,
      }).exec();
    } else if (user && user.permissions?.includes("View Own")) {
      entries = await Entry.find({
        userId: userId,
        is_deleted: false,
      }).exec();
    } else {
      return res
        .status(401)
        .json({ message: "You don't have permissions to get Entry", data: {} });
    }

    return res.status(201).json({ message: "All Entries", data: entries });
  } catch (error) {
    console.error("Error retrieving entries:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteEntry = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id as string;

    const user = await User.findOne({ _id: userId })
      .select({ permissions: 1 })
      .sort({ createdAt: -1 });

    if (user && user.permissions?.includes("Delete")) {
      const deleteentry = await Entry.updateOne(
        {
          _id: req.params.id,
          userId: userId,
          is_deleted: false,
        },
        { $set: { is_deleted: true } }
      );
      return res
        .status(201)
        .json({ message: "Deleted Successfully", data: deleteentry });
    }

    res.status(500).json({
      message: "You don't have permisisons to Delete Entry",
      data: {},
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const editEntry = async (req: Request, res: Response) => {
  const { name, url } = req.body;

  try {
    const userId = (req as any).user._id as string;
    const user = await User.findOne({ _id: userId }).select({ permissions: 1 });

    if (user && user.permissions?.includes("Edit")) {
      const editedEntry = await Entry.updateOne(
        {
          _id: req.params.id,
          userId: userId,
          is_deleted: false,
        },
        { $set: { name: name, url: url } }
      );

      return res
        .status(201)
        .json({ message: "Edited Successfully", data: editedEntry });
    }

    return res.status(401).json({
      message: "You don't have permission to edit the Entry",
      data: {},
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
