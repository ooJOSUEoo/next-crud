'use client'
import NoteCard from "@/components/NoteCard"
import NoteForm from "@/components/NoteForm"
import { useNoteStore } from "@/context/notecontext"
import { Note } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
export default function NotesPage() {
  const router = useRouter()
  const {notes, getNotes} = useNoteStore(s=>s)
  const {data: session, status}:any = useSession()
  useEffect(() => {
      getNotes(session?.user.accessToken)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])


  return (
    <div className="flex justify-center items-center mt-2">
        <div className="w-1/2">
          <NoteForm />
          {
            notes?.sort((a, b) => b.id! - a.id!).map((note:Note) => <NoteCard key={note.id} note={note} />)
          }
        </div>
      </div>
  )
}
