
import axios from 'axios';
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface Note {
    id?: number;
    title: string;
    content: string;
}

export const useNoteStore = create(persist((set:any,get:any) => ({
  notes: [] as Note[],
  getNotes: async() => {
    const resp = await axios.get('http://localhost:3000/api/notes')
    set({ ...get(),notes: resp.data.notes})
  },
  setNote: async(values:Note) => {
    const resp = await axios.post('/api/notes', {
        title: values.title,
        content: values.content
    })
    set({ ...get(),notes: get().notes.concat(resp.data.note)})
  }
}), {
  name: 'note',
}));