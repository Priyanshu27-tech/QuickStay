import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext.jsx'

const Navbar = () => {
  const { user, logout } = useAppContext()

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-300 bg-white transition-all duration-300'>
      <Link to='/'>
        <img src={assets.logo} alt="logo" className='h-9 invert opacity-80' />
      </Link>

      <div className='flex items-center gap-3'>
        <p className='text-sm text-gray-600'>Hi, {user?.name}</p>
        <button
          onClick={logout}
          className='bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-full transition-all'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar