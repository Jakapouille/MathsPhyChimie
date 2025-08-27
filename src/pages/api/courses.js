// src/pages/api/courses.js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const user = req.user;

  if (user.role !== "TEACHER" && user.role !== "ADMIN") {
    return res.status(403).json({ message: "Accès refusé" });
  }

  if (req.method === "GET") {
    const courses = await prisma.course.findMany();
    return res.status(200).json(courses);
  }

  if (req.method === "POST") {
    const { title, content, videoUrl, published, minCourseLevel } = req.body;
    const course = await prisma.course.create({
      data: { title, content, videoUrl, published, minCourseLevel },
    });
    return res.status(201).json(course);
  }

  if (req.method === "PUT") {
    const { id, title, content, videoUrl, published, minCourseLevel } = req.body;
    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: { title, content, videoUrl, published, minCourseLevel },
    });
    return res.status(200).json(course);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    await prisma.course.delete({ where: { id: parseInt(id) } });
    return res.status(204).end();
  }

  res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
