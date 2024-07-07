import express from "express";
import { create, allPermissions } from "../Controller/permission";
import { authenticateToken } from "../middleware/auth";
import { Admin } from "../middleware/admin";

import {} from "../validators/userValidator";

const router = express.Router();

// User signup route
router.post("/create", authenticateToken, Admin, create);
router.get("/all", authenticateToken, Admin, allPermissions);

export default router;
