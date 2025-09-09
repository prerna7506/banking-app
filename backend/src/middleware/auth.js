import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      req.user = null;
      return next?.();
    }

    const [, token] = authHeader.split(" "); // Expecting "Bearer <token>"

    if (!token) {
      req.user = null;
      return next?.();
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    req.user = null;
  }

  if (typeof next === "function") {
    next();
  }
};