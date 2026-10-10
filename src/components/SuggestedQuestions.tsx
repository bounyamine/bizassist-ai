interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const suggestions = [
  {
    title: "Available courses",
    question: "What courses are available?",
    icon: "01",
  },
  {
    title: "Course fees",
    question: "How much do the courses cost?",
    icon: "02",
  },
  {
    title: "Registration",
    question: "How do I register?",
    icon: "03",
  },
  {
    title: "Class schedules",
    question: "When do classes start?",
    icon: "04",
  },
];

export default function SuggestedQuestions({
  onSelect,
}: SuggestedQuestionsProps) {
  return (
    <section className="suggestions" aria-labelledby="suggestions-title">
      <h2 id="suggestions-title">Try asking about</h2>

      <div className="suggestion-grid">
        {suggestions.map((item) => (
          <button
            key={item.title}
            type="button"
            className="suggestion-card"
            onClick={() => onSelect(item.question)}
          >
            <span className="suggestion-number">{item.icon}</span>

            <span className="suggestion-copy">
              <strong>{item.title}</strong>
              <span>{item.question}</span>
            </span>

            <span className="suggestion-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}