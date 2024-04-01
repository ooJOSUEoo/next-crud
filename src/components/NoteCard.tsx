import { useNoteStore } from "@/context/notecontext";
import { Note } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function NoteCard({note}: {note:Note}) {
  const route = useRouter()
  const {deleteNote} = useNoteStore(s=>s)
  return (
    <div key={note.id} className="bg-slate-300 p-4 my-2 flex justify-between">
      <div className="">
        <h1 className="text-2xl border-b-2 border-y-blue-800">{note.title}</h1>
        <p>{note.content}</p>
      </div>
      <div className="flex gap-x-2">
        <button onClick={() => route.push(`?id=${note.id}`)}>Edit</button>
        <button onClick={() => deleteNote(note.id!)}>Delete</button>
      </div>
    </div>
  )
}
