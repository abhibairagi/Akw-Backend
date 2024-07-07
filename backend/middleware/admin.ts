import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

export function Admin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { user } = req;

  if (user && user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "Forbidden Not Allowed" }); // Role is not 'user', send Forbidden error
  }
}
