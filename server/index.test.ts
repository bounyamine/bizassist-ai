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
    expect(data).toEqual({ status: "ok" });
  });

  it("POST /api/chat returns verified answer for valid question", async () => {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Quels sont les cours disponibles ?" }),
    });
    const data = (await res.json()) as {
      matched: boolean;
      source: string;
      content: string;
    };

    expect(res.status).toBe(200);
    expect(data.matched).toBe(true);
    expect(data.source).toBe("FAQ officielle fictive — Formations");
    expect(data.content).toContain("bureautique");
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
