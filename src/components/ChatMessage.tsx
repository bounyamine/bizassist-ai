import type { ChatMessage as ChatMessageType } from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({
  message,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={`message-row ${isUser ? "user-row" : "assistant-row"}`}
    >
      {!isUser && (
        <div className="message-avatar" aria-hidden="true">
          B
        </div>
      )}

      <div className="message-content">
        <div
          className={`message-bubble ${isUser ? "user-bubble" : ""} ${
            message.isError ? "error-bubble" : ""
          }`}
        >
          {message.content}
        </div>

        {message.source && (
          <div className="message-source">
            <span className="source-label">Source :</span> {message.source}
          </div>
        )}

        <time className="message-time">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
    </article>
  );
}