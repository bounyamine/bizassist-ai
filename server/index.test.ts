import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import app from "./index";

let server: Server;
let baseUrl: string;

beforeAll(() => {
  return new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address() as AddressInfo;
      baseUrl = `http://localhost:${address.port}`;
      resolve();
    });
  });
});

afterAll(() => {
  return new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

describe("Backend API", () => {
  it("GET /api/health returns status ok", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = (await res.json()) as { status: string };

    expect(res.status).toBe(200);
    expect(data.status).toBe("ok");
  });

  it("POST /api/chat returns verified answer for valid question with structured sources", async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Quels sont les cours disponibles ?" }),
    });
    const data = (await res.json()) as {
      matched: boolean;
      source: string;
      sources: Array<{ id: string; question: string; source: string }>;
      content: string;
      needsHumanContact: boolean;
    };

    expect(res.status).toBe(200);
    expect(data.matched).toBe(true);
    expect(data.source).toBe("FAQ officielle fictive — Formations");
    expect(data.sources.length).toBeGreaterThan(0);
    expect(data.sources[0].id).toBe("faq-001");
    expect(data.needsHumanContact).toBe(false);
    expect(data.content).toContain("bureautique");
  });

  it("POST /api/chat flags missing information and provides human contact fallback", async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "pingouin intergalactique" }),
    });
    const data = (await res.json()) as {
      matched: boolean;
      sources: Array<{ id: string }>;
      needsHumanContact: boolean;
      content: string;
    };

    expect(res.status).toBe(200);
    expect(data.matched).toBe(false);
    expect(data.sources).toHaveLength(0);
    expect(data.needsHumanContact).toBe(true);
    expect(data.content).toContain("Je n'ai pas trouvé de réponse officielle");
  });

  it("POST /api/chat validates empty message", async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "" }),
    });
    const data = (await res.json()) as { error: string };

    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("POST /api/chat rejects messages exceeding 500 characters", async () => {
    const longMessage = "a".repeat(501);
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: longMessage }),
    });
    const data = (await res.json()) as { error: string };

    expect(res.status).toBe(400);
    expect(data.error).toContain("500");
  });
});
