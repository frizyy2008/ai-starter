import { describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/notes/route";
import { GET as GET_ONE } from "@/app/api/notes/[id]/route";
import { apiRequest, BASE_URL, countNotesOnDisk, signUpUser } from "./helpers";

describe("регрессионные тесты по итогам аудита", () => {
  it("413: отменяет чтение потока при превышении 16 КБ без Content-Length", async () => {
    const { cookie } = await signUpUser();
    const before = countNotesOnDisk();

    let pulls = 0;
    let cancelled = false;
    const chunk = new Uint8Array(8 * 1024).fill(97);
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls++;
        if (pulls <= 10) controller.enqueue(chunk);
        else controller.close();
      },
      cancel() {
        cancelled = true;
      },
    });

    const init: RequestInit & { duplex: "half" } = {
      method: "POST",
      headers: { cookie, origin: BASE_URL, "content-type": "application/json" },
      body: stream,
      duplex: "half",
    };

    const res = await POST(new Request(`${BASE_URL}/api/notes`, init));
    expect(res.status).toBe(413);
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(cancelled).toBe(true);
    expect(pulls).toBeLessThan(10);
    expect(countNotesOnDisk()).toBe(before);
  });

  it("415 на application/json-seq и 201 на application/json; charset=utf-8", async () => {
    const { cookie } = await signUpUser();
    const rejected = await POST(
      apiRequest("POST", "/api/notes", {
        cookie,
        body: { title: "a", content: "b" },
        contentType: "application/json-seq",
      }),
    );
    expect(rejected.status).toBe(415);

    const ok = await POST(
      apiRequest("POST", "/api/notes", {
        cookie,
        body: { title: "a", content: "b" },
        contentType: "application/json; charset=utf-8",
      }),
    );
    expect(ok.status).toBe(201);
  });

  it("400 при NUL-символе в title или content", async () => {
    const { cookie } = await signUpUser();
    const before = countNotesOnDisk();
    const res = await POST(
      apiRequest("POST", "/api/notes", {
        cookie,
        body: { title: "bad\0title", content: "ok" },
      }),
    );
    expect(res.status).toBe(400);
    expect(countNotesOnDisk()).toBe(before);
  });

  it("ошибки 401 и 404 возвращают Cache-Control: private, no-store", async () => {
    const unauth = await GET(apiRequest("GET", "/api/notes"));
    expect(unauth.status).toBe(401);
    expect(unauth.headers.get("cache-control")).toBe("private, no-store");

    const { cookie } = await signUpUser();
    const missing = await GET_ONE(
      apiRequest("GET", "/api/notes/not-a-uuid", { cookie }),
      { params: Promise.resolve({ id: "not-a-uuid" }) },
    );
    expect(missing.status).toBe(404);
    expect(missing.headers.get("cache-control")).toBe("private, no-store");
  });
});
