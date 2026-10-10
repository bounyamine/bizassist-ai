import { describe, expect, it } from "vitest";
import { knowledgeBase } from "../data/knowledgeBase";
import {
  FALLBACK_MESSAGE,
  getAssistantResponse,
  searchKnowledge,
} from "./knowledgeSearch";

describe("knowledgeBase", () => {
  it("contains at least 15 FAQs", () => {
    expect(knowledgeBase.length).toBeGreaterThanOrEqual(15);
  });

  it("has unique IDs", () => {
    const ids = knowledgeBase.map((entry) => entry.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has all required fields", () => {
    for (const entry of knowledgeBase) {
      expect(entry.id.trim()).not.toBe("");
      expect(entry.question.trim()).not.toBe("");
      expect(entry.answer.trim()).not.toBe("");
      expect(entry.category.trim()).not.toBe("");
      expect(entry.source.trim()).not.toBe("");
      expect(entry.keywords.length).toBeGreaterThan(0);
    }
  });
});

describe("searchKnowledge", () => {
  it("finds a development web FAQ", () => {
    const results = searchKnowledge("développement web");

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((result) => result.entry.id === "faq-002")).toBe(true);
  });

  it("matches a question using alternative keywords", () => {
    const results = searchKnowledge("prix du marketing digital");

    expect(results.some((result) => result.entry.id === "faq-008")).toBe(true);
  });

  it("handles uppercase and missing accents", () => {
    const results = searchKnowledge("DEVELOPPEMENT WEB");

    expect(results.some((result) => result.entry.id === "faq-002")).toBe(true);
  });

  it("returns no results for an empty query", () => {
    expect(searchKnowledge("")).toEqual([]);
    expect(searchKnowledge("   ")).toEqual([]);
  });

  it("returns no results for unrelated terms", () => {
    expect(searchKnowledge("pingouin intergalactique")).toEqual([]);
  });

  it("respects the result limit", () => {
    expect(searchKnowledge("formation", knowledgeBase, 2)).toHaveLength(2);
  });

  it("returns results in descending score order", () => {
    const results = searchKnowledge("formation développement web");

    for (let i = 1; i < results.length; i += 1) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });
});

describe("getAssistantResponse", () => {
  it("returns verified answer and official source when score is sufficient", () => {
    const response = getAssistantResponse("Quels sont les cours disponibles ?");

    expect(response.matched).toBe(true);
    expect(response.source).toBe("FAQ officielle fictive — Formations");
    expect(response.content).toContain("bureautique");
  });

  it("returns fallback message without source when question is unknown", () => {
    const response = getAssistantResponse("pingouin intergalactique");

    expect(response.matched).toBe(false);
    expect(response.source).toBeUndefined();
    expect(response.content).toBe(FALLBACK_MESSAGE);
  });

  it("returns fallback message for empty query", () => {
    const response = getAssistantResponse("   ");

    expect(response.matched).toBe(false);
    expect(response.source).toBeUndefined();
    expect(response.content).toBe(FALLBACK_MESSAGE);
  });

  it("respects a custom confidence threshold", () => {
    // A high threshold of 20 should reject moderate matches
    const strictResponse = getAssistantResponse("web", 20);

    expect(strictResponse.matched).toBe(false);
    expect(strictResponse.content).toBe(FALLBACK_MESSAGE);
  });
});

