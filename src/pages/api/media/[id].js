// src/pages/api/media/[id].js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const user = req.user;
  const { id } = req.query;

  const media = await prisma.media.findUnique({ where: { id: parseInt(id) } });
  if (!media) return res.status(404).json({ message: "Média introuvable" });

  // Vérification pour élèves selon progression
  if (user.role === "STUDENT") {
    const progress = await prisma.userCourseProgress.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: media.courseId } },
    });
    if (!media.published || !progress || !progress.validated) {
      return res.status(403).json({ message: "Média verrouillé" });
    }
  }

  res.status(200).json(media);
};

export default authMiddleware(handler, ["STUDENT", "TEACHER", "ADMIN"]);
