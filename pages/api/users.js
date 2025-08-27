import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { firstName, lastName, password, groupId, yearId } = req.body;
      const newUser = await prisma.user.create({
        data: { firstName, lastName, password, groupId, yearId, role: "student" }
      });
      return res.json(newUser);
    }

    if (req.method === "GET") {
      const users = await prisma.user.findMany({
        include: { group: true, academicYear: true }
      });
      return res.json(users);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
