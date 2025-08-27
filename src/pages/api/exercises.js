// src/pages/api/exercises.js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const userId = req.user.id;

  if (req.method === "GET") {
    // Récupère les exercices assignés à l'utilisateur avec course et template
    const exercises = await prisma.userExercise.findMany({
      where: { userId },
      include: {
        course: true,
        template: true,
      },
    });
    return res.status(200).json(exercises);
  }

  if (req.method === "POST") {
    // Création d'un nouvel exercice pour un utilisateur ou groupe
    const { templateId, courseId, assignToGroup } = req.body;

    let assignments = [];
    if (assignToGroup) {
      const users = await prisma.user.findMany({ where: { groupId: assignToGroup } });
      assignments = users.map(u => ({
        userId: u.id,
        templateId,
        courseId,
        assignedAt: new Date(),
      }));
      await prisma.userExercise.createMany({ data: assignments });
    } else {
      assignments.push({
        userId,
        templateId,
        courseId,
        assignedAt: new Date(),
      });
      await prisma.userExercise.create({ data: assignments[0] });
    }

    return res.status(201).json({ message: "Exercice assigné" });
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["STUDENT", "TEACHER", "ADMIN"]);
