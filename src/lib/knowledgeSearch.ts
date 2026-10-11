import type { KnowledgeEntry } from "../types";
import { knowledgeBase } from "../data/knowledgeBase";

export interface SearchResult {
  entry: KnowledgeEntry;
  score: number;
}

export const FRENCH_STOP_WORDS = new Set([
  // Articles & déterminants
  "le", "la", "les", "l", "un", "une", "des", "du", "de", "d", "au", "aux",
  "ce", "cet", "cette", "ces", "mon", "ton", "son", "notre", "votre", "leur",
  "mes", "tes", "ses", "nos", "vos", "leurs",
  // Pronoms
  "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles",
  "me", "te", "se", "moi", "toi", "lui", "eux", "leur", "y", "en",
  "qui", "que", "quoi", "dont", "ou",
  // Conjonctions & prépositions
  "et", "mais", "donc", "or", "ni", "car", "si", "comme",
  "a", "dans", "par", "pour", "vers", "avec", "sans", "sous", "sur", "chez",
  // Verbes et auxiliaires fréquents
  "est", "sont", "ete", "etre", "avoir", "ai", "as", "avons", "avez", "ont",
  "fait", "faire", "quel", "quelle", "quels", "quelles",
  "c", "s", "t", "m", "n", "j", "qu", "puis", "suis", "es"
]);

export const GENERIC_DOMAIN_WORDS = new Set([
  "cours", "formation", "formations", "programme", "proposer", "proposons", "proposez"
]);

function normalizeText(text: string): string {
  return text
    .toLocaleLowerCase("fr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string, filterStopWords = true): string[] {
  const words = normalizeText(text)
    .split(" ")
    .filter((word) => word.length > 1);

  if (!filterStopWords) {
    return words;
  }

  const filtered = words.filter((word) => !FRENCH_STOP_WORDS.has(word));
  return filtered.length > 0 ? filtered : words;
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
      const questionTokens = tokenize(entry.question);
      const answerTokens = tokenize(entry.answer);
      const keywordTokens = entry.keywords.flatMap((k) => tokenize(k));

      let score = 0;
      let matchedTokens = 0;
      let hasNonGenericMatch = false;

      for (const token of queryTokens) {
        let tokenMatched = false;

        // Exact word match in the canonical question.
        if (questionTokens.includes(token)) {
          score += 3;
          tokenMatched = true;
        }

        // Keyword matches are especially useful for alternative wording.
        if (keywordTokens.includes(token)) {
          score += 4;
          tokenMatched = true;
        }

        // An answer match is weaker evidence than a question or keyword match.
        if (answerTokens.includes(token)) {
          score += 1;
          tokenMatched = true;
        }

        if (tokenMatched) {
          matchedTokens += 1;
          if (!GENERIC_DOMAIN_WORDS.has(token)) {
            hasNonGenericMatch = true;
          }
        }
      }

      // A phrase match gives a small bonus.
      const normalizedQuery = normalizeText(query);
      if (normalizedQuery.length > 2 && normalizeText(entry.question).includes(normalizedQuery)) {
        score += 3;
      }

      // If query contains specific words that had zero match in this FAQ,
      // and the only match was a generic domain word (e.g., "cours"), reject this entry.
      const unmatchedTokens = queryTokens.length - matchedTokens;
      if (unmatchedTokens > 0 && !hasNonGenericMatch) {
        score = 0;
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

export const MIN_CONFIDENCE_SCORE = 5;

export const FALLBACK_MESSAGE =
  "Je n'ai pas trouvé de réponse officielle correspondant à votre demande dans notre base de connaissances. Pour obtenir une information vérifiée et à jour, nous vous invitons à contacter directement notre accueil.";

export interface AssistantResponse {
  content: string;
  source?: string;
  matched: boolean;
  score?: number;
}

export function getAssistantResponse(
  query: string,
  minScore = MIN_CONFIDENCE_SCORE,
  entries: KnowledgeEntry[] = knowledgeBase,
): AssistantResponse {
  const results = searchKnowledge(query, entries);
  const bestMatch = results[0];

  if (bestMatch && bestMatch.score >= minScore) {
    return {
      content: bestMatch.entry.answer,
      source: bestMatch.entry.source,
      matched: true,
      score: bestMatch.score,
    };
  }

  return {
    content: FALLBACK_MESSAGE,
    matched: false,
  };
}