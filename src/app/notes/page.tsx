'use client'
import NoteCard from "@/components/NoteCard"
import NoteForm from "@/components/NoteForm"
import { useNoteStore } from "@/context/notecontext"
import { Note } from "@prisma/client"
import { useEffect } from "react"
export default function NotesPage() {
  const {notes, getNotes} = useNoteStore(s=>s)
  useEffect(() => {
    getNotes()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="flex justify-center items-center h-screen">
        <div className="w-1/2">
          <NoteForm />
          {
            notes?.sort((a, b) => b.id! - a.id!).map((note:Note) => <NoteCard key={note.id} note={note} />)
          }
        </div>
      </div>
  )
}
