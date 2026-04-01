import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast'
import LocationMap from "./LocationMap"

const HotelReg = () => {

    const { setShowHotelReg, axios, setIsOwner, user, setUser } = useAppContext()

    const [name, setName] = useState("")
    const [city, setCity] = useState("")
    const [address, setAddress] = useState("")
    const [contact, setContact] = useState("")
    const [location, setLocation] = useState(null)

    const onSubmitHandler = async (event) => {

        try {

            event.preventDefault()

            if (!location) {
                toast.error("Please select hotel location")
                return
            }

            const { data } = await axios.post("/api/hotels/register", {
                name,
                contact,
                city,
                address,
                location
            })

            if (data.success) {

                toast.success(data.message)

                setIsOwner(true)

                const updatedUser = { ...user, role: "hotelOwner" }

                localStorage.setItem("user", JSON.stringify(updatedUser))

                setUser(updatedUser)

                setShowHotelReg(false)

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Search location from text input
    const searchLocation = async () => {

        if (!address) return

        try {

            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
            )

            const data = await res.json()

            if (data.length > 0) {

                const coords = {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                }

                setLocation(coords)

            } else {
                toast.error("Location not found")
            }

        } catch (error) {
            toast.error("Error finding location")
        }
    }

    return (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/70'>

            <form
                onSubmit={onSubmitHandler}
                className='flex bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden max-md:mx-2'
            >

                {/* Left Image */}
                <img
                    src={assets.regImage}
                    alt="reg-image"
                    className='w-1/2 rounded-xl hidden md:block object-cover'
                />

                {/* Right Form */}
                <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10 overflow-y-auto max-h-[90vh]'>

                    {/* Close Button */}
                    <img
                        src={assets.closeIcon}
                        alt="close-icon"
                        className='absolute top-4 right-4 h-4 w-4 cursor-pointer'
                        onClick={() => setShowHotelReg(false)}
                    />

                    <p className='text-2xl font-semibold mt-6'>
                        Register Your Hotel
                    </p>

                    {/* Hotel Name */}
                    <div className='w-full mt-4'>
                        <label className="font-medium text-gray-500">
                            Hotel Name
                        </label>

                        <input
                            type="text"
                            placeholder="Type here"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full border border-gray-300 rounded p-2 mt-1 outline-none'
                            required
                        />
                    </div>

                    {/* City */}
                    <div className='w-full mt-4'>
                        <label className="font-medium text-gray-500">
                            City
                        </label>

                        <select
                            value={city}
                            onChange={(e)=>setCity(e.target.value)}
                            className='w-full border border-gray-300 rounded p-2 mt-1 outline-none'
                            required
                        >
                            <option value="">Select City</option>

                            {cities.map((c,i)=>(
                                <option key={i} value={c}>
                                    {c}
                                </option>
                            ))}

                        </select>
                    </div>

                    {/* Address */}
                    <div className='w-full mt-4'>
                        <label className="font-medium text-gray-500">
                            Location / Address
                        </label>

                        <input
                            type="text"
                            placeholder="Type location or click map"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className='w-full border border-gray-300 rounded p-2 mt-1 outline-none'
                        />

                        <button
                            type="button"
                            onClick={searchLocation}
                            className="bg-gray-200 px-3 py-1 rounded mt-2 text-sm"
                        >
                            Find on Map
                        </button>
                    </div>

                    {/* Contact */}
                    <div className='w-full mt-4'>
                        <label className="font-medium text-gray-500">
                            Contact
                        </label>

                        <input
                            type="text"
                            placeholder="Type here"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className='w-full border border-gray-300 rounded p-2 mt-1 outline-none'
                            required
                        />
                    </div>

                    {/* Map */}
                    <div className='w-full mt-4'>
                        <label className="font-medium text-gray-500">
                            Select Hotel Location
                        </label>

                        <div className='mt-2 rounded overflow-hidden'>

                            <LocationMap
                                location={location}
                                setLocation={async (coords) => {

                                    setLocation(coords)

                                    try {

                                        const res = await fetch(
                                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
                                        )

                                        const data = await res.json()

                                        if (data.display_name) {
                                            setAddress(data.display_name)
                                        }

                                    } catch (error) {
                                        console.log(error)
                                    }

                                }}
                            />

                        </div>

                        {location && (
                            <p className='text-sm mt-2 text-gray-600'>
                                Latitude: {location.lat.toFixed(5)} <br />
                                Longitude: {location.lng.toFixed(5)}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className='bg-blue-600 hover:bg-blue-700 transition-all text-white rounded-md py-2 px-4 mt-6 w-full'
                    >
                        Register
                    </button>

                </div>

            </form>

        </div>
    )
}

export default HotelReg
