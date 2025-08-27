// src/pages/api/admin/academic-years/[id].js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const { id } = req.query;
  const method = req.method;

  if (method === "PUT") {
    const { name, active } = req.body;
    const updatedYear = await prisma.academicYear.update({
      where: { id: parseInt(id) },
      data: { name, active },
    });
    return res.status(200).json(updatedYear);
  }

  if (method === "DELETE") {
    await prisma.academicYear.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ message: "Année scolaire supprimée" });
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
