// src/middleware/auth.js
import jwt from "jsonwebtoken";

export function authMiddleware(handler, roles = []) {
  return async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Accès interdit" });
      }

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }
  };
}
