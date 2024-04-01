'use client'
import NoteForm from "@/components/NoteForm"
import { useNoteStore } from "@/context/notecontext"
import { useEffect } from "react"

export default function HomePage() {
  const {notes, getNotes} = useNoteStore(s=>s)
  useEffect(() => {
    getNotes()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
      <div className="flex justify-center items-center h-screen">
        <div className="">
          <NoteForm />
          {
            notes?.sort((a, b) => b.id! - a.id!).map((note:any) => <div key={note.id} className="bg-slate-300 p-4 my-2">
              <h1 className="text-2xl border-b-2 border-y-blue-800">{note.title}</h1>
              <p>{note.content}</p>
            </div>)
          }
        </div>
      </div>
  )
}
