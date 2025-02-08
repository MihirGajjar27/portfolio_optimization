// pages/api/quiz.js
import clientPromise from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { quizResults } = req.body;
  // We assume that during login the cookie "userEmail" is set
  const userEmail = req.cookies.userEmail;

  if (!userEmail) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const client = await clientPromise;
    const db = client.db('portfolio_management');
    // Update the user's document by setting the quiz_results key.
    await db.collection("users").updateOne(
      { email: userEmail },
      { $set: { quiz_results: quizResults } },
      { upsert: true }
    );
    res.status(200).json({ message: "Quiz results saved successfully" });
  } catch (error) {
    console.error("Error saving quiz results:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
