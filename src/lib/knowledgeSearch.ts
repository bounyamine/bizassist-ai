import type { KnowledgeEntry } from "../types";
import { knowledgeBase } from "../data/knowledgeBase";

export interface SearchResult {
  entry: KnowledgeEntry;
  score: number;
}

function normalizeText(text: string): string {
  return text
    .toLocaleLowerCase("fr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter((word) => word.length > 1);
}

export function searchKnowledge(
  query: string,
  entries: KnowledgeEntry[] = knowledgeBase,
  limit = 3,
): SearchResult[] {
  if (!query.trim() || limit <= 0) {
    return [];
  }

  const queryTokens = [...new Set(tokenize(query))];

  if (queryTokens.length === 0) {
    return [];
  }

  const results: SearchResult[] = entries
    .map((entry) => {
      const question = normalizeText(entry.question);
      const answer = normalizeText(entry.answer);
      const keywords = entry.keywords.map(normalizeText);
      let score = 0;

      for (const token of queryTokens) {
        // Exact word match in the canonical question.
        if (tokenize(question).includes(token)) {
          score += 3;
        }

        // Keyword matches are especially useful for alternative wording.
        if (keywords.some((keyword) => tokenize(keyword).includes(token))) {
          score += 4;
        }

        // An answer match is weaker evidence than a question or keyword match.
        if (tokenize(answer).includes(token)) {
          score += 1;
        }
      }

      // A phrase match gives a small bonus.
      const normalizedQuery = normalizeText(query);

      if (normalizedQuery.length > 2 && question.includes(normalizedQuery)) {
        score += 3;
      }

      return { entry, score };
    })
    .filter((result) => result.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.entry.id.localeCompare(b.entry.id),
    );

  return results.slice(0, limit);
}