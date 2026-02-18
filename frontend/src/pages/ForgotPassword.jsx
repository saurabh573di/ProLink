/*
  ForgotPassword.jsx
  - Password reset flow with 3 steps: Email -> OTP -> New Password
  - Uses React Hook Form for form management and validation
  - Step 1: Enter email and request OTP
  - Step 2: Enter OTP sent to email
  - Step 3: Enter new password to reset
*/
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import logo from "../assets/logo.svg"

function ForgotPassword() {
  const { serverUrl } = useContext(authDataContext)
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: email, 2: otp, 3: password
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  // Step 1: Request OTP
  const onSubmitEmail = async (data) => {
    setLoading(true)
    setError('')
    try {
      await axios.post(serverUrl + '/api/v1/auth/forgot-password', {
        email: data.email
      }, { withCredentials: true })
      
      setEmail(data.email)
      setMessage('OTP sent to your email. Check your inbox.')
      setStep(2)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const onSubmitOTP = async (data) => {
    setLoading(true)
    setError('')
    try {
      await axios.post(serverUrl + '/api/v1/auth/verify-otp', {
        email,
        otp: data.otp
      }, { withCredentials: true })
      
      setMessage('OTP verified. Enter your new password.')
      setStep(3)
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const onSubmitPassword = async (data) => {
    setLoading(true)
    setError('')
    try {
      await axios.post(serverUrl + '/api/v1/auth/reset-password', {
        email,
        newPassword: data.newPassword
      }, { withCredentials: true })
      
      setMessage('Password reset successfully. Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start gap-[10px]'>
      <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center'>
        <img src={logo} alt="Logo" />
      </div>

      <form className='w-[90%] max-w-[400px] md:shadow-xl flex flex-col justify-center gap-[15px] p-[15px]' onSubmit={handleSubmit(
        step === 1 ? onSubmitEmail : step === 2 ? onSubmitOTP : onSubmitPassword
      )}>
        <h1 className='text-gray-800 text-[30px] font-semibold mb-[15px]'>Reset Password</h1>
        <p className='text-gray-600 text-[14px] mb-[10px]'>
          Step {step} of 3
        </p>

        {/* Step 1: Email */}
        {step === 1 && (
          <div>
            <label className='text-gray-700 text-[14px] font-semibold'>Email Address</label>
            <input
              type="email"
              placeholder='Enter your email'
              className={`w-[100%] h-[50px] border-2 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md transition-colors mt-[5px] ${
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
            {errors.email && <p className='text-red-500 text-[12px] mt-[5px]'>{errors.email.message}</p>}
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div>
            <label className='text-gray-700 text-[14px] font-semibold'>Enter OTP</label>
            <p className='text-gray-500 text-[12px] mt-[5px] mb-[10px]'>
              We sent a 4-digit OTP to {email}
            </p>
            <input
              type="text"
              placeholder='0000'
              maxLength="4"
              className={`w-[100%] h-[50px] border-2 text-gray-800 text-[22px] px-[20px] py-[10px] rounded-md transition-colors text-center tracking-widest ${
                errors.otp ? 'border-red-500 bg-red-50' : 'border-gray-600'
              }`}
              {...register('otp', {
                required: 'OTP is required',
                minLength: {
                  value: 4,
                  message: 'OTP must be 4 digits'
                }
              })}
            />
            {errors.otp && <p className='text-red-500 text-[12px] mt-[5px]'>{errors.otp.message}</p>}
            <p className='text-gray-500 text-[12px] mt-[10px]'>OTP expires in 5 minutes</p>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <>
            <div>
              <label className='text-gray-700 text-[14px] font-semibold'>New Password</label>
              <input
                type="password"
                placeholder='At least 8 characters'
                className={`w-[100%] h-[50px] border-2 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md transition-colors mt-[5px] ${
                  errors.newPassword ? 'border-red-500 bg-red-50' : 'border-gray-600'
                }`}
                {...register('newPassword', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
              />
              {errors.newPassword && <p className='text-red-500 text-[12px] mt-[5px]'>{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className='text-gray-700 text-[14px] font-semibold'>Confirm Password</label>
              <input
                type="password"
                placeholder='Confirm your password'
                className={`w-[100%] h-[50px] border-2 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md transition-colors mt-[5px] ${
                  errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-600'
                }`}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('newPassword') || 'Passwords do not match'
                })}
              />
              {errors.confirmPassword && <p className='text-red-500 text-[12px] mt-[5px]'>{errors.confirmPassword.message}</p>}
            </div>
          </>
        )}

        {/* Error Message */}
        {error && <p className='text-center text-red-500 text-[14px] font-semibold'>*{error}</p>}

        {/* Success Message */}
        {message && <p className='text-center text-green-600 text-[14px] font-semibold'>{message}</p>}

        {/* Submit Button */}
        <button
          type='submit'
          className='w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[20px] text-white font-semibold hover:bg-[#2a9bd8] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
          disabled={loading}
        >
          {loading ? 'Loading...' : (
            step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'
          )}
        </button>

        {/* Back to Login */}
        <p className='text-center cursor-pointer'>
          Remember your password? <span className='text-[#2a9bd8] font-semibold hover:text-[#24b2ff]' onClick={() => navigate("/login")}>Sign In</span>
        </p>

        {/* Step Indicator */}
        <div className='flex gap-[8px] justify-center mt-[10px]'>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-[6px] w-[40px] rounded-full transition-colors ${
                s <= step ? 'bg-[#24b2ff]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword
