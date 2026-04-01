import React, { useState, useEffect } from 'react'
import Title from '../components/Title.jsx'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

const MyBookings = () => {

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const { axios } = useAppContext()

  // Fetch bookings
  const fetchBookings = async () => {
    try {

      const { data } = await axios.get('/api/booking/user')

      if (data.success) {
        setBookings(data.bookings)
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

    fetchBookings()

    // Stripe redirect verification
    const params = new URLSearchParams(window.location.search)

    const payment = params.get("payment")
    const bookingId = params.get("bookingId")

    if (payment === "success" && bookingId) {

      const verifyPayment = async () => {
        try {

          const { data } = await axios.post("/api/booking/verify-stripe", {
            bookingId
          })

          if (data.success) {

            toast.success("Payment successful!")

            fetchBookings()

            // Remove query params from URL
            window.history.replaceState({}, document.title, "/my-bookings")

          } else {
            toast.error(data.message)
          }

        } catch (error) {
          toast.error("Payment verification failed")
        }
      }

      verifyPayment()
    }

  }, [])


  // Stripe Payment Handler
  const handlePayment = async (booking) => {
    try {

      const { data } = await axios.post('/api/booking/stripe-session', {
        room: booking.room._id,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        guests: booking.guests
      })

      if (data.success) {

        window.location.href = data.sessionUrl

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }


  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>

      <Title
        title='My Booking'
        subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks'
        align='left'
      />

      <div className='max-w-6xl mt-8 w-full text-gray-800'>

        {/* Table Header */}
        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
          <div>Hotels</div>
          <div>Date & Timings</div>
          <div>Payment</div>
        </div>


        {loading ? (

          <p className='text-center py-10 text-gray-500'>
            Loading bookings...
          </p>

        ) : bookings.length === 0 ? (

          <p className='text-center py-10 text-gray-500'>
            No bookings found.
          </p>

        ) : (

          bookings.map((booking) => (

            <div
              key={booking._id}
              className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'
            >

              {/* Hotel Details */}
              <div className='flex flex-col md:flex-row'>

                <img
                  src={booking.room?.images?.[0] || assets.placeholderImage}
                  alt="hotel-img"
                  className='md:w-44 h-28 rounded-lg shadow object-cover'
                />

                <div className='flex flex-col gap-1.5 mt-3 md:ml-4'>

                  <p className='font-playfair text-2xl'>
                    {booking.hotel?.name}

                    <span className='font-inter text-sm'>
                      ({booking.room?.roomType})
                    </span>
                  </p>

                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span>{booking.hotel?.address}</span>
                  </div>

                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <img src={assets.guestsIcon} alt="guests-icon" />
                    <span>
                      {booking.guests} Guest{booking.guests > 1 ? 's' : ''}
                    </span>
                  </div>

                  <p className='text-base'>
                    Total: ₹{booking.totalPrice}
                  </p>

                </div>
              </div>


              {/* Date */}
              <div className='flex md:items-center gap-12 mt-3'>

                <div>
                  <p>Check-In:</p>
                  <p className='text-gray-500 text-sm'>
                    {new Date(booking.checkInDate).toDateString()}
                  </p>
                </div>

                <div>
                  <p>Check-Out:</p>
                  <p className='text-gray-500 text-sm'>
                    {new Date(booking.checkOutDate).toDateString()}
                  </p>
                </div>

              </div>


              {/* Payment Section */}
              <div className='flex flex-col items-start justify-center pt-3'>

                <div className='flex items-center gap-2'>

                  <div
                    className={`h-3 w-3 rounded-full ${
                      booking.isPaid ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>

                  <p
                    className={`text-sm ${
                      booking.isPaid ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {booking.isPaid ? "Paid" : "Unpaid"}
                  </p>

                </div>


                {!booking.isPaid && (

                  <button
                    onClick={() => handlePayment(booking)}
                    className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'
                  >
                    Pay Now
                  </button>

                )}

              </div>

            </div>

          ))

        )}

      </div>
    </div>
  )
}

export default MyBookings
