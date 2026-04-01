import React, { useState, useEffect } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const RecommendedHotel= () => {
  const { rooms, searchedCities } = useAppContext();
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();

  const filterHotels = () => {
    const filteredHotels = rooms.slice().filter(room =>
      searchedCities.includes(room.hotel?.city)
    );
    setRecommended(filteredHotels);
  }

  useEffect(() => {
    filterHotels()
  }, [rooms, searchedCities])

  return rooms.length > 0 && (
    <div className="px-6 py-10">
      <Title
        title='Recommended Destination'
        subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.'
      />
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(recommended.length > 0 ? recommended : rooms).slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => { navigate('/rooms'); scrollTo(0, 0) }}
          className='mt-16 mb-4 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-200 transition-all cursor-pointer'
        >
          View All Destinations
        </button>
      </div>
    </div>
  );
};

export default RecommendedHotel;