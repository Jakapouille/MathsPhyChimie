// src/pages/api/admin/users.js
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/auth";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  const method = req.method;

  if (method === "GET") {
    const users = await prisma.user.findMany({
      include: { group: true, academicYear: true },
    });
    return res.status(200).json(users);
  }

  if (method === "POST") {
    const { firstName, lastName, password, groupId, academicYearId, role } = req.body;
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { firstName, lastName, password: hashedPassword, groupId, academicYearId, role },
      include: { group: true, academicYear: true },
    });

    return res.status(201).json(newUser);
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
};

export default authMiddleware(handler, ["TEACHER", "ADMIN"]);
