interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const suggestions = [
  {
    title: "Formations disponibles",
    question: "Quels sont les cours disponibles ?",
    icon: "01",
  },
  {
    title: "Tarifs des cours",
    question: "Quel est le prix du développement web ?",
    icon: "02",
  },
  {
    title: "Modalités d'inscription",
    question: "Comment s'inscrire à une formation ?",
    icon: "03",
  },
  {
    title: "Dates de rentrée",
    question: "Quand commencent les prochaines formations ?",
    icon: "04",
  },
];

export default function SuggestedQuestions({
  onSelect,
}: SuggestedQuestionsProps) {
  return (
    <section className="suggestions" aria-labelledby="suggestions-title">
      <h2 id="suggestions-title">Questions fréquentes</h2>

      <div className="suggestion-grid">
        {suggestions.map((item) => (
          <button
            key={item.title}
            type="button"
            className="suggestion-card"
            onClick={() => onSelect(item.question)}
            aria-label={`Poser la question : ${item.question}`}
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