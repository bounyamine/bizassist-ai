import { GoogleGenAI } from "@google/genai";
import type { KnowledgeEntry } from "../src/types.ts";

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function buildSystemInstruction(entries: KnowledgeEntry[]): string {
  const context = entries
    .map(
      (entry, index) =>
        `[FAQ ${index + 1}]\nQuestion: ${entry.question}\nRéponse: ${entry.answer}\nSource: ${entry.source}`,
    )
    .join("\n\n");

  return `Tu es BizAssist AI, l'assistant officiel d'information d'un centre de formation professionnelle.
Ton objectif est de répondre aux questions des étudiants et prospects de façon claire, polie, naturelle et concise en français.

RÈGLES CRITIQUES :
1. Réponds UNIQUEMENT à partir des extraits de la base de connaissances fournis ci-dessous.
2. N'invente AUCUNE information, aucun prix, aucune date, ni aucune modalité qui ne figure pas explicitement dans ce contexte.
3. Si le contexte fourni ne permet pas de répondre complètement ou avec certitude à la question, réponds STRICTEMENT avec cette phrase de redirection :
"Je n'ai pas trouvé de réponse officielle correspondant à votre demande dans notre base de connaissances. Pour obtenir une information vérifiée et à jour, nous vous invitons à contacter directement notre accueil."
4. Reste concis (1 à 3 phrases claires maximum). Ne fais pas de bavardage inutile.

CONTEXTE OFFICIEL :
${context}`;
}

export async function generateAnswerWithGemini(
  userQuestion: string,
  entries: KnowledgeEntry[],
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY n'est pas configurée.");
  }

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.1-flash-lite";
  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = buildSystemInstruction(entries);

  const response = await ai.models.generateContent({
    model,
    contents: userQuestion,
    config: {
      systemInstruction,
      temperature: 0.1,
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Réponse vide reçue de l'API Gemini.");
  }

  return text;
}
