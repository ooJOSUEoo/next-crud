
import { Note } from '@prisma/client';
import axios from 'axios';
import create from 'zustand';
import { persist } from 'zustand/middleware';

export const useNoteStore = create(persist<{
  notes: Note[],
  getNotes: (token:string) => void,
  setNote: (title:string, content:string, token:string) => void,
  deleteNote: (id:number, token:string) => void
  updateNote: (id:number, title:string, content:string, token:string) => void
}>((set:any,get:any) => ({
  notes: [] as Note[],
  getNotes: async(token) => {
    try {
      const resp = await axios.get('/api/notes',{
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      set({ ...get(),notes: resp.data.notes})
    } catch (error:any) {
      console.log("error: ", error)
      if(error.response.data.error.includes('expired')){
        set({ ...get(),notes: []})
      }
    }
  },
  setNote: async(title,content, token) => {
    const resp = await axios.post('/api/notes', {
        title: title,
        content: content
    },{
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    set({ ...get(),notes: get().notes.concat(resp.data.note)})
  },
  deleteNote: async(id,token) => {
    const resp = await axios.delete(`/api/notes/${id}`,{
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    set({ ...get(),notes: get().notes.filter((note:Note) => note.id !== id)})
  },
  updateNote: async(id,title,content,token) => {
    const resp = await axios.put(`/api/notes/${id}`, {
        title: title,
        content: content
    },{
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    set({ ...get(),notes: get().notes.map((note:Note) => note.id === id ? resp.data.note : note)})
  },
}), {
  name: 'note',
}));