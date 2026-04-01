import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const { axios, login } = useAppContext()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) { toast.error('All fields are required'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }

    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password })
      if (data.success) {
        login(data.user, data.token)
        toast.success('Account created successfully!')
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-md'>
        <h2 className='text-3xl font-playfair text-center mb-2'>Create Account</h2>
        <p className='text-gray-500 text-sm text-center mb-8'>Join us and start booking luxury stays</p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='text-sm font-medium text-gray-600'>Full Name</label>
            <input
              type='text'
              placeholder='John Doe'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 mt-1 outline-none focus:border-blue-500 transition-all'
              required
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Email Address</label>
            <input
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 mt-1 outline-none focus:border-blue-500 transition-all'
              required
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-600'>Password</label>
            <input
              type='password'
              placeholder='Min. 6 characters'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 mt-1 outline-none focus:border-blue-500 transition-all'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md mt-2 transition-all disabled:opacity-60'
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className='text-center text-sm text-gray-500 mt-6'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 hover:underline font-medium'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register