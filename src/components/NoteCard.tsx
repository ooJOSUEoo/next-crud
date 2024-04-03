import { useNoteStore } from "@/context/notecontext";
import { Note, User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NoteCard({note}: {note:Note}) {
  const route = useRouter()
  const {deleteNote} = useNoteStore(s=>s)
  const {userId} = note
  const [user, setUser] = useState<User>()
  const {data: session}:any = useSession()


  useEffect(() => {
    getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const getUser = async() => {
    if(userId){
      const resp = await axios.get(`/api/users/${userId}`)
      setUser(resp.data.user)
    }
  }
  return (
    <div key={note.id} className="bg-slate-300 p-4 my-2 flex justify-between">
      <div className="">
        <p>{user?.name}</p>
        <h1 className="text-2xl border-b-2 border-y-blue-800">{note.title}</h1>
        <p className="text-lg">{note.content}</p>
        <p className="text-l text-gray-500">{note.updatedAt.toString().split('T')[0]}</p>
      </div>
      <div className="flex gap-x-2">
        <button onClick={() => route.push(`?id=${note.id}`)}>Edit</button>
        <button onClick={() => deleteNote(note.id!,session?.user?.accessToken)}>Delete</button>
      </div>
    </div>
  )
}
