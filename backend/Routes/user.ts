import express from "express";
import {
  signup,
  signinUser,
  permissionChecker,
  allUsers,
  editPermission,
} from "../Controller/user";
import { validateSignup, validateSignin } from "../validators/userValidator";
import { authenticateToken } from "../middleware/auth";
import { Admin } from "../middleware/admin";

const router = express.Router();

// User signup route
router.post("/signup", validateSignup, signup);
router.post("/signin", validateSignin, signinUser);
router.post("/checker/:permision", authenticateToken, permissionChecker);
router.get("/all", authenticateToken, Admin, allUsers);
router.post("/permission/:id", authenticateToken, Admin, editPermission);

export default router;
