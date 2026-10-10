import { describe, expect, it } from "vitest";
import { knowledgeBase } from "../data/knowledgeBase";
import { searchKnowledge } from "./knowledgeSearch";

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
