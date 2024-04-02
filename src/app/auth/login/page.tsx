'use client'
import axios from 'axios';
import { useFormik } from 'formik';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as y from 'yup';

export default function LoginPage() {
  const router = useRouter();
  const Schemas = y.object().shape({
      email: y.string().email('Invalid email').required('Email is required'),
      password: y.string().required('Password is required'),
    });
  const [error, setError] = useState('')
  const { values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm, setFieldValue } = useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: Schemas,
      onSubmit:async(values) => { 
        const resp = await signIn('credentials', {
          email: values.email, 
          password: values.password,
          redirect: false
        });
        console.log(resp)
        if(resp?.error) {
          setError(resp.error)
        }else{
          router.push('/')
        }
      },
    });

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className='w-1/3 border-2 p-2 rounded-3xl'>
        {error && <p className="bg-red-500 text-white rounded-md px-2 flex justify-center">{error}</p>}
        <h1 className='text-2xl text-yellow-50'>Login</h1>

        <div className="">
          <input type="email" name="email" id="email" placeholder="Email"
          className="w-full px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring-2
          focus:ring-blue-600 my-2"
          value={values.email} 
          onChange={handleChange}
          onBlur={handleBlur}
          />
          {errors.email && touched.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <div className="">
          <input type="password" name="password" id="password" placeholder="Password"
          className="w-full px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring-2
          focus:ring-blue-600 my-2"
          value={values.password} 
          onChange={handleChange}
          onBlur={handleBlur}
          />
          {errors.password && touched.password && <p className="text-red-500">{errors.password}</p>}
        </div>

        <div className="flex flex-col">
          <button type="submit" 
          className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600">
            Login
          </button>

          <button type="button" 
          className='px-4 py-2 text-whited hover:underline text-blue-600 my-2'
          onClick={() => router.push('/auth/register')}>I don&apos;t have an account</button>

          <div className="w-full h-0.5 bg-gray-200 mb-3"></div>

          <button type="button" 
          className='px-4 py-2 text-white  bg-blue-500 rounded-md hover:bg-blue-600'
          onClick={() => signIn('google',{callbackUrl: '/'})}>Google</button>
        </div>
      </form>
    </div>
  )
}
