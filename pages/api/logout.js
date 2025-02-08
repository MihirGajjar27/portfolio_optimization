// pages/api/logout.js
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // Clear both the session and userEmail cookies by setting an expired date
  res.setHeader("Set-Cookie", [
    serialize("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    }),
    serialize("userEmail", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    }),
  ]);

  res.status(200).json({ message: "Logged out successfully" });
}
