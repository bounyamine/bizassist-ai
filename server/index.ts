import express, { type Request, type Response } from "express";
import cors from "cors";
import { getAssistantResponse } from "../src/lib/knowledgeSearch.ts";

const app = express();
const PORT = process.env.PORT || 3001;
const MAX_MESSAGE_LENGTH = 500;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", (req: Request, res: Response) => {
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

    const response = getAssistantResponse(message.trim());

    res.status(200).json({
      content: response.content,
      source: response.source,
      matched: response.matched,
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
  });
}

export default app;

