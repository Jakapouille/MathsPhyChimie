// Exemple d'utilisation dans une API route
// src/pages/api/protected/example.js
import { authMiddleware } from "@/middleware/auth";

const handler = async (req, res) => {
  res.status(200).json({ message: `Bonjour ${req.user.userId}, accès autorisé !` });
};

export default authMiddleware(handler, ["STUDENT", "TEACHER", "ADMIN"]);
