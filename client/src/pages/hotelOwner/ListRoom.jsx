import React, { useState, useEffect } from 'react'
import Title from '../../components/Title.jsx'
import { useAppContext } from '../../context/AppContext.jsx'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ListRoom = () => {

  const { axios } = useAppContext()
  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRooms = async () => {
    try {

      const { data } = await axios.get('/api/rooms/owner')

      if (data.success) {
        setRooms(data.rooms)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const toggleAvailability = async (roomId) => {

    try {

      const { data } = await axios.post('/api/rooms/toggle-availability', { roomId })

      if (data.success) {
        toast.success(data.message)
        fetchRooms()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (roomId) => {

    if (!window.confirm("Are you sure you want to delete this room?")) return

    try {

      const { data } = await axios.delete("/api/rooms/delete-room", {
        data: { roomId }
      })

      if (data.success) {
        toast.success(data.message)
        fetchRooms()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div>

      <Title
        align='left'
        font='outfit'
        title='Room Listings'
        subTitle='View, edit or manage all listed rooms. Keep information up-to-date to provide the best experience for users.'
      />

      <p className='text-gray-500 mt-8'>All Rooms</p>

      <div className='w-full max-w-4xl text-left border border-gray-300 rounded-lg max-h-96 overflow-y-scroll mt-3'>

        {loading ? (
          <p className='text-center py-6 text-gray-500'>Loading...</p>

        ) : rooms.length === 0 ? (
          <p className='text-center py-6 text-gray-500'>No rooms added yet.</p>

        ) : (

          <table className='w-full'>

            <thead className='bg-gray-100'>
              <tr>
                <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
                <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Price/night</th>
                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Available</th>
                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
              </tr>
            </thead>

            <tbody className='text-sm'>

              {rooms.map((item, index) => (

                <tr key={index}>

                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                    {item.roomType}
                  </td>

                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                    {item.amenities.join(', ')}
                  </td>

                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                    ₹{item.pricePerNight}
                  </td>

                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>

                    <label className="relative inline-flex items-center cursor-pointer gap-3">

                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.isAvailable}
                        onChange={() => toggleAvailability(item._id)}
                      />

                      <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200"></div>

                      <span className="pointer-events-none absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>

                    </label>

                  </td>

                  {/* ACTION BUTTONS */}

                  <td className='py-3 px-4 border-t border-gray-300 text-center space-x-2'>

                    <button
                      onClick={() => navigate(`/owner/edit-room/${item._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  )
}

export default ListRoom