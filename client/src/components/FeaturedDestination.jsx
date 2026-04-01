import React from "react";

import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const FeaturedDestination = () => {
  const {rooms}=useAppContext();
  const navigate=useNavigate()
  return rooms.length>0 &&(
    <div className="px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6"></h2>
      <Title title='Featured Destination' subTitle= 'Discover our handpicked selection of the exceptional properties around the world,offering unparalled luxury and unforgettable experience.'/>
      <br/>
      <br/>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
      <div className="flex justify-center">
  <button 
    onClick={() => { navigate('/rooms'); scrollTo(0,0) }}
    className='mt-16 mb-4 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-200 transition-all cursor-pointer'
  >
    View All Destinations
  </button>
</div>
    </div>
  );
};

export default FeaturedDestination;