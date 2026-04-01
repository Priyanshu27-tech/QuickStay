import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { facilityIcons, roomCommonData, assets } from '../assets/assets'
import StarRating from '../components/StarRating'
import ownerImg from '../assets/ownerImg.jpeg'
import { useAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'

const RoomDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { axios, user } = useAppContext()

  const [room, setRoom] = useState(null)
  const [mainImage, setMainImage] = useState(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const [stripeLoading, setStripeLoading] = useState(false)

  // Check payment status on return from Stripe
  useEffect(() => {
    const payment = searchParams.get('payment')
    const bookingId = searchParams.get('bookingId')

    if (payment === 'success' && bookingId) {
      // Verify payment on server
      axios.post('/api/booking/verify-stripe', { bookingId })
        .then(({ data }) => {
          if (data.success) {
            toast.success('Payment successful! Booking confirmed 🎉')
            navigate('/my-bookings')
          }
        })
        .catch(() => toast.error('Payment verification failed'))
    }

    if (payment === 'cancelled') {
      toast.error('Payment cancelled.')
    }
  }, [])

  // Fetch room
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get('/api/rooms')
        const found = data.rooms?.find(r => r._id === id)
        if (found) {
          setRoom(found)
          setMainImage(found.images[0])
        }
      } catch (error) {
        toast.error('Failed to load room details')
      }
    }
    fetchRoom()
  }, [id])

  const validateForm = () => {
    if (!user) { toast.error('Please login to book a room'); navigate('/login'); return false }
    if (!checkIn || !checkOut) { toast.error('Please select check-in and check-out dates'); return false }
    if (new Date(checkOut) <= new Date(checkIn)) { toast.error('Check-out must be after check-in'); return false }
    if (!room.isAvailable) { toast.error('Room is currently not available'); return false }
    return true
  }

  // Pay at Hotel
  const handleBooking = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const { data } = await axios.post('/api/booking/book', {
        room: id, checkInDate: checkIn, checkOutDate: checkOut, guests
      })
      if (data.success) {
        toast.success('Booking confirmed!')
        navigate('/my-bookings')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Pay with Stripe
  const handleStripePayment = async () => {
    if (!validateForm()) return

    setStripeLoading(true)
    try {
      const { data } = await axios.post('/api/booking/stripe-session', {
        room: id, checkInDate: checkIn, checkOutDate: checkOut, guests
      })
      if (data.success) {
        window.location.href = data.sessionUrl // redirect to Stripe
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setStripeLoading(false)
    }
  }

  if (!room) return null

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-playfair">
          {room.hotel.name}
          <span className="font-inter text-sm"> ({room.roomType}) </span>
        </h1>
        <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
          20% OFF
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-2">
        <StarRating />
        <p className="ml-2">200+ reviews</p>
      </div>

      {/* Address */}
      <div className="flex items-center gap-1 text-gray-500 mt-2">
        <img src={assets.locationIcon} alt="location" />
        <span>{room.hotel.address}</span>
      </div>

      {/* Images */}
      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div className="lg:w-1/2 w-full">
          <img src={mainImage} alt="Room" className="w-full rounded-xl shadow-lg object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
          {room.images.map((image, index) => (
            <img
              key={index} src={image} alt="Room"
              onClick={() => setMainImage(image)}
              className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                mainImage === image && "outline outline-3 outline-orange-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row justify-between mt-12 gap-12">

        {/* LEFT */}
        <div className="lg:w-2/3">
          <h1 className="text-3xl md:text-4xl font-playfair">
            Experience Luxury Like Never Before
          </h1>

          {/* Amenities */}
          <div className="flex flex-wrap gap-3 mt-6">
            {room.amenities.map((item, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
                {facilityIcons[item] && <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />}
                <p className="text-xs">{item}</p>
              </div>
            ))}
          </div>

          <p className="text-2xl font-medium mt-6">₹{room.pricePerNight}/night</p>

          <div className="mt-12 space-y-4">
            {roomCommonData.map((spec, index) => (
              <div key={index} className="flex items-start gap-3">
                <img src={spec.icon} alt={spec.title} />
                <div>
                  <p className="text-base">{spec.title}</p>
                  <p className="text-gray-500">{spec.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl border-y border-gray-300 my-12 py-10 text-gray-500">
            <p>Guests will be allocated on the ground floor according to availability.
              You get a comfortable Two bedroom apartment has a true city feeling.</p>
          </div>

          <div className="flex flex-col items-start gap-4">
            <div className="flex gap-4">
              <img src={ownerImg} alt="Host" className="h-14 w-14 md:h-18 md:w-18 rounded-full" />
              <div>
                <p className="text-lg md:text-xl">Hosted by {room.hotel.name}</p>
                <div className="flex items-center mt-1">
                  <StarRating />
                  <p className="ml-2">200+ reviews</p>
                </div>
              </div>
            </div>
            <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all">
              Contact Now
            </button>
          </div>
        </div>

        {/* RIGHT BOOKING FORM */}
        <div className="lg:w-1/3">
          <form onSubmit={handleBooking} className="bg-white shadow-xl rounded-xl p-6 space-y-4">

            <div>
              <label className="text-gray-600 text-sm font-medium">Check-In</label>
              <input
                type="date" value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="border border-gray-300 rounded-md px-3 py-2 w-full mt-1 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">Check-Out</label>
              <input
                type="date" value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="border border-gray-300 rounded-md px-3 py-2 w-full mt-1 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm font-medium">Guests</label>
              <input
                type="number" value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                min={1} max={6}
                className="border border-gray-300 rounded-md px-3 py-2 w-full mt-1 outline-none"
                required
              />
            </div>

            {/* Pay at Hotel */}
            <button
              type="submit"
              disabled={loading || !room.isAvailable}
              className={`py-3 w-full rounded-md transition-all font-medium
              ${room.isAvailable
                ? "bg-gray-800 hover:bg-gray-900 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              {loading ? "Booking..." : room.isAvailable ? "Pay At Hotel" : "Not Available"}
            </button>

            {/* Pay with Stripe */}
            {room.isAvailable && (
              <button
                type="button"
                onClick={handleStripePayment}
                disabled={stripeLoading}
                className="py-3 w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all disabled:opacity-60"
              >
                {stripeLoading ? "Redirecting..." : "Pay Now with Card 💳"}
              </button>
            )}

          </form>
        </div>

      </div>
    </div>
  )
}

export default RoomDetails
