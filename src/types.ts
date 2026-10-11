export type ChatRole = "assistant" | "user";

export interface SourceAttribution {
  id: string;
  category: KnowledgeCategory;
  question: string;
  source: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  source?: string;
  sources?: SourceAttribution[];
  isError?: boolean;
  needsHumanContact?: boolean;
}

export type KnowledgeCategory =
  | "courses"
  | "pricing"
  | "registration"
  | "schedule"
  | "certificates"
  | "payment"
  | "location"
  | "contact"
  | "policies";

export interface KnowledgeEntry {
  id: string;
  category: KnowledgeCategory;
  question: string;
  answer: string;
  keywords: string[];
  source: string;
}
