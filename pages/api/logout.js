import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const isProduction = process.env.NODE_ENV === "production";

  // Clear the cookies by setting them with an expired date.
  // Note: "userEmail" is cleared with httpOnly: false to match login.
  res.setHeader("Set-Cookie", [
    serialize("session", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    }),
    serialize("userEmail", "", {
      httpOnly: false,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    }),
  ]);

  res.status(200).json({ message: "Logged out successfully" });
}
