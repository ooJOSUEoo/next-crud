'use client'
import axios from 'axios';
import { useFormik } from 'formik';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as y from 'yup';

export default function RegisterPage() {
  const router = useRouter();
  const Schemas = y.object().shape({
      username: y.string().required('Username is required'),
      email: y.string().email('Invalid email').required('Email is required'),
      password: y.string().required('Password is required'),
      confirmPassword: y.string().oneOf([y.ref('password')], 'Passwords must match'),
    });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit, resetForm, setFieldValue } = useFormik({
      initialValues: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      validationSchema: Schemas,
      onSubmit:async(values) => { 
        const resp = await axios.post('/api/auth/register', {
          username: values.username,
          email: values.email,
          password: values.password
        });
        console.log(resp)
        if(resp.status === 200) {
          resetForm();
          router.push('/auth/login');
          // signIn('credentials', {email: values.email, password: values.password});
        }
      },
    });

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className='w-1/3 border-2 p-2 rounded-3xl'>
        <h1 className='text-2xl text-yellow-50'>Register</h1>
        <div className="">
          <input type="text" name="username" id="username" placeholder="Username"
          className="w-full px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring-2
          focus:ring-blue-600 my-2"
          value={values.username} 
          onChange={handleChange}
          onBlur={handleBlur}
          />
          {errors.username && touched.username && <p className="text-red-500">{errors.username}</p>}
        </div>

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

        <div className="">
          <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password"
          className="w-full px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring-2
          focus:ring-blue-600 my-2"
          value={values.confirmPassword} 
          onChange={handleChange}
          onBlur={handleBlur}
          />
          {errors.confirmPassword && touched.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
        </div>
        
        <div className="flex flex-col">
          <button type="submit" 
          className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600">
            Register
          </button>

          <button type="button" 
          className='px-4 py-2 text-whited hover:underline text-blue-600 my-2'
          onClick={() => router.push('/auth/login')}>I already have an account</button>
        </div>
      </form>
    </div>
  )
}
