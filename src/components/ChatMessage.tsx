import { useState } from "react";
import type { ChatMessage as ChatMessageType } from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({
  message,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Échec de la copie :", err);
    }
  }

  return (
    <article
      className={`message-row ${isUser ? "user-row" : "assistant-row"}`}
      aria-label={isUser ? "Votre question" : "Réponse officielle de l'assistant"}
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

        {message.sources && message.sources.length > 0 ? (
          <div className="message-sources-panel" aria-label="Sources utilisées">
            <div className="sources-header">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="sources-icon"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>
                {message.sources.length === 1
                  ? "Basé sur 1 source officielle :"
                  : `Basé sur ${message.sources.length} sources officielles :`}
              </span>
            </div>
            <ul className="sources-list">
              {message.sources.map((item) => (
                <li key={item.id} className="source-item">
                  <span className="source-ref">[{item.id}]</span>
                  <span className="source-question">« {item.question} »</span>
                  <span className="source-doc">({item.source})</span>
                </li>
              ))}
            </ul>
          </div>
        ) : message.source ? (
          <div className="message-source">
            <span className="source-label">Source :</span> {message.source}
          </div>
        ) : null}

        {message.needsHumanContact && (
          <div className="human-contact-card" role="region" aria-label="Contact assistance">
            <div className="contact-card-title">
              <span className="contact-badge-icon" aria-hidden="true">📞</span>
              <strong>Besoin d'une confirmation personnalisée ?</strong>
            </div>
            <p className="contact-card-desc">
              Notre équipe d'accueil vous répond du lundi au vendredi de 8h30 à 18h00.
            </p>
            <div className="contact-card-actions">
              <a href="tel:+33123456789" className="contact-pill primary">
                📞 01 23 45 67 89
              </a>
              <a href="mailto:contact@centre-formation.fr" className="contact-pill">
                ✉️ Envoyer un email
              </a>
            </div>
          </div>
        )}

        <div className="message-meta">
          <time className="message-time">
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>

          {!isUser && !message.isError && (
            <button
              type="button"
              className={`copy-button ${copied ? "copied" : ""}`}
              onClick={handleCopy}
              aria-label={copied ? "Copié dans le presse-papier" : "Copier la réponse"}
              title={copied ? "Copié !" : "Copier la réponse"}
            >
              {copied ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="copy-icon"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="copy-text">Copié !</span>
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="copy-icon"
                    aria-hidden="true"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  <span className="copy-text">Copier</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}