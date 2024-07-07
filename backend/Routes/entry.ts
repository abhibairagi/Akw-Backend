import express from "express";
import {
  createEntry,
  editEntry,
  deleteEntry,
  getEntries,
} from "../Controller/entry";
import { authenticateToken } from "../middleware/auth";
import { Admin } from "../middleware/admin";

import {} from "../validators/userValidator";

const router = express.Router();

// User signup route
router.post("/create", authenticateToken, createEntry);
router.post("/edit/:id", authenticateToken, editEntry);
router.post("/delete/:id", authenticateToken, deleteEntry);
router.get("/all", authenticateToken, getEntries);

export default router;
