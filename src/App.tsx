import { useEffect, useRef, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import SuggestedQuestions from "./components/SuggestedQuestions";
import type { ChatMessage as ChatMessageType } from "./types";
import "./App.css";

function createMessage(
  role: ChatMessageType["role"],
  content: string,
  source?: string,
): ChatMessageType {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
    source,
  };
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  async function handleSend(content: string) {
    if (isLoading) return;

    const userMessage = createMessage("user", content);

    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.error || `Erreur serveur (${res.status})`,
        );
      }

      const data: { content: string; source?: string } = await res.json();

      setMessages((current) => [
        ...current,
        createMessage("assistant", data.content, data.source),
      ]);
    } catch (error) {
      console.error("Erreur de communication avec l'API :", error);
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          "Désolé, une erreur de communication avec le serveur est survenue. Veuillez vérifier que le serveur backend est en ligne ou réessayer dans un instant.",
        ),
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const showWelcome = messages.length === 0;

  return (
    <main className="app-shell">
      <section className="chat-panel" aria-label="BizAssist AI chat">
        <ChatHeader />

        <div className="chat-body">
          {showWelcome ? (
            <div className="welcome-screen">
              <div className="welcome-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
                  <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" />
                </svg>
              </div>

              <p className="eyebrow">YOUR BUSINESS, MADE SIMPLER</p>

              <h2>
                How can I
                <br />
                help you today?
              </h2>

              <p className="welcome-description">
                Ask a question about a business's services, prices,
                registration, or schedules.
              </p>

              <SuggestedQuestions onSelect={handleSend} />

              <p className="demo-notice">
                Mode base de connaissances · Réponses vérifiées avec sources officielles.
              </p>
            </div>
          ) : (
            <div className="conversation" aria-live="polite">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {isLoading && (
                <div
                  className="typing-indicator"
                  role="status"
                  aria-label="Recherche dans la base de connaissances..."
                >
                  <span />
                  <span />
                  <span />
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <footer className="chat-footer">
          <ChatInput onSend={handleSend} disabled={isLoading} />

          <p className="footer-note">
            Réponses issues de la base officielle. En cas de doute, contactez l'accueil.
          </p>
        </footer>
      </section>
    </main>
  );
}