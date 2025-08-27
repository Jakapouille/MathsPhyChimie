// src/pages/api/auth/logout.js
export default async function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure=${process.env.NODE_ENV === "production"}`
  );
  res.status(200).json({ message: "Déconnecté" });
}
