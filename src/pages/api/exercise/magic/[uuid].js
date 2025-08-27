// src/pages/api/exercise/magic/[uuid].js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { uuid } = req.query;
  const { cookieExists } = req.body;

  const magicLink = await prisma.magicLink.findUnique({ where: { url: `https://yoursite.com/exercise/magic/${uuid}` } });
  if (!magicLink) return res.status(404).json({ message: "Lien magique invalide" });

  // Vérifie si un cookie existe pour cet accès
  let accessId;
  if (cookieExists) {
    accessId = `reuse-${Date.now()}`;
  } else {
    accessId = `new-${Date.now()}`;
  }

  // Tirage automatique d'un exercice pour ce lien magique
  const exercises = await prisma.exercise.findMany({ where: { published: true } });
  const exercise = exercises[Math.floor(Math.random() * exercises.length)];

  // Enregistrement dans la table pour suivi
  await prisma.magicLinkAccess.create({
    data: {
      magicLinkId: magicLink.id,
      accessId,
      exerciseId: exercise.id,
      dateAccessed: new Date(),
      cookieExists,
    },
  });

  res.status(200).json({ accessId, exerciseId: exercise.id });
}
