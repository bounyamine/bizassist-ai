interface ChatHeaderProps {
  onReset?: () => void;
  hasMessages?: boolean;
}

export default function ChatHeader({ onReset, hasMessages }: ChatHeaderProps) {
  return (
    <header className="chat-header">
      <div className="brand-mark" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" />
        </svg>
      </div>

      <div className="brand-copy">
        <h1>BizAssist AI</h1>
        <p>
          <span className="status-dot online" aria-hidden="true" />
          <span>Opérationnel · Réponses officielles</span>
        </p>
      </div>

      <div className="header-actions">
        {hasMessages && onReset && (
          <button
            type="button"
            className="new-chat-button"
            onClick={onReset}
            title="Démarrer une nouvelle conversation"
            aria-label="Démarrer une nouvelle conversation"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="new-chat-icon"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            <span className="new-chat-label">Nouveau chat</span>
          </button>
        )}
        <span className="demo-badge">DÉMO</span>
      </div>
    </header>
  );
}