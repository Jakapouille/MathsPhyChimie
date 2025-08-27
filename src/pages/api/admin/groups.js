// src/pages/api/admin/groups.js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const method = req.method;

  if (method === "GET") {
    const groups = await prisma.group.findMany({ include: { academicYear: true } });
    return res.status(200).json(groups);
  }

  if (method === "POST") {
    const { name, academicYearId } = req.body;
    const newGroup = await prisma.group.create({
      data: { name, academicYearId },
      include: { academicYear: true },
    });
    return res.status(201).json(newGroup);
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
