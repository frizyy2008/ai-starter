import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notes } from "@/db/schema";
import type { CreateNoteInput, NoteDto } from "@/features/notes/schema";

const dtoColumns = {
  id: notes.id,
  title: notes.title,
  content: notes.content,
  createdAt: notes.createdAt,
};

type DtoRow = { id: string; title: string; content: string; createdAt: Date };

function toDto(row: DtoRow): NoteDto {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

export function createNote(userId: string, input: CreateNoteInput): NoteDto {
  const row = db
    .insert(notes)
    .values({ userId, title: input.title, content: input.content })
    .returning(dtoColumns)
    .get();
  return toDto(row);
}

export function listNotes(userId: string): NoteDto[] {
  return db
    .select(dtoColumns)
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(desc(notes.createdAt))
    .limit(100)
    .all()
    .map(toDto);
}

export function getNote(userId: string, id: string): NoteDto | null {
  const row = db
    .select(dtoColumns)
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))
    .get();
  return row ? toDto(row) : null;
}
