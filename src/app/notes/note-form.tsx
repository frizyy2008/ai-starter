"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { NOTE_CONTENT_MAX, NOTE_TITLE_MAX } from "@/features/notes/schema";

type Status =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "success" }
  | { kind: "error"; message: string; fields?: Record<string, string[] | undefined> };

export function NoteForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus({ kind: "pending" });

    let res: Response;
    try {
      res = await fetch("/api/notes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title: data.get("title"), content: data.get("content") }),
      });
    } catch {
      setStatus({ kind: "error", message: "Нет связи с сервером. Заметка не сохранена." });
      return;
    }

    if (res.status === 201) {
      form.reset();
      setStatus({ kind: "success" });
      router.refresh();
      return;
    }

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (res.status === 429) {
      const wait = res.headers.get("retry-after") ?? "60";
      setStatus({ kind: "error", message: `Слишком часто. Повторите через ${wait} с.` });
      return;
    }

    if (res.status === 400) {
      const body = (await res.json().catch(() => ({}))) as {
        details?: Record<string, string[] | undefined>;
      };
      setStatus({ kind: "error", message: "Проверьте поля формы.", fields: body.details });
      return;
    }

    setStatus({ kind: "error", message: "Не удалось сохранить заметку. Попробуйте ещё раз." });
  }

  const fieldError = (name: string) => (status.kind === "error" ? status.fields?.[name]?.[0] : undefined);
  const pending = status.kind === "pending";

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4 rounded-lg border p-4">
      <label className="flex flex-col gap-1 text-sm">
        Заголовок
        <input
          name="title"
          required
          maxLength={NOTE_TITLE_MAX}
          aria-invalid={Boolean(fieldError("title"))}
          aria-describedby={fieldError("title") ? "title-error" : undefined}
          className="rounded border px-3 py-2 focus-visible:outline-2"
        />
        {fieldError("title") && (
          <span id="title-error" className="text-red-600">
            {fieldError("title")}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Текст
        <textarea
          name="content"
          required
          rows={4}
          maxLength={NOTE_CONTENT_MAX}
          aria-invalid={Boolean(fieldError("content"))}
          aria-describedby={fieldError("content") ? "content-error" : undefined}
          className="rounded border px-3 py-2 focus-visible:outline-2"
        />
        {fieldError("content") && (
          <span id="content-error" className="text-red-600">
            {fieldError("content")}
          </span>
        )}
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {pending ? "Сохранение..." : "Сохранить"}
        </button>
        <p role="status" aria-live="polite" className="text-sm text-green-700 dark:text-green-400">
          {status.kind === "success" ? "Заметка сохранена" : ""}
        </p>
      </div>

      {status.kind === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {status.message}
        </p>
      )}
    </form>
  );
}
