import { z } from "zod";

export const NOTE_TITLE_MAX = 120;
export const NOTE_CONTENT_MAX = 5000;

export const createNoteSchema = z.strictObject({
  title: z
    .string()
    .trim()
    .min(1, "Введите заголовок")
    .max(NOTE_TITLE_MAX, `Не длиннее ${NOTE_TITLE_MAX} символов`),
  content: z
    .string()
    .trim()
    .min(1, "Введите текст")
    .max(NOTE_CONTENT_MAX, `Не длиннее ${NOTE_CONTENT_MAX} символов`),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const noteIdSchema = z.uuid();

export type NoteDto = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};
