// src/pages/api/dashboard.js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const user = req.user;

  if (user.role === "STUDENT") {
    const exercises = await prisma.userExercise.findMany({
      where: { userId: user.id },
    });

    const completed = exercises.filter(e => e.completed).length;
    const pending = exercises.length - completed;
    const avgScore = exercises.length ? (exercises.reduce((sum, e) => sum + (e.score ?? 0), 0) / exercises.length).toFixed(2) : 0;
    const avgTime = exercises.length ? (exercises.reduce((sum, e) => sum + (e.timeSpent ?? 0), 0) / exercises.length).toFixed(2) : 0;
    const avgClicks = exercises.length ? (exercises.reduce((sum, e) => sum + (e.clicks ?? 0), 0) / exercises.length).toFixed(2) : 0;
    const daltonisme = exercises.some(e => e.daltonismeDetected);

    return res.status(200).json({
      type: "STUDENT",
      completed,
      pending,
      avgScore,
      avgTime,
      avgClicks,
      daltonisme
    });
  }

  if (user.role === "TEACHER" || user.role === "ADMIN") {
    // Récupérer tous les groupes gérés par cet enseignant
    const groups = await prisma.group.findMany({
      where: { teacherId: user.id }, // supposition : champ teacherId dans Group
      include: { users: { where: { role: "STUDENT" } } },
    });

    const studentIds = groups.flatMap(g => g.users.map(u => u.id));
    const exercises = await prisma.userExercise.findMany({
      where: { userId: { in: studentIds } },
      include: { user: true }, // inclut nom/prénom
    });

    const completed = exercises.filter(e => e.completed).length;
    const pending = exercises.filter(e => !e.completed).length;
    const avgScore = exercises.length ? (exercises.reduce((sum, e) => sum + (e.score ?? 0), 0) / exercises.length).toFixed(2) : 0;
    const avgTime = exercises.length ? (exercises.reduce((sum, e) => sum + (e.timeSpent ?? 0), 0) / exercises.length).toFixed(2) : 0;
    const lowScores = exercises.filter(e => (e.score ?? 0) < 50).map(e => ({ nom: e.user.nom, prenom: e.user.prenom }));
    const daltonismeStudents = exercises.filter(e => e.daltonismeDetected).map(e => ({ nom: e.user.nom, prenom: e.user.prenom }));

    return res.status(200).json({
      type: "TEACHER",
      totalStudents: studentIds.length,
      completed,
      pending,
      avgScore,
      avgTime,
      lowScores,
      daltonismeStudents
    });
  }

  return res.status(403).json({ message: "Rôle non autorisé" });
};

export default authMiddleware(handler, ["STUDENT", "TEACHER", "ADMIN"]);
