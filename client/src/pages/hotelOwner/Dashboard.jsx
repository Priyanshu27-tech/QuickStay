import React, { useState, useEffect } from 'react'
import Title from '../../components/title.jsx'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext.jsx'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { axios } = useAppContext()
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    bookings: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token")
        const { data } = await axios.get('/api/booking/hotel', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (data.success) {
          setDashboardData(data.dashboardData)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  return (
    <div>
      <Title
        align='left' font='outfit' title='Dashboard'
        subTitle='Monitor your room listings, track bookings and analyze revenue - all in one place. Stay updated with real-time insights to ensure smooth operations.'
      />
      <div className='flex gap-4 my-8'>
        {/* Total Bookings */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
          <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10' />
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Bookings</p>
            <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
          </div>
        </div>
        {/* Total Revenue */}
        <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
          <img src={assets.totalRevenueIcon} alt="" className='max-sm:hidden h-10' />
          <div className='flex flex-col sm:ml-4 font-medium'>
            <p className='text-blue-500 text-lg'>Total Revenue</p>
            <p className='text-neutral-400 text-base'>₹{dashboardData.totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>
      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
        {loading ? (
          <p className='text-center py-6 text-gray-500'>Loading...</p>
        ) : dashboardData.bookings.length === 0 ? (
          <p className='text-center py-6 text-gray-500'>No bookings yet.</p>
        ) : (
          <table className='w-full'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Room Name</th>
                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Total Amount</th>
                <th className='py-3 px-4 text-gray-800 font-medium text-center'>Payment Status</th>
              </tr>
            </thead>
            <tbody className='text-sm'>
              {dashboardData.bookings.map((item, index) => (
                <tr key={index}>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                    {item.user?.name}
                  </td>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                    {item.room?.roomType}
                  </td>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                    ₹{item.totalPrice}
                  </td>
                  <td className='py-3 px-4 text-gray-700 border-t border-gray-300 flex'>
                    <button className={`py-1 px-3 text-xs rounded-full mx-auto 
                      ${item.isPaid ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                      {item.isPaid ? 'Completed' : 'Pending'}
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

export default Dashboard