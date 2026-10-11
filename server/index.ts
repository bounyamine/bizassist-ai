import { existsSync } from "node:fs";
import path from "node:path";
import express, { type Request, type Response } from "express";
import cors from "cors";
import {
  FALLBACK_MESSAGE,
  MIN_CONFIDENCE_SCORE,
  searchKnowledge,
} from "../src/lib/knowledgeSearch.ts";
import { generateAnswerWithGemini, isGeminiConfigured } from "./gemini.ts";

const rootEnvPath = path.resolve(import.meta.dirname, "../.env");
const currentEnvPath = path.resolve(process.cwd(), ".env");
const envPathToLoad = existsSync(rootEnvPath)
  ? rootEnvPath
  : existsSync(currentEnvPath)
    ? currentEnvPath
    : null;

if (envPathToLoad && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(envPathToLoad);
  } catch (err) {
    console.warn("[BizAssist API] Erreur lors du chargement de .env :", err);
  }
}

const app = express();
const PORT = process.env.PORT || 3001;
const MAX_MESSAGE_LENGTH = 500;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    geminiEnabled: isGeminiConfigured(),
    model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
  });
});

app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message } = req.body ?? {};

    if (typeof message !== "string" || !message.trim()) {
      res.status(400).json({
        error: "Le champ 'message' est requis et doit être une chaîne non vide.",
      });
      return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({
        error: `Le message dépasse la limite autorisée de ${MAX_MESSAGE_LENGTH} caractères.`,
      });
      return;
    }

    const trimmedMessage = message.trim();
    const results = searchKnowledge(trimmedMessage);
    const bestMatch = results[0];

    // Vérifier si un résultat dépasse le seuil minimum de pertinence
    if (bestMatch && bestMatch.score >= MIN_CONFIDENCE_SCORE) {
      // Si Gemini est configuré, on génère une réponse polie contrainte au contexte
      if (isGeminiConfigured()) {
        try {
          const relevantEntries = results.map((r) => r.entry);
          const aiResponse = await generateAnswerWithGemini(
            trimmedMessage,
            relevantEntries,
          );

          res.status(200).json({
            content: aiResponse,
            source: bestMatch.entry.source,
            matched: true,
            provider: "gemini",
          });
          return;
        } catch (geminiError) {
          console.warn(
            "[BizAssist API] Échec de l'appel Gemini, bascule sur la réponse locale :",
            geminiError,
          );
          // Bascule gracieuse sur la réponse locale en cas d'erreur API
        }
      }

      // Réponse locale déterministe (sans clé API ou après bascule)
      res.status(200).json({
        content: bestMatch.entry.answer,
        source: bestMatch.entry.source,
        matched: true,
        provider: "knowledge-base",
      });
      return;
    }

    // Aucun résultat pertinent -> Fallback sécurisé anti-hallucination
    res.status(200).json({
      content: FALLBACK_MESSAGE,
      matched: false,
      provider: "safe-fallback",
    });
  } catch (error) {
    console.error("Erreur serveur dans /api/chat:", error);
    res.status(500).json({
      error: "Une erreur interne est survenue lors du traitement de votre demande.",
    });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[BizAssist API] Serveur démarré sur http://localhost:${PORT}`);
    console.log(
      `[BizAssist API] Intégration Gemini : ${isGeminiConfigured() ? "Activée (" + (process.env.GEMINI_MODEL || "gemini-3.1-flash-lite") + ")" : "Désactivée (mode local déterministe)"}`,
    );
  });
}

export default app;
