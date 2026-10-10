import { useState, type FormEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = value.trim();

    if (!message || disabled) return;

    onSend(message);
    setValue("");
  }

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="chat-message">
        Your message
      </label>

      <textarea
        id="chat-message"
        className="chat-textarea"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask a question about the business..."
        rows={1}
        maxLength={1000}
        disabled={disabled}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
      />

      <button
        className="send-button"
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M22 2 11 13" />
          <path d="m22 2-7 20-4-9-9-4Z" />
        </svg>
      </button>
    </form>
  );
}