// src/pages/api/admin/templates/[id].js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const { id } = req.query;
  const method = req.method;

  if (method === "PUT") {
    const { type, configuration } = req.body;
    const updatedTemplate = await prisma.template.update({
      where: { id: parseInt(id) },
      data: { type, configuration },
    });
    return res.status(200).json(updatedTemplate);
  }

  if (method === "DELETE") {
    await prisma.template.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ message: "Template supprimé" });
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
