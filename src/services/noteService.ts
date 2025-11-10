import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const token = import.meta.env.VITE_NOTEHUB_TOKEN as string | undefined;

if (!token) {
  throw new Error('VITE_NOTEHUB_TOKEN is missing');
}

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNoteResponse {
  note: Note;
}

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search } = params;

  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: { page, perPage, search },
  });

  return data;
}

export async function createNote(
  payload: CreateNotePayload,
): Promise<Note> {
  const { data } = await api.post<Note>('/notes', payload);
  return data;
}

export async function deleteNote(id: string): Promise<DeleteNoteResponse> {
  const { data } = await api.delete<DeleteNoteResponse>(`/notes/${id}`);
  return data;
}
