import NoteForm from "@/components/NoteForm"
import axios from "axios"

const loadNotes = async () => {
    const resp = (await axios.get('http://localhost:3000/api/notes'))
    return resp.data
}

export default async function HomePage() {
    const {notes} = await loadNotes()
    console.log(notes)
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="">
            <NoteForm />
            {
              notes.map((note:any) => <div key={note.id} className="bg-slate-300 p-4 my-2">
                <h1 className="text-2xl border-b-2 border-y-blue-800">{note.title}</h1>
                <p>{note.content}</p>
              </div>)
            }
          </div>
        </div>
    )
}
