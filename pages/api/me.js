// src/pages/api/me.js
import { authMiddleware } from "@/lib/middleware";

export default async function handler(req, res) {
  const user = await authMiddleware(req, res);
  if (!user) return res.status(401).json({ error: "Non authentifié" });

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    group: user.group,
    academicYear: user.academicYear,
  });
}
