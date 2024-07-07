import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Permission from "../models/permission";

export const create = async (req: Request, res: Response) => {
  const { type } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    let permision = new Permission({
      type,
    });
    let savePermission = await permision.save();

    res.status(201).json({
      message: "Permision registered successfully",
      data: savePermission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const allPermissions = async (req: Request, res: Response) => {
  try {
    let permissions = await Permission.find().select({ type: 1 });

    let formattedPermissions = [];
    for (let index = 0; index < permissions.length; index++) {
      const element = permissions[index];

      formattedPermissions.push(element.type);
    }

    res.status(201).json({
      message: "Permision registered successfully",
      data: formattedPermissions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
