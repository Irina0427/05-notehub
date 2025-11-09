import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_BASE_URL = 'https://notehub-public.goit.study/api';
const token = import.meta.env.VITE_NOTEHUB_TOKEN as string;

if (!token) {
  console.warn('VITE_NOTEHUB_TOKEN is not set');
}

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  results: Note[];
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const { data } = await client.get<FetchNotesResponse>('/notes', { params });
  return data;
}

export async function createNote(
  payload: CreateNotePayload,
): Promise<Note> {
  const { data } = await client.post<Note>('/notes', payload);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await client.delete<Note>(`/notes/${id}`);
  return data;
}