'use client'
import { useNoteStore } from '@/context/notecontext';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { title } from 'process';
import * as y from 'yup';

export default function NoteForm() {
  const router = useRouter()
  const Schemas = y.object().shape({
    title: y.string().required('Title is required'),
    content: y.string(),
  });
  const {setNote} = useNoteStore(s=>s)

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues: {
      title: '',
      content: '',
    },
    validationSchema: Schemas,
    onSubmit:async(values) => {  
        setNote(values.title,values.content)
        resetForm()
    },
  });

  return (
    <form onSubmit={handleSubmit}>
        <div className="">
        <input type="text" name="title" id="title" placeholder="Title"
        className="w-full px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring-2
        focus:ring-blue-600 my-2"
        value={values.title} 
        onChange={handleChange}
        onBlur={handleBlur}
        />
        {errors.title && touched.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <textarea name="content" id="content" placeholder="Content"
        className="w-full px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring-2
        focus:ring-blue-600 my-2"
        value={values.content}
        onChange={handleChange}
        onBlur={handleBlur}
        />
        <button type="submit" 
        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Create
        </button>
    </form>
  )
}
