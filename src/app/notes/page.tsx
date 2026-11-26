import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/session";
import { listNotes } from "@/server/notes/service";
import { NoteForm } from "./note-form";
import { SignOutButton } from "./sign-out-button";

export default function NotesPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold">Заметки</h1>
      <Suspense fallback={<p className="mt-6 text-sm text-neutral-500">Загрузка...</p>}>
        <NotesSection />
      </Suspense>
    </main>
  );
}

async function NotesSection() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const notes = listNotes(user.id);

  return (
    <>
      <div className="mt-2 flex justify-end">
        <SignOutButton />
      </div>
      <NoteForm />
      <section aria-label="Список заметок" className="mt-8">
        {notes.length === 0 ? (
          <p className="text-sm text-neutral-500">Заметок пока нет.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {notes.map((n) => (
              <li key={n.id} className="rounded-lg border p-4">
                <h2 className="font-medium">{n.title}</h2>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm">{n.content}</p>
                <time dateTime={n.createdAt} className="mt-2 block text-xs text-neutral-500">
                  {new Date(n.createdAt).toLocaleString("ru-RU")}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
