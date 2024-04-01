'use client'
import { useNoteStore } from '@/context/notecontext';
import { Note } from '@prisma/client';
import axios from 'axios';
import { useFormik } from 'formik';
// import { useRouter as useLocation } from 'next/router';
import { useRouter,useSearchParams } from 'next/navigation';
import { title } from 'process';
import { useEffect, useState } from 'react';
import * as y from 'yup';

export default function NoteForm() {
  const router = useRouter()
  const params = useSearchParams()
  const Schemas = y.object().shape({
    title: y.string().required('Title is required'),
    content: y.string(),
  });
  const {notes, setNote, updateNote} = useNoteStore(s=>s)

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm, setFieldValue } = useFormik({
    initialValues: {
      title: '',
      content: '',
    },
    validationSchema: Schemas,
    onSubmit:async(values) => {  
      if(params.get('id')){
        updateNote(Number(params.get('id')),values.title,values.content)
      }else{
        setNote(values.title,values.content)
      }
      resetForm()
    },
  });

  useEffect(() => {
    const id = params.get('id')
    if(id){
      setFieldValue('title', notes.find((note:Note) => note.id === Number(id))?.title)
      setFieldValue('content', notes.find((note:Note) => note.id === Number(id))?.content)
    }
  }, [notes, params, setFieldValue])

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
        <div className=" flex justify-between">
        <button type="submit" 
        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            {
              params.get('id') ? 'Update' : 'Save'
            }
        </button>
        {
          params.get('id') && 
          <button onClick={() => {resetForm();router.push('/');}} type='button' className='px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600'>x</button>
        }
        </div>
    </form>
  )
}
