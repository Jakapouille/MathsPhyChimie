// src/pages/api/media.js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const user = req.user;
  if (user.role !== "TEACHER" && user.role !== "ADMIN") {
    return res.status(403).json({ message: "Accès refusé" });
  }

  if (req.method === "GET") {
    const medias = await prisma.media.findMany();
    return res.status(200).json(medias);
  }

  if (req.method === "POST") {
    const { title, url, type, courseId, published } = req.body;
    const media = await prisma.media.create({
      data: { title, url, type, courseId, published },
    });
    return res.status(201).json(media);
  }

  if (req.method === "PUT") {
    const { id, title, url, type, published } = req.body;
    const media = await prisma.media.update({
      where: { id: parseInt(id) },
      data: { title, url, type, published },
    });
    return res.status(200).json(media);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    await prisma.media.delete({ where: { id: parseInt(id) } });
    return res.status(204).end();
  }

  res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
