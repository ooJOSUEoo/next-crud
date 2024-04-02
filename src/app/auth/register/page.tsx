'use client'
import { useFormik } from 'formik';
import * as y from 'yup';

export default function RegisterPage() {
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
      },
    });

  return (
    <form onSubmit={handleSubmit}>
      <div className="">
        <input type="text" name="title" id="title" placeholder="Title"
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
      
      <button type="submit" 
      className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
        Login
      </button>
    </form>
  )
}
