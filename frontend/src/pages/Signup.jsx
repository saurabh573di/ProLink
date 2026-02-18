/*
  Signup.jsx
  - User registration page. Collects basic user info and creates an account.
  - Uses React Hook Form for form management and validation.
  - Includes Google OAuth signup option
  - On successful signup the user is stored in `userDataContext` and redirected to home.
*/
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/UserContext'
import GoogleLoginButton from '../components/GoogleLoginButton'

function Signup() {
  let [show, setShow] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  let { userData, setUserData } = useContext(userDataContext)
  let navigate = useNavigate()
  let [serverErr, setServerErr] = useState("")
  let [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setServerErr("")
    try {
      let result = await axios.post(serverUrl + "/api/v1/auth/signup", data, { withCredentials: true })
      console.log(result)
      setUserData(result.data)
      reset()
      navigate("/")
    } catch (error) {
      setServerErr(error?.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start gap-[10px]'>
      <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center'>
        <img src={logo} alt="Logo" />
      </div>
      <form className='w-[90%] max-w-[400px] md:shadow-xl flex flex-col justify-center gap-[15px] p-[15px]' onSubmit={handleSubmit(onSubmit)}>
        <h1 className='text-gray-800 text-[30px] font-semibold mb-[15px]'>Sign Up</h1>

        {/* First Name */}
        <div>
          <input
            type="text"
            placeholder='First Name'
            className={`w-[100%] h-[50px] border-2 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md transition-colors ${
              errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-600'
            }`}
            {...register('firstName', {
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters'
              },
              maxLength: {
                value: 50,
                message: 'First name must not exceed 50 characters'
              }
            })}
          />
          {errors.firstName && <p className='text-red-500 text-[12px] mt-[5px] ml-[5px]'>{errors.firstName.message}</p>}
        </div>

        {/* Last Name */}
        <div>
          <input
            type="text"
            placeholder='Last Name'
            className={`w-[100%] h-[50px] border-2 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md transition-colors ${
              errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-600'
            }`}
            {...register('lastName', {
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters'
              },
              maxLength: {
                value: 50,
                message: 'Last name must not exceed 50 characters'
              }
            })}
          />
          {errors.lastName && <p className='text-red-500 text-[12px] mt-[5px] ml-[5px]'>{errors.lastName.message}</p>}
        </div>

        {/* Username */}
        <div>
          <input
            type="text"
            placeholder='Username (letters, numbers, dots, dashes, underscores)'
            className={`w-[100%] h-[50px] border-2 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md transition-colors ${
              errors.userName ? 'border-red-500 bg-red-50' : 'border-gray-600'
            }`}
            {...register('userName', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              },
              maxLength: {
                value: 30,
                message: 'Username must not exceed 30 characters'
              },
              pattern: {
                value: /^[a-zA-Z0-9._-]+$/,
                message: 'Username can only contain letters, numbers, dots (.), dashes (-), and underscores (_)'
              }
            })}
          />
          <p className='text-[12px] text-gray-500 mt-[5px] ml-[5px]'>Allowed: letters, numbers, . - _ (no spaces)</p>
          {errors.userName && <p className='text-red-500 text-[12px] mt-[5px] ml-[5px]'>{errors.userName.message}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder='Email'
            className={`w-[100%] h-[50px] border-2 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md transition-colors ${
              errors.email ? 'border-red-500 bg-red-50' : 'border-gray-600'
            }`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
              }
            })}
          />
          {errors.email && <p className='text-red-500 text-[12px] mt-[5px] ml-[5px]'>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative flex items-center overflow-hidden'>
            <input
              type={show ? "text" : "password"}
              placeholder='Password (min 8 characters)'
              className={`w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] outline-none transition-all ${
                errors.password ? 'bg-red-50' : ''
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                maxLength: {
                  value: 100,
                  message: 'Password must not exceed 100 characters'
                }
              })}
            />
            <span
              className='absolute right-[20px] text-[#24b2ff] cursor-pointer font-semibold hover:text-[#2a9bd8]'
              onClick={() => setShow(prev => !prev)}
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>
          {errors.password && <p className='text-red-500 text-[12px] mt-[5px] ml-[5px]'>{errors.password.message}</p>}
        </div>

        {/* Server Error */}
        {serverErr && <p className='text-center text-red-500 text-[14px] font-semibold'>*{serverErr}</p>}

        {/* Submit Button */}
        <button
          type='submit'
          className='w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[20px] text-white font-semibold hover:bg-[#2a9bd8] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        {/* Google Login Button */}
        <GoogleLoginButton />

        {/* Login Link */}
        <p className='text-center cursor-pointer'>
          Already have an account? <span className='text-[#2a9bd8] font-semibold hover:text-[#24b2ff]' onClick={() => navigate("/login")}>Sign In</span>
        </p>
      </form>
    </div>
  )
}

export default Signup