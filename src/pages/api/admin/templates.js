// src/pages/api/admin/templates.js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const method = req.method;

  if (method === "GET") {
    const templates = await prisma.template.findMany();
    return res.status(200).json(templates);
  }

  if (method === "POST") {
    const { type, configuration } = req.body;
    const newTemplate = await prisma.template.create({ data: { type, configuration } });
    return res.status(201).json(newTemplate);
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
