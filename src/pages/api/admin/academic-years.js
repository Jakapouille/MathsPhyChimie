// src/pages/api/admin/academic-years.js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const method = req.method;

  if (method === "GET") {
    const years = await prisma.academicYear.findMany();
    return res.status(200).json(years);
  }

  if (method === "POST") {
    const { name, active } = req.body;
    const newYear = await prisma.academicYear.create({ data: { name, active } });
    return res.status(201).json(newYear);
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
