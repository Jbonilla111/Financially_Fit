// FoundationsLifeLessons.js
import React, { useState } from "react";
import "./FoundationsLifeLessons.css";


// Define modules with content, exercises, quizzes, and flashcards
const modules = [
  {
    title: "Introduction to Life Insurance",
    duration: "2 min",
    description:
      "Learn what life insurance is, why it matters, and essential terms you need to know.",
    content: [
      "Life insurance ensures your loved ones are financially protected in case of your death.",
      "It can cover debts, living expenses, and future goals like college tuition."
    ],
    flashcards: [
      { term: "Policyholder", definition: "The person who owns the insurance policy." },
      { term: "Beneficiary", definition: "The person or people who receive the payout." },
      { term: "Face Amount", definition: "The amount paid out upon death." },
      { term: "Premium", definition: "Regular payment to keep the policy active." },
      { term: "Cash Value", definition: "Savings component in permanent life insurance." }
    ],
    exercise: {
      prompt: "Enter your expected monthly expenses and years to replace to calculate coverage:",
      inputs: ["Monthly Expenses", "Years", "Existing Assets"],
      calculate: (expenses, years, assets) => expenses * 12 * years - assets,
      outputLabel: "Recommended Face Amount"
    },
    quiz: {
      question: "Who receives the payout from a life insurance policy?",
      options: ["Policyholder", "Beneficiary", "Insurer", "Agent"],
      answer: "Beneficiary"
    }
  },
  {
    title: "Types of Life Insurance",
    duration: "5 min",
    description:
      "Understand term, whole, universal, and variable life insurance, plus other types.",
    content: [
      "Term Life: Temporary coverage, low cost, no cash value.",
      "Whole Life: Permanent coverage, fixed premiums, cash value grows.",
      "Universal Life: Flexible premiums, adjustable death benefit.",
      "Variable Life: Cash value invested in market funds, higher risk/reward."
    ],
    quiz: {
      question: "Which type accumulates cash value?",
      options: ["Term Life", "Whole Life", "Group Insurance", "Key Person Insurance"],
      answer: "Whole Life"
    }
  },
  {
    title: "Life Insurance Riders",
    duration: "5 min",
    description: "Extra benefits you can add to a policy to customize it.",
    content: [
      "Accidental Death Benefit: Extra payout for accidental death.",
      "Waiver of Premium: Premiums waived if disabled.",
      "Guaranteed Insurability: Buy extra coverage without medical exam.",
      "Long-Term Care: Helps cover long-term care expenses."
    ]
  },
  {
    title: "Calculating Life Insurance Needs",
    duration: "10 min",
    description:
      "Learn how to determine the face amount you need using real numbers.",
    exercise: {
      prompt: "Calculate your recommended coverage:",
      inputs: ["Annual Income", "Years to Replace", "Existing Assets"],
      calculate: (income, years, assets) => income * years - assets,
      outputLabel: "Recommended Face Amount"
    }
  },
  {
    title: "Policy Components",
    duration: "10 min",
    content: [
      "Premiums: Fixed vs Flexible.",
      "Cash Value: Can be borrowed or used for emergencies.",
      "Surrender Value: Amount received if policy is canceled.",
      "Dividends: Paid by some permanent policies based on insurer performance."
    ]
  },
  {
    title: "Buying and Managing Life Insurance",
    duration: "10 min",
    content: [
      "Select an insurer with strong reputation and financial stability.",
      "Read and understand policy contracts.",
      "Application & Underwriting: Health questions, medical exams.",
      "Manage your policy: Update beneficiaries, conversions, review coverage."
    ]
  },
  {
    title: "Life Insurance Strategies",
    duration: "5 min",
    content: [
      "Laddering term policies to match financial needs over time.",
      "Using permanent insurance for estate planning or cash accumulation.",
      "Tax considerations: Death benefits usually tax-free.",
      "Protection vs investment: Choose strategy based on goals."
    ]
  },
  {
    title: "Case Studies & Practical Exercises",
    duration: "10 min",
    content: [
      "Scenario 1: Young professional buying term insurance.",
      "Scenario 2: Family planning with whole life insurance.",
      "Calculate face amount and select appropriate riders."
    ],
    exercise: {
      prompt:
        "Estimate coverage for a family with $4,000 monthly expenses for 10 years and $50,000 in assets.",
      inputs: ["Monthly Expenses", "Years", "Existing Assets"],
      calculate: (expenses, years, assets) => expenses * 12 * years - assets,
      outputLabel: "Suggested Coverage"
    }
  },
  {
    title: "Final Quiz",
    duration: "5 min",
    quiz: {
      question: "Term life insurance is:",
      options: [
        "Permanent and accumulates cash value",
        "Temporary and low cost",
        "Cannot be converted",
        "Always pays dividends"
      ],
      answer: "Temporary and low cost"
    }
  }
];

function FoundationsLifeLessons() {
  const [currentModule, setCurrentModule] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState({});
  const [exerciseValues, setExerciseValues] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});

  const module = modules[currentModule];

  const handleExerciseChange = (label, value) =>
    setExerciseValues({ ...exerciseValues, [label]: value });

  const handleExerciseCalculate = (exercise) => {
    const values = exercise.inputs.map((label) => Number(exerciseValues[label] || 0));
    const result = exercise.calculate(...values);
    alert(`${exercise.outputLabel}: ${result}`);
  };

  const handleQuizAnswer = (option) =>
    setQuizAnswers({ ...quizAnswers, [currentModule]: option });

  const goNext = () => currentModule < modules.length - 1 && setCurrentModule(currentModule + 1);
  const goPrev = () => currentModule > 0 && setCurrentModule(currentModule - 1);

  return (
    <div className="lessons-container">
      <h1>Foundations of Life Insurance</h1>
      <div className="module-card">
        <div className="module-header">
          <h2>{module.title}</h2>
          <span>{module.duration}</span>
        </div>
        {module.description && <p className="module-description">{module.description}</p>}
        <ul>
          {module.content?.map((point, i) => <li key={i}>{point}</li>)}
        </ul>

        {/* Flashcards */}
        {module.flashcards && (
          <div className="flashcards-container">
            <h3>Flashcards</h3>
            {module.flashcards.map((f, i) => (
              <div
                key={i}
                className={`flashcard ${flashcardFlipped[i] ? "flipped" : ""}`}
                onClick={() => setFlashcardFlipped({ ...flashcardFlipped, [i]: !flashcardFlipped[i] })}
              >
                {flashcardFlipped[i] ? f.definition : f.term}
              </div>
            ))}
          </div>
        )}

        {/* Exercises */}
        {module.exercise && (
          <div className="exercise-section">
            <p><strong>Exercise:</strong> {module.exercise.prompt}</p>
            {module.exercise.inputs.map((label, i) => (
              <input
                key={i}
                type="number"
                placeholder={label}
                value={exerciseValues[label] || ""}
                onChange={(e) => handleExerciseChange(label, e.target.value)}
              />
            ))}
            <button onClick={() => handleExerciseCalculate(module.exercise)}>Calculate</button>
          </div>
        )}

        {/* Quizzes */}
        {module.quiz && (
          <div className="quiz-section">
            <p><strong>Quiz:</strong> {module.quiz.question}</p>
            {module.quiz.options.map((opt, i) => (
              <button
                key={i}
                className={quizAnswers[currentModule] === opt ? "selected" : ""}
                onClick={() => handleQuizAnswer(opt)}
              >
                {opt}
              </button>
            ))}
            {quizAnswers[currentModule] && (
              <p>
                {quizAnswers[currentModule] === module.quiz.answer
                  ? "✅ Correct!"
                  : `❌ Incorrect. Correct answer: ${module.quiz.answer}`}
              </p>
            )}
          </div>
        )}

        <div className="module-nav">
          <button onClick={goPrev} disabled={currentModule === 0}>← Previous Module</button>
          <button onClick={goNext} disabled={currentModule === modules.length - 1}>Next Module →</button>
        </div>
      </div>
    </div>
  );
}

export default FoundationsLifeLessons;