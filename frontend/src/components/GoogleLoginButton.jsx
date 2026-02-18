/*
  GoogleLoginButton.jsx
  - Google OAuth login button using Google Sign-In library
  - Handles user authentication with Google
  - Sends credentials to backend for user creation/login
*/

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'

function GoogleLoginButton() {
  const { serverUrl } = useContext(authDataContext)
  const { setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    // Load Google Sign-In library and initialize
    const loadGoogleSignIn = () => {
      if (!window.google) {
        console.error('Google Sign-In library not loaded')
        return
      }

      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          use_fedcm_for_prompt: false, // Disable FedCM to avoid migration warnings
        })

        // Render the Google Sign-In button
        const container = document.getElementById('google-signin-btn')
        if (container) {
          window.google.accounts.id.renderButton(container, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with'
          })
        }
      } catch (err) {
        console.error('Error initializing Google Sign-In:', err)
        setError('Failed to initialize Google Sign-In')
      }
    }

    // Load the Google Sign-In script
    if (document.querySelector('script[src*="accounts.google.com"]')) {
      // Script already loaded
      loadGoogleSignIn()
    } else {
      // Load the script
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = loadGoogleSignIn
      script.onerror = () => {
        console.error('Failed to load Google Sign-In library')
        setError('Failed to load Google Sign-In')
      }
      document.head.appendChild(script)
    }

    return () => {
      // Cleanup
      if (window.google) {
        window.google.accounts.id.cancel()
      }
    }
  }, [])

  const handleCredentialResponse = async (response) => {
    setError('')

    try {
      // Decode JWT token from Google
      const base64Url = response.credential.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const decoded = JSON.parse(jsonPayload)

      // Send to backend for authentication
      const result = await axios.post(
        serverUrl + '/api/v1/auth/google',
        {
          firstName: decoded.given_name || 'User',
          lastName: decoded.family_name || '',
          email: decoded.email
        },
        { withCredentials: true }
      )

      // Store user data and redirect
      setUserData(result.data.user)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Google login failed. Please check console.')
      console.error('Google login error:', err)
    }
  }

  return (
    <div className='w-full flex flex-col items-center gap-3'>
      {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
      <div
        id='google-signin-btn'
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
      />
    </div>
  )
}

export default GoogleLoginButton
