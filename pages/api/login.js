// pages/api/login.js
import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { email, password } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("portfolio_management");

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a session token and set expiry for one week
    const sessionToken = uuidv4();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    // Save the session token in the database
    await db.collection("sessions").insertOne({
      token: sessionToken,
      userId: user._id,
      expires: oneWeekFromNow,
    });

    // Set the session and userEmail cookies
    res.setHeader("Set-Cookie", [
      serialize("session", sessionToken, {
        httpOnly: false,
        secure: false,
        domain: "risk-profiling.vercel.app",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
      }),
      serialize("userEmail", email, {
        httpOnly: false,
        secure: false,
        domain: "risk-profiling.vercel.app",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
    ]);

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
