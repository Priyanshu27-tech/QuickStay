import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'   // ✅ FIX

const HotelCard = ({ room, index }) => {
  return (
    <Link to={'/rooms/' + room._id} onClick={() => scrollTo(0, 0)}>

      <div className="relative">

        <img
          src={room.images[0]}
          alt=""
          className="w-full rounded-xl overflow-hidden bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.05)]"
        />

        {index % 2 === 0 && (
          <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full">
            Best Seller
          </p>
        )}

      </div>

      <div className="pt-4">

        <div className="flex items-center justify-between">
          <p className="font-playfair text-xl font-medium text-gray-800">
            {room.hotel.name}
          </p>

          <div className="flex items-center gap-1">
            <img src={assets.starIconFilled} alt="star-icon" className="w-4" />
            <span className="text-sm">4.5</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <img src={assets.locationIcon} alt="location-icon" className="w-4" />
          <span>{room.hotel.address}</span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <p>
            <span className="text-xl font-semibold text-gray-800">
              ₹{room.pricePerNight}
            </span>
            <span className="text-sm text-gray-500"> / night</span>
          </p>

          <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all">
            Book Now
          </button>
        </div>

      </div>
    </Link>
  )
}

export default HotelCard