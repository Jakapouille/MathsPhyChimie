// src/pages/api/magic-links.js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";
import crypto from "crypto";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const user = req.user;

  if (!["TEACHER", "ADMIN"].includes(user.role)) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  if (req.method === "GET") {
    const groups = await prisma.group.findMany();
    const existingLinks = {};
    for (const group of groups) {
      const linkEntry = await prisma.magicLink.findFirst({ where: { groupId: group.id } });
      if (linkEntry) existingLinks[group.id] = linkEntry.url;
    }
    return res.status(200).json({ groups, links: existingLinks });
  }

  if (req.method === "POST") {
    const groups = await prisma.group.findMany();
    const links = {};
    for (const group of groups) {
      const url = `https://yoursite.com/exercise/magic/${crypto.randomUUID()}`;
      await prisma.magicLink.upsert({
        where: { groupId: group.id },
        update: { url },
        create: { groupId: group.id, url },
      });
      links[group.id] = url;
    }
    return res.status(201).json(links);
  }

  res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
