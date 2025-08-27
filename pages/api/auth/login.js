// src/pages/api/auth/login.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email et mot de passe requis" });

  try {
    const user = await prisma.user.findUnique({ where: { firstName: email } }); // utiliser email si ajouté
    if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });

    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax; Secure=${process.env.NODE_ENV === "production"}`
    );

    res.status(200).json({ message: "Connecté avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}
