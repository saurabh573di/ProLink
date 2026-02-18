/*
  Login.jsx
  - Authentication page for existing users to sign in.
  - Uses React Hook Form for form management and validation.
  - Includes Google OAuth login option
  - Uses `authDataContext` for server URL and `userDataContext` to store logged-in user info.
  - On success: updates global user state and navigates to the home feed.
*/
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/UserContext'
import GoogleLoginButton from '../components/GoogleLoginButton'

function Login() {
  let [show, setShow] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  let { setUserData } = useContext(userDataContext)
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
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setServerErr("")
    try {
      let result = await axios.post(serverUrl + "/api/v1/auth/login", data, { withCredentials: true })
      setUserData(result.data)
      reset()
      navigate("/")
    } catch (error) {
      setServerErr(error?.response?.data?.message || "Login failed")
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
        <h1 className='text-gray-800 text-[30px] font-semibold mb-[15px]'>Sign In</h1>

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
              placeholder='Password'
              className={`w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] outline-none transition-all ${
                errors.password ? 'bg-red-50' : ''
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 1,
                  message: 'Password is required'
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

        {/* Forgot Password Link */}
        <div className='text-right'>
          <span 
            className='text-[#24b2ff] text-[12px] font-semibold hover:text-[#2a9bd8] cursor-pointer'
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </div>

        {/* Server Error */}
        {serverErr && <p className='text-center text-red-500 text-[14px] font-semibold'>*{serverErr}</p>}

        {/* Submit Button */}
        <button
          type='submit'
          className='w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[20px] text-white font-semibold hover:bg-[#2a9bd8] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        {/* Google Login Button */}
        <GoogleLoginButton />

        {/* Signup Link */}
        <p className='text-center cursor-pointer'>
          Want to create a new account? <span className='text-[#2a9bd8] font-semibold hover:text-[#24b2ff]' onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </form>
    </div>
  )
}

export default Login