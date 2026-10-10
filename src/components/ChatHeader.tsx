export default function ChatHeader() {
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
          <span className="status-dot" />
          Business information assistant
        </p>
      </div>

      <span className="demo-badge">DEMO</span>
    </header>
  );
}