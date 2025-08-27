// src/pages/api/admin/courses.js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const method = req.method;

  if (method === "GET") {
    const courses = await prisma.course.findMany();
    return res.status(200).json(courses);
  }

  if (method === "POST") {
    const { title, content, type, published, order, videoUrl } = req.body;
    const newCourse = await prisma.course.create({
      data: { title, content, type, published, order, videoUrl },
    });
    return res.status(201).json(newCourse);
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
