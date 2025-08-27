// src/pages/api/exercise/[id].js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";
import cookie from "cookie";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const user = req.user;
  const { id } = req.query;

  // Gestion lien magique
  const cookies = cookie.parse(req.headers.cookie || "");
  if (req.headers["x-magic-link"] && !cookies[`exercise_${id}`]) {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize(`exercise_${id}`, user.id.toString(), {
        path: "/",
        maxAge: 60 * 60 * 24,
        httpOnly: true,
      })
    );
  }

  // Tirage de l'exercice
  let exercise;
  if (id === "daily") {
    // Tirage aléatoire depuis templates déblocables
    const templates = await prisma.template.findMany({
      where: {
        published: true,
        AND: [
          { minCourseLevel: { lte: user.progressLevel } },
        ],
      },
    });
    if (!templates.length) return res.status(404).json({ message: "Pas d'exercices disponibles" });
    const rand = Math.floor(Math.random() * templates.length);
    exercise = await prisma.exercise.findFirst({
      where: { templateId: templates[rand].id },
      include: { template: true, course: true },
    });
  } else {
    exercise = await prisma.exercise.findUnique({
      where: { id: parseInt(id) },
      include: { template: true, course: true },
    });
  }

  // Vérifier que l'exercice est débloqué pour l'utilisateur
  const progress = await prisma.userCourseProgress.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: exercise.courseId } },
  });
  if (!progress || !progress.validated) return res.status(403).json({ message: "Exercice verrouillé" });

  res.status(200).json({
    id: exercise.id,
    title: exercise.template.title,
    content: exercise.template.content,
  });
};

export default authMiddleware(handler, ["STUDENT", "TEACHER", "ADMIN"]);
