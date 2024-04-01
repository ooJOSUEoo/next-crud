export default function NoteForm() {
  return (
    <form>
        <input type="text" name="title" id="title" autoFocus placeholder="Title"
        className="w-full px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring-2
        focus:ring-blue-600 my-2"
        />

        <textarea name="content" id="content" placeholder="Content"
        className="w-full px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring-2
        focus:ring-blue-600 my-2"
        />

        <button type="submit" 
        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Create
        </button>
    </form>
  )
}
