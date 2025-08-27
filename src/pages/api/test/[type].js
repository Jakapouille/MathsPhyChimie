// src/pages/api/test/[type].js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const user = req.user;
  const { type } = req.query;

  if (req.method === "GET") {
    const testTemplate = await prisma.testTemplate.findFirst({
      where: { type, published: true },
    });
    if (!testTemplate) return res.status(404).json({ message: "Test introuvable" });
    return res.status(200).json(testTemplate);
  }

  if (req.method === "POST") {
    const { answers, duration, clicks } = req.body;
    const testTemplate = await prisma.testTemplate.findFirst({ where: { type } });
    if (!testTemplate) return res.status(404).json({ message: "Test introuvable" });

    await prisma.userTestResult.create({
      data: {
        userId: user.id,
        testTemplateId: testTemplate.id,
        answers: JSON.stringify(answers),
        duration,
        clicks,
        dateTaken: new Date(),
      },
    });

    return res.status(201).json({ message: "Résultat enregistré" });
  }

  res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["STUDENT", "TEACHER", "ADMIN"]);
