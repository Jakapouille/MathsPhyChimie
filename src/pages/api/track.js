// src/pages/api/track.js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const user = req.user;

  if (req.method === "POST") {
    const { pageId, clicks, timeSpent, copied, scrollDepth, exerciseId, templateId } = req.body;

    await prisma.userActivity.create({
      data: {
        userId: user.id,
        pageId,
        exerciseId: exerciseId || null,
        templateId: templateId || null,
        clicks,
        timeSpent,
        copied,
        scrollDepth,
        date: new Date(),
      },
    });

    return res.status(201).json({ message: "Suivi enregistré" });
  }

  res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["STUDENT", "TEACHER", "ADMIN"]);
