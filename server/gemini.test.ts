import { describe, expect, it } from "vitest";
import { buildSystemInstruction, isGeminiConfigured } from "./gemini";
import type { KnowledgeEntry } from "../src/types";

describe("Gemini RAG module", () => {
  const sampleEntries: KnowledgeEntry[] = [
    {
      id: "faq-test-1",
      category: "courses",
      question: "Quels sont les cours ?",
      answer: "Nous formons en bureautique et marketing.",
      keywords: ["cours"],
      source: "FAQ Source Test",
    },
  ];

  it("checks if Gemini is configured", () => {
    const isConfigured = isGeminiConfigured();
    expect(typeof isConfigured).toBe("boolean");
  });

  it("builds a grounded system instruction with context and source", () => {
    const instruction = buildSystemInstruction(sampleEntries);

    expect(instruction).toContain("BizAssist AI");
    expect(instruction).toContain("CONTEXTE OFFICIEL");
    expect(instruction).toContain("Quels sont les cours ?");
    expect(instruction).toContain("Nous formons en bureautique et marketing.");
    expect(instruction).toContain("FAQ Source Test");
    expect(instruction).toContain("RÈGLES CRITIQUES");
    expect(instruction).toContain("N'invente AUCUNE information");
  });
});

