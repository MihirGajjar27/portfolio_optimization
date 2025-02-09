// components/MultipleChoiceQuestion.js
import React, { useState, useEffect } from "react";

export default function MultipleChoiceQuestion({
  name, // unique name for the radio group (e.g. the question id)
  question,
  answerChoices,
  weights,
  initialValue = "", // default to empty so nothing is preselected
  onAnswerChange,
}) {
  const [selected, setSelected] = useState(initialValue);

  // If the initialValue prop changes (e.g. on state restore), update the local state.
  useEffect(() => {
    setSelected(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    const selectedAnswer = e.target.value;
    setSelected(selectedAnswer);
    const weight = weights[selectedAnswer] || 0;
    onAnswerChange(selectedAnswer, weight);
  };

  return (
    <div className="mb-4">
      <p className="mb-2 font-medium">{question}</p>
      {Object.entries(answerChoices).map(([key, value]) => (
        <div key={key} className="mb-1">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name={name} // use the unique name so that each question is independent
              value={value}
              checked={selected === value}
              onChange={handleChange}
              className="form-radio"
            />
            <span className="ml-2">{value}</span>
          </label>
        </div>
      ))}
    </div>
  );
}
