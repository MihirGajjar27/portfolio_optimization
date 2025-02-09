import clientPromise from "/lib/db";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { firstName, lastName, email, password, confirmPassword } = req.body;

  // Simple check that passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("portfolio_management");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before storing it (using 10 rounds of salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user document
    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    // Insert the new user into the database and get the insertedId
    const result = await db.collection("users").insertOne(newUser);
    const userId = result.insertedId;

    // Generate a session token and set expiry for one week
    const sessionToken = uuidv4();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    // Save the session token in the database
    await db.collection("sessions").insertOne({
      token: sessionToken,
      userId: userId,
      expires: oneWeekFromNow,
    });

    const isProduction = process.env.NODE_ENV === "production";

    // Set the cookies:
    // "session" is kept httpOnly, and "userEmail" is set to httpOnly: false.
    res.setHeader("Set-Cookie", [
      serialize("session", sessionToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
      }),
      serialize("userEmail", email, {
        httpOnly: false,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
    ]);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
