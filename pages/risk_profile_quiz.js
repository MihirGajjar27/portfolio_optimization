// pages/risk-profile-quiz.js
import React, { useState, useEffect, useRef } from "react";
import MultipleChoiceQuestion from "@/components/MultipleChoiceQuestion";
import Header from "@/components/Header";
import { useRouter } from "next/router";

export default function RiskProfileQuiz({ loggedIn }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [quizResults, setQuizResults] = useState({
    risk_taking_ability: {},
    risk_willingness: {},
    behavioral_questions: {},
  });
  const [message, setMessage] = useState("");

  // For dynamic progress bar measurement.
  const progressContainerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    // Function to update the container width.
    const updateWidth = () => {
      if (progressContainerRef.current) {
        setContainerWidth(progressContainerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Calculate the fill width.
  // For three steps, the fill should be:
  // Step 1: 0px; Step 2: containerWidth/2; Step 3: containerWidth;
  // When currentStep >= 4 (on submission), we set it to containerWidth.
  const fillWidth =
    currentStep >= 4 ? containerWidth : containerWidth * ((currentStep - 1) / (3 - 1));

  // Restore state from localStorage on mount.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedQuizResults = localStorage.getItem("quizResults");
      const storedCurrentStep = localStorage.getItem("currentStep");
      if (storedQuizResults) {
        setQuizResults(JSON.parse(storedQuizResults));
      }
      if (storedCurrentStep) {
        setCurrentStep(parseInt(storedCurrentStep, 10));
      }
    }
  }, []);

  // Persist quizResults and currentStep to localStorage whenever they change.
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("quizResults", JSON.stringify(quizResults));
    }
  }, [quizResults]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentStep", currentStep);
    }
  }, [currentStep]);

  // Define questions for each step.
  const step1Questions = [
    {
      id: "q1",
      question: "What is your current annual income?",
      answerChoices: {
        option1: "< $50K",
        option2: "$50K - $100K",
        option3: "$100K - $250K",
        option4: "250K+",
      },
      weights: {
        "< 50K": 0,
        "$50K - $100K": 1 / 3,
        "$100K - $250K": 2 / 3,
        "250K+": 1.0,
      },
    },
    {
      id: "q2",
      question: "What percentage of your income do you save or invest annually?",
      answerChoices: {
        option1: "< 10%",
        option2: "10% - 20%",
        option3: "20% - 40%",
        option4: "40% +",
      },
      weights: {
        "< 10%": 0,
        "10% - 20%": 1 / 3,
        "20% - 40%": 2 / 3,
        "40% +": 1.0,
      },
    },
    {
      id: "q3",
      question:
        "What is the total value of your liquid assets (cash, stocks, bonds, etc)?",
      answerChoices: {
        option1: "< $50K",
        option2: "$50K - $250K",
        option3: "$250K - $1M",
        option4: "1M +",
      },
      weights: {
        "< 50K": 0,
        "$50K - $250K": 1 / 3,
        "$250K - $1M": 2 / 3,
        "1M +": 1.0,
      },
    },
    {
      id: "q4",
      question:
        "How many years until you plan to start withdrawing from your investments?",
      answerChoices: {
        option1: "0 - 5 years",
        option2: "6 - 10 years",
        option3: "11 - 20 years",
        option4: "20 + years",
      },
      weights: {
        "0 - 5 years": 0,
        "6 - 10 years": 1 / 3,
        "11 - 20 years": 2 / 3,
        "20 + years": 1,
      },
    },
    {
      id: "q5",
      question: "What is your primary source of income?",
      answerChoices: {
        option1: "No Income",
        option2: "Pension, Retirement, or Welfare",
        option3: "Salary",
        option4: "Business Income",
        option5: "Passive Investments",
      },
      weights: {
        "No Income": 0,
        "Pension, Retirement, or Welfare": 0.25,
        Salary: 0.5,
        "Business Income": 0.75,
        "Passive Investments": 1,
      },
    },
    {
      id: "q6",
      question:
        "How much of the past five years have you spent unemployed?",
      answerChoices: {
        option1: "Less than 3 months",
        option2: "Less than 6 months",
        option3: "Less than 1 year",
        option4:
          'Fully employed during the past five years/retired/taking a break from work',
      },
      weights: {
        "Less than 3 months": 0,
        "Less than 6 months": 1 / 3,
        "Less than 1 year": 2 / 3,
        "Fully employed during the past five years/retired/taking a break from work": 1,
      },
    },
  ];

  const step2Questions = [
    {
      id: "q1",
      question:
        "If your portfolio dropped 20% in value in one year, how would you react?",
      answerChoices: {
        option1: "Sell Everything",
        option2: "Sell some and wait",
        option3: "Hold",
        option4: "Buy More",
      },
      weights: {
        "Sell Everything": 0,
        "Sell some and wait": 1 / 3,
        Hold: 2 / 3,
        "Buy More": 1,
      },
    },
    {
      id: "q2",
      question:
        "What level of annual returns are you comfortable targeting",
      answerChoices: {
        option1: "3% - 5%",
        option2: "5% - 8%",
        option3: "8% - 12%",
        option4: "12% +",
      },
      weights: {
        "3% - 5%": 0,
        "5% - 8%": 1 / 3,
        "8% - 12%": 2 / 3,
        "12% +": 1,
      },
    },
    {
      id: "q3",
      question:
        "How likely are you to undertake an investment opportunity with a 50% chance of doubling your money but a 50% chance of losing it?",
      answerChoices: {
        option1: "Never",
        option2: "Unlikely",
        option3: "Possibly",
        option4: "Definitely",
      },
      weights: {
        Never: 0,
        Unlikely: 1 / 3,
        Possibly: 2 / 3,
        Definitely: 1,
      },
    },
    {
      id: "q4",
      question: "Which investment opportunity is most attractive to you?",
      answerChoices: {
        option1: "4% return, no risk",
        option2: "6% return, low loss potential",
        option3: "10% return, moderate loss potential",
        option4: "15% return, unknown loss potential",
      },
      weights: {
        "4% return, no risk": 0,
        "6% return, low loss potential": 1 / 3,
        "10% return, moderate loss potential": 2 / 3,
        "15% return, unknown loss potential": 1,
      },
    },
    {
      id: "q5",
      question:
        "Over the last five years, how have you typically allocated new investments?",
      answerChoices: {
        option1: "Mostly cash & bonds",
        option2: "Balanced mix",
        option3: "Mostly Stocks",
        option4: "High-risk assets",
      },
      weights: {
        "Mostly cash & bonds": 0,
        "Balanced mix": 1 / 3,
        "Mostly Stocks": 2 / 3,
        "High-risk assets": 1,
      },
    },
  ];

  const step3Questions = [
    {
      id: "q1",
      question:
        "How do you usually react to financial news that suggests a market downturn?",
      answerChoices: {
        option1: "Panic & Sell",
        option2: "Reassess & Adjust",
        option3: "Stay Invested",
        option4: "See it as a buying opportunity",
      },
      weights: {
        "Panic & Sell": 0,
        "Reassess & Adjust": 1 / 3,
        "Stay Invested": 2 / 3,
        "See it as a buying opportunity": 1,
      },
    },
    {
      id: "q2",
      question:
        "Do you prefer stability over higher potential returns in your investments?",
      answerChoices: {
        option1: "Strongly Agree",
        option2: "Somewhat Agree",
        option3: "Somewhat Disagree",
        option4: "Strongly Disagree",
      },
      weights: {
        "Strongly Agree": 0,
        "Somewhat Agree": 1 / 3,
        "Somewhat Disagree": 2 / 3,
        "Strongly Disagree": 1,
      },
    },
    {
      id: "q3",
      question: "What is your experience with investing?",
      answerChoices: {
        option1: "None",
        option2: "Minimal",
        option3: "Moderate",
        option4: "Extensive",
      },
      weights: {
        None: 0,
        Minimal: 1 / 3,
        Moderate: 2 / 3,
        Extensive: 1,
      },
    },
    {
      id: "q4",
      question: "How frequently do you monitor your investment portfolio?",
      answerChoices: {
        option1: "Daily",
        option2: "Weekly",
        option3: "Monthly",
        option4: "Rarely",
      },
      weights: {
        Daily: 0,
        Weekly: 1 / 3,
        Monthly: 2 / 3,
        Rarely: 1,
      },
    },
    {
      id: "q5",
      question:
        "If a friend or financial news suggests a different investment strategy than your plan, how likely are you to change your investment approach",
      answerChoices: {
        option1: "Very Likely",
        option2: "Somewhat Likely",
        option3: "Unlikely",
        option4: "Not at all",
      },
      weights: {
        "Very Likely": 0,
        "Somewhat Likely": 1 / 3,
        Unlikely: 2 / 3,
        "Not at all": 1,
      },
    },
  ];

  // Determine the title, questions, and state key based on the current step.
  let sectionTitle = "";
  let questions = [];
  let sectionKey = "";
  if (currentStep === 1) {
    sectionTitle = "Risk-Taking Ability";
    questions = step1Questions;
    sectionKey = "risk_taking_ability";
  } else if (currentStep === 2) {
    sectionTitle = "Risk-Willingness";
    questions = step2Questions;
    sectionKey = "risk_willingness";
  } else if (currentStep === 3) {
    sectionTitle = "Behavioral Questions";
    questions = step3Questions;
    sectionKey = "behavioral_questions";
  }

  // Validate that every question in the current step has an answer.
  const validateCurrentStep = () => {
    for (let q of questions) {
      if (
        !quizResults[sectionKey] ||
        typeof quizResults[sectionKey][q.id] === "undefined" ||
        quizResults[sectionKey][q.id][0].trim() === ""
      ) {
        return false;
      }
    }
    return true;
  };

  // Validate that every question across all sections has been answered.
  const validateAllSections = () => {
    const steps = [
      { key: "risk_taking_ability", questions: step1Questions },
      { key: "risk_willingness", questions: step2Questions },
      { key: "behavioral_questions", questions: step3Questions },
    ];
    for (let step of steps) {
      for (let q of step.questions) {
        if (
          !quizResults[step.key] ||
          typeof quizResults[step.key][q.id] === "undefined" ||
          quizResults[step.key][q.id][0].trim() === ""
        ) {
          return false;
        }
      }
    }
    return true;
  };

  // Update answer for a question and clear any error message.
  const handleAnswerChange = (questionId, answer, weight) => {
    setQuizResults((prevResults) => ({
      ...prevResults,
      [sectionKey]: {
        ...prevResults[sectionKey],
        [questionId]: [answer, weight],
      },
    }));
    setMessage("");
  };

  // "Next" button handler.
  const handleNext = () => {
    if (!validateCurrentStep()) {
      setMessage("Please answer all questions in this section before continuing.");
      return;
    }
    setMessage("");
    setCurrentStep(currentStep + 1);
  };

  // Final submission handler.
  const handleSubmit = async () => {
    if (!validateAllSections()) {
      setMessage("Please answer all questions before submitting.");
      return;
    }
    setMessage("");
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizResults }),
      });
      if (res.ok) {
        setMessage("Quiz submitted successfully!");
        localStorage.removeItem("quizResults");
        localStorage.removeItem("currentStep");
        // Set the progress bar to 100% by updating currentStep to 4.
        setCurrentStep(4);
        // Slight delay to allow the user to see the full progress bar before redirecting.
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        setMessage("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setMessage("Submission failed. Please try again.");
    }
  };

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
                    `/login?destination_url=${encodeURIComponent("/risk_profile_quiz")}`
                  )
                }
              >
                Login
              </button>
              <button
                className="w-20 bg-blue-200 text-blue-800 px-4 py-2 rounded-lg border border-blue-800 hover:bg-blue-100 hover:text-blue-900 transition-colors duration-300"
                onClick={() =>
                  router.push(
                    `/signup?destination_url=${encodeURIComponent("/risk_profile_quiz")}`
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

  return (
    <div className="bg-gray-100">
      <Header />

      {/* Progress Bar with Circular Steps */}
      <div className="sticky top-0 z-50 bg-gray-100 border-t border-b border-gray-800 py-2 overflow-hidden">
        <div
          ref={progressContainerRef}
          className="w-full max-w-xl mx-auto px-4 relative"
        >
          {/* Gray background line */}
          <div className="absolute top-1/2 transform -translate-y-1/2 max-w-[100px] min-w-[520px] h-1 bg-gray-300"></div>
          {/* Blue progress line: width based on measured containerWidth, animated */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 bg-blue-600 h-1 transition-all duration-500 ease-in-out"
            style={{ width: `${fillWidth - (fillWidth * 0.1)}px` }}
          ></div>
          {/* Step circles */}
          <div className="flex justify-between relative">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ease-in-out ${
                  currentStep > step ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
                }`}
              >
                {currentStep > step && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-200 text-black p-5 px-10">
        <div className="w-full py-10 flex justify-center">
          <div className="flex flex-col w-full p-10 bg-gray-100 backdrop-blur-2xl rounded-lg drop-shadow-lg max-w-3xl">
            {/* Quiz Questions */}
            <h2 className="text-3xl font-medium mb-6">{sectionTitle}</h2>
            {questions.map((q) => (
              <MultipleChoiceQuestion
                key={q.id}
                name={q.id} // unique name for each radio group
                question={q.question}
                answerChoices={q.answerChoices}
                weights={q.weights}
                initialValue={
                  quizResults[sectionKey] && quizResults[sectionKey][q.id]
                    ? quizResults[sectionKey][q.id][0]
                    : ""
                }
                onAnswerChange={(answer, weight) =>
                  handleAnswerChange(q.id, answer, weight)
                }
              />
            ))}
            {message && (
              <p
                className={`mt-4 text-center text-lg ${
                  message === "Quiz submitted successfully!"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
            <div className="flex justify-center mt-8 items-center space-x-2">
              {currentStep > 1 ? (
                <button
                  className="text-2xl px-4 py-1 bg-gray-200 rounded-lg transition-colors duration-300 border-1 border-gray-400 hover:border-blue-500"
                  onClick={() => {
                    setMessage("");
                    setCurrentStep(currentStep - 1);
                  }}
                >
                  <div className={"flex flex-nowrap flex-row text-base space-x-2"}>
                    <p>←</p>
                    {/*<p>Prev</p>*/}
                  </div>
                </button>
              ) : (
                <div></div>
              )}
              {currentStep < 3 ? (
                <button className="text-2xl px-4 py-1 bg-gray-200 rounded-lg transition-colors duration-300 border-1 border-gray-400 hover:border-blue-500" onClick={handleNext}>
                  <div className={"flex flex-nowrap flex-row text-base space-x-2"}>
                    {/*<p>Next</p>*/}
                    <p>→</p>
                  </div>
                </button>
              ) : (
                <button
                  className="bg-blue-600 text-white py-1 px-2 rounded mx-auto"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              )}
            </div>
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
  return {
    props: { loggedIn },
  };
}
