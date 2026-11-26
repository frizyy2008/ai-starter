import { describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/notes/route";
import { GET as GET_ONE } from "@/app/api/notes/[id]/route";
import { apiRequest, countNotesOnDisk, signUpUser } from "./helpers";

const valid = { title: "Тест", content: "Текст заметки" };
const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe("POST /api/notes: отказы не меняют БД", () => {
  it("401 без сессии", async () => {
    const before = countNotesOnDisk();
    const res = await POST(apiRequest("POST", "/api/notes", { body: valid }));
    expect(res.status).toBe(401);
    expect(countNotesOnDisk()).toBe(before);
  });

  it("403 при чужом Origin (CSRF)", async () => {
    const { cookie } = await signUpUser();
    const before = countNotesOnDisk();
    const res = await POST(
      apiRequest("POST", "/api/notes", { cookie, body: valid, origin: "https://evil.example" }),
    );
    expect(res.status).toBe(403);
    expect(countNotesOnDisk()).toBe(before);
  });

  it("415 без application/json", async () => {
    const { cookie } = await signUpUser();
    const res = await POST(
      apiRequest("POST", "/api/notes", { cookie, body: valid, contentType: "text/plain" }),
    );
    expect(res.status).toBe(415);
  });

  it("400 при пустом заголовке", async () => {
    const { cookie } = await signUpUser();
    const before = countNotesOnDisk();
    const res = await POST(
      apiRequest("POST", "/api/notes", { cookie, body: { title: "   ", content: "ok" } }),
    );
    expect(res.status).toBe(400);
    expect(countNotesOnDisk()).toBe(before);
  });

  it("400 при лишнем поле userId (mass assignment)", async () => {
    const { cookie } = await signUpUser();
    const before = countNotesOnDisk();
    const res = await POST(
      apiRequest("POST", "/api/notes", { cookie, body: { ...valid, userId: "victim" } }),
    );
    expect(res.status).toBe(400);
    expect(countNotesOnDisk()).toBe(before);
  });

  it("400 при битом JSON", async () => {
    const { cookie } = await signUpUser();
    const res = await POST(apiRequest("POST", "/api/notes", { cookie, rawBody: "{not json" }));
    expect(res.status).toBe(400);
  });

  it("413 при слишком большом теле", async () => {
    const { cookie } = await signUpUser();
    const before = countNotesOnDisk();
    const rawBody = JSON.stringify({ title: "a", content: "x".repeat(20_000) });
    const res = await POST(apiRequest("POST", "/api/notes", { cookie, rawBody }));
    expect(res.status).toBe(413);
    expect(countNotesOnDisk()).toBe(before);
  });
});

describe("POST /api/notes: успех и лимит", () => {
  it("201: заметка на диске, в ответе нет userId", async () => {
    const { cookie } = await signUpUser();
    const before = countNotesOnDisk();
    const res = await POST(apiRequest("POST", "/api/notes", { cookie, body: valid }));
    expect(res.status).toBe(201);
    const { note } = (await res.json()) as { note: Record<string, unknown> };
    expect(note.title).toBe(valid.title);
    expect(note).not.toHaveProperty("userId");
    expect(countNotesOnDisk()).toBe(before + 1);
  });

  it("429 после 20 созданий в минуту, 21-я не записана", async () => {
    const { cookie } = await signUpUser();
    for (let i = 0; i < 20; i++) {
      const ok = await POST(
        apiRequest("POST", "/api/notes", { cookie, body: { title: `n${i}`, content: "c" } }),
      );
      expect(ok.status).toBe(201);
    }
    const before = countNotesOnDisk();
    const res = await POST(apiRequest("POST", "/api/notes", { cookie, body: valid }));
    expect(res.status).toBe(429);
    expect(Number(res.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(countNotesOnDisk()).toBe(before);
  });
});

describe("чтение и владелец", () => {
  it("GET 401 без сессии", async () => {
    const res = await GET(apiRequest("GET", "/api/notes"));
    expect(res.status).toBe(401);
  });

  it("чужая заметка: 404 по id и нет в списке", async () => {
    const alice = await signUpUser();
    const bob = await signUpUser();
    const created = await POST(apiRequest("POST", "/api/notes", { cookie: alice.cookie, body: valid }));
    const { note } = (await created.json()) as { note: { id: string } };

    const foreign = await GET_ONE(apiRequest("GET", `/api/notes/${note.id}`, { cookie: bob.cookie }), params(note.id));
    expect(foreign.status).toBe(404);

    const own = await GET_ONE(apiRequest("GET", `/api/notes/${note.id}`, { cookie: alice.cookie }), params(note.id));
    expect(own.status).toBe(200);

    const bobList = await GET(apiRequest("GET", "/api/notes", { cookie: bob.cookie }));
    const { notes } = (await bobList.json()) as { notes: { id: string }[] };
    expect(notes.map((n) => n.id)).not.toContain(note.id);
  });

  it("невалидный id: 404, а не 500", async () => {
    const { cookie } = await signUpUser();
    const res = await GET_ONE(apiRequest("GET", "/api/notes/not-a-uuid", { cookie }), params("not-a-uuid"));
    expect(res.status).toBe(404);
  });
});
