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
): ChatMessageType {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
  };
}

function getDemoResponse(question: string): string {
  const text = question.toLowerCase();

  if (/course|cours|formation|program|programme/.test(text)) {
    return "This demo does not yet contain verified course information. In the next development stage, we will connect a knowledge base so I can answer using approved business information.";
  }

  if (/fee|fees|price|cost|prix|tarif|combien/.test(text)) {
    return "I don't have verified pricing information yet. Please contact the business directly to confirm its current fees. This demo will later retrieve prices from the approved knowledge base.";
  }

  if (/register|registration|inscri|enrol/.test(text)) {
    return "I don't have the official registration procedure yet. Please contact the business for the correct steps and required documents.";
  }

  if (/schedule|class|start|horaire|date|emploi du temps/.test(text)) {
    return "I don't have a verified schedule yet. Please confirm the dates and times with the business directly.";
  }

  return "I couldn't find a verified answer in this demo. A reliable business assistant should acknowledge missing information instead of inventing an answer.";
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

  function handleSend(content: string) {
    if (isLoading) return;

    const userMessage = createMessage("user", content);

    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);

    // Temporary demo behavior. A real API will replace this later.
    window.setTimeout(() => {
      const response = getDemoResponse(content);

      setMessages((current) => [
        ...current,
        createMessage("assistant", response),
      ]);

      setIsLoading(false);
    }, 500);
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
                Demo mode · Answers are simulated, not AI-generated.
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
                  aria-label="Preparing demo response"
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
            Demo only. Always verify important business information.
          </p>
        </footer>
      </section>
    </main>
  );
}