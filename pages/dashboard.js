// pages/dashboard.js
import React from "react";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import clientPromise from "@/lib/db";

// Helper function to calculate the average score for a section.
function averageScore(section) {
  if (!section) return 0;
  const scores = Object.values(section).map((answer) => answer[1]);
  const sum = scores.reduce((acc, val) => acc + val, 0);
  return scores.length ? sum / scores.length : 0;
}

// Helper function to map an average score to a category.
// You can adjust the thresholds below as needed.
function getCategory(score) {
  if (score < 0.33) return "Conservative";
  if (score < 0.67) return "Moderate";
  return "Aggressive";
}

export default function Dashboard({ loggedIn, userData }) {
  const router = useRouter();

  // If not logged in, prompt for login/signup.
  if (!loggedIn) {
    return (
      <div>
        <Header />
        <div className="flex flex-col items-center pt-20 min-h-screen bg-gray-200 text-black">
          <div className="min-h-fit p-10 bg-white drop-shadow-md rounded-lg flex flex-col">
            <h2 className="text-lg mb-0 text-blue-600 text-start w-full">
              Hmm... I don't think we've met before
            </h2>
            <h2 className="text-4xl mb-8 mt-30 text-start w-full">
              Login or Signup to continue
            </h2>
            <div className="flex gap-4">
              <button
                className="w-20 bg-blue-600 text-blue-200 px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-700 hover:text-blue-100 transition-colors duration-300 hover:border-blue-700"
                onClick={() =>
                  router.push(
                    `/login?destination_url=${encodeURIComponent("/dashboard")}`
                  )
                }
              >
                Login
              </button>
              <button
                className="w-20 bg-blue-200 text-blue-800 px-4 py-2 rounded-lg border border-blue-800 hover:bg-blue-100 hover:text-blue-900 transition-colors duration-300"
                onClick={() =>
                  router.push(
                    `/signup?destination_url=${encodeURIComponent("/dashboard")}`
                  )
                }
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate the average scores for each section.
  const riskTakingAbilityScore = averageScore(
    userData?.quiz_results?.risk_taking_ability
  );
  const riskNeedScore = averageScore(userData?.quiz_results?.risk_willingness);
  const behavioralLossToleranceScore = averageScore(
    userData?.quiz_results?.behavioral_questions
  );

  // Map the average scores to category strings.
  const riskTakingAbility = getCategory(riskTakingAbilityScore);
  const riskNeed = getCategory(riskNeedScore);
  const behavioralLossTolerance = getCategory(behavioralLossToleranceScore);

  console.log(riskTakingAbilityScore, riskNeedScore, behavioralLossToleranceScore);

  return (
    <div>
      <Header />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="mb-4">Welcome, {userData?.email}!</p>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Quiz Results</h2>
          {userData && userData.quiz_results ? (
            <pre>{JSON.stringify(userData.quiz_results, null, 2)}</pre>
          ) : (
            <p>No quiz results available.</p>
          )}
        </div>

        <div className="border p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Portfolio Optimization</h2>
          <div className="mb-2">
            <p>
              <strong>Risk Need Score:</strong>{" "}
              {riskNeedScore.toFixed(2)}{" "}
              <span className="ml-2 text-sm text-gray-700">({riskNeed})</span>
            </p>
          </div>
          <div className="mb-2">
            <p>
              <strong>Risk-Taking Ability Score:</strong>{" "}
              {riskTakingAbilityScore.toFixed(2)}{" "}
              <span className="ml-2 text-sm text-gray-700">
                ({riskTakingAbility})
              </span>
            </p>
          </div>
          <div className="mb-2">
            <p>
              <strong>Behavioral Loss Tolerance Score:</strong>{" "}
              {behavioralLossToleranceScore.toFixed(2)}{" "}
              <span className="ml-2 text-sm text-gray-700">
                ({behavioralLossTolerance})
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = req.cookies.session;
  const loggedIn = Boolean(session);

  // If the user is not logged in, simply pass loggedIn as false.
  if (!loggedIn) {
    return {
      props: { loggedIn },
    };
  }

  // If logged in, fetch the user's data from MongoDB.
  const userEmail = req.cookies.userEmail;

  try {
    const client = await clientPromise;
    const db = client.db("portfolio_management");
    const userData = await db.collection("users").findOne({ email: userEmail });

    return {
      props: {
        loggedIn,
        userData: userData ? JSON.parse(JSON.stringify(userData)) : null,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      props: { loggedIn, userData: null },
    };
  }
}



