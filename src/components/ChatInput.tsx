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
  const maxLength = 500;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = value.trim();

    if (!message || disabled) return;

    onSend(message);
    setValue("");
  }

  const isNearLimit = value.length >= 400;

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="chat-message">
        Votre message
      </label>

      <div className="input-field-wrapper">
        <textarea
          id="chat-message"
          className="chat-textarea"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Posez votre question sur nos formations, tarifs, horaires..."
          rows={1}
          maxLength={maxLength}
          disabled={disabled}
          aria-describedby={value.length > 0 ? "char-count-info" : undefined}
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

        {value.length > 0 && (
          <span
            id="char-count-info"
            className={`char-counter ${isNearLimit ? "near-limit" : ""}`}
            aria-live="polite"
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <button
        className="send-button"
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Envoyer le message"
        title="Envoyer (Entrée)"
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