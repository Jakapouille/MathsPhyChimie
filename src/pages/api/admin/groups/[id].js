// src/pages/api/admin/groups/[id].js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const { id } = req.query;
  const method = req.method;

  if (method === "PUT") {
    const { name, academicYearId } = req.body;
    const updatedGroup = await prisma.group.update({
      where: { id: parseInt(id) },
      data: { name, academicYearId },
    });
    return res.status(200).json(updatedGroup);
  }

  if (method === "DELETE") {
    await prisma.group.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ message: "Groupe supprimé" });
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
