// src/pages/api/admin/courses/[id].js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const { id } = req.query;
  const method = req.method;

  if (method === "PUT") {
    const { title, content, type, published, order, videoUrl } = req.body;
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: { title, content, type, published, order, videoUrl },
    });
    return res.status(200).json(updatedCourse);
  }

  if (method === "DELETE") {
    await prisma.course.delete({ where: { id: parseInt(id) } });
    return res.status(200).json({ message: "Cours supprimé" });
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
