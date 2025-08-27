// src/pages/api/course/[id].js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const user = req.user;
  const { id } = req.query;

  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
  });

  if (!course) return res.status(404).json({ message: "Cours introuvable" });

  // Vérification pour élèves : déblocage conditionnel
  if (user.role === "STUDENT") {
    const progress = await prisma.userCourseProgress.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
    });

    if (!course.published || (course.minCourseLevel && (!progress || progress.level < course.minCourseLevel))) {
      return res.status(403).json({ message: "Cours verrouillé" });
    }
  }

  res.status(200).json({
    id: course.id,
    title: course.title,
    content: course.content,
    videoUrl: course.videoUrl,
  });
};

export default authMiddleware(handler, ["STUDENT", "TEACHER", "ADMIN"]);
