// src/pages/api/admin/users/[id].js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const { id } = req.query;
  const method = req.method;

  if (method === "PUT") {
    const { firstName, lastName, password, groupId, academicYearId, role } = req.body;
    const updateData = { firstName, lastName, groupId, academicYearId, role };
    if (password) {
      const bcrypt = require("bcryptjs");
      updateData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await prisma.user.update({ where: { id: parseInt(id) }, data: updateData });
    return res.status(200).json(updatedUser);
  }

  if (method === "DELETE") {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ message: "Utilisateur supprimé" });
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
