
import { Note } from '@prisma/client';
import axios from 'axios';
import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useNoteStore = create(persist<{
  notes: Note[],
  getNotes: () => void,
  setNote: (title:string, content:string) => void,
  deleteNote: (id:number) => void
}>((set:any,get:any) => ({
  notes: [] as Note[],
  getNotes: async() => {
    const resp = await axios.get('http://localhost:3000/api/notes')
    set({ ...get(),notes: resp.data.notes})
  },
  setNote: async(title,content) => {
    const resp = await axios.post('/api/notes', {
        title: title,
        content: content
    })
    set({ ...get(),notes: get().notes.concat(resp.data.note)})
  },
  deleteNote: async(id:number) => {
    const resp = await axios.delete(`/api/notes/${id}`)
    set({ ...get(),notes: get().notes.filter((note:Note) => note.id !== id)})
  },
}), {
  name: 'note',
}));