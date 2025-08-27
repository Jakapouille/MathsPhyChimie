// src/pages/api/exercises/[id].js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const { id } = req.query;
  const userId = req.user.id;

  if (req.method === "GET") {
    const exercise = await prisma.userExercise.findFirst({
      where: { id: parseInt(id), userId },
      include: { course: true, template: true },
    });
    if (!exercise) return res.status(404).json({ message: "Exercice non trouvé" });
    return res.status(200).json(exercise);
  }

  if (req.method === "PUT") {
    const { completed, score, timeSpent, clicks, copied } = req.body;
    const updated = await prisma.userExercise.update({
      where: { id: parseInt(id) },
      data: { completed, score, timeSpent, clicks, copied },
    });
    return res.status(200).json(updated);
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["STUDENT", "TEACHER", "ADMIN"]);
