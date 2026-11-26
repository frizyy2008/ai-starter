"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const mode = submitter?.value === "sign-up" ? "sign-up" : "sign-in";
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();

    setPending(true);
    setError(null);

    const result =
      mode === "sign-up"
        ? await authClient.signUp.email({ email, password, name: name || email })
        : await authClient.signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message ?? "Не удалось выполнить вход");
      setPending(false);
      return;
    }

    router.push("/notes");
    router.refresh();
  }

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-12">
      <h1 className="text-2xl font-semibold">Вход</h1>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1 text-sm">
          Имя (для регистрации)
          <input
            name="name"
            autoComplete="name"
            className="rounded border px-3 py-2 focus-visible:outline-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded border px-3 py-2 focus-visible:outline-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Пароль
          <input
            name="password"
            type="password"
            required
            minLength={12}
            autoComplete="current-password"
            className="rounded border px-3 py-2 focus-visible:outline-2"
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            value="sign-in"
            disabled={pending}
            className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            Войти
          </button>
          <button
            type="submit"
            value="sign-up"
            disabled={pending}
            className="rounded border px-4 py-2 text-sm disabled:opacity-50"
          >
            Зарегистрироваться
          </button>
        </div>
      </form>
    </main>
  );
}
