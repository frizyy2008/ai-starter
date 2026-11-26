"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setPending(true);
    setError(null);
    try {
      const result = await authClient.signOut();
      if (result?.error) {
        setError("Не удалось выйти. Попробуйте ещё раз.");
        setPending(false);
        return;
      }
      router.push("/login");
      router.refresh();
    } catch {
      setError("Не удалось выйти. Попробуйте ещё раз.");
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={handleSignOut}
        className="text-sm underline disabled:opacity-50 focus-visible:outline-2"
      >
        {pending ? "Выход..." : "Выйти"}
      </button>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
