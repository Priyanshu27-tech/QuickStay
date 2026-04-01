import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import { assets, facilityIcons } from "../assets/assets";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { rooms } = useAppContext();  // fix: was useAppContext (missing parentheses)
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  });
  const [selectedSort, setSelectedSort] = useState('');

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];
  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [type]: [...prevFilters[type]]
      };
      if (checked) {
        updatedFilters[type].push(value);
      } else {
        updatedFilters[type] = updatedFilters[type].filter(item => item !== value);
      }
      return updatedFilters;
    });
  }

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  }

  const matchesRoomType = (room) => {
    return selectedFilters.roomType.length === 0 ||
      selectedFilters.roomType.includes(room.roomType);
  }

  const matchesPriceRange = (room) => {
    return selectedFilters.priceRange.length === 0 ||
      selectedFilters.priceRange.some(range => {
        const [min, max] = range.split(' to ').map(Number);
        return room.pricePerNight >= min && room.pricePerNight <= max;
      });
  }

  const sortRooms = (a, b) => {
    if (selectedSort === 'Price Low to High') return a.pricePerNight - b.pricePerNight;  // fix: was a-a
    if (selectedSort === 'Price High to Low') return b.pricePerNight - a.pricePerNight;
    if (selectedSort === 'Newest First') return new Date(b.createdAt) - new Date(a.createdAt);  // fix: new date → new Date
    return 0;
  }

  const filterDestination = (room) => {
    const destination = searchParams.get('destination');
    if (!destination) return true;
    return room.hotel?.city?.toLowerCase().includes(destination.toLowerCase());
  }

  const filteredRooms = useMemo(() => {
    return rooms
      .filter(room =>
        matchesRoomType(room) &&
        matchesPriceRange(room) &&
        filterDestination(room)
      )
      .sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, searchParams]);

  const clearFilters = () => {
    setSelectedFilters({ roomType: [], priceRange: [] });
    setSelectedSort('');
    setSearchParams({});
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-10 pt-28 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Rooms Section */}
      <div className="w-full">
        <div className="mb-10">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-gray-500 mt-2 max-w-2xl">
            Take advantage of our limited-time offers and special packages
            to enhance your stay and create unforgettable memories.
          </p>
        </div>

        {filteredRooms.length === 0 ? (
          <p className="text-gray-500 text-center py-20">No rooms found.</p>
        ) : (
          filteredRooms.map((room) => (
            <div key={room._id} className="flex flex-col md:flex-row gap-6 mb-10">
              <img
                onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0); }}
                src={room.images?.[0]}
                alt=""
                className="max-h-64 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
              />
              <div className="md:w-1/2 flex flex-col gap-2">
                <p className="text-gray-500">{room.hotel?.city}</p>
                <p
                  onClick={() => navigate(`/rooms/${room._id}`)}
                  className="text-3xl font-playfair cursor-pointer"
                >
                  {room.hotel?.name}
                </p>
                <div className="flex items-center">
                  <StarRating />
                  <p className="ml-2">200+ reviews</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <img src={assets.locationIcon} className="w-4 h-4" alt="" />
                  <span>{room.hotel?.address}</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  {room.amenities?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]">
                      <img src={facilityIcons[item]} className="w-4 h-4" alt={item} />
                      <p className="text-xs">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xl font-medium text-gray-700">
                  ₹ {room.pricePerNight} /night
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filters */}
      <div className="bg-white w-80 border rounded-lg p-5 text-gray-600 h-fit">
        <div className="flex justify-between items-center border-b pb-3">
          <p className="font-medium text-gray-800">FILTERS</p>
          <span
            onClick={() => setOpenFilters(!openFilters)}
            className="text-xs cursor-pointer lg:hidden"
          >
            {openFilters ? "HIDE" : "SHOW"}
          </span>
          <span
            onClick={clearFilters}
            className="hidden lg:block text-xs cursor-pointer text-blue-500 hover:underline"
          >
            CLEAR
          </span>
        </div>

        <div className={`${openFilters ? "block" : "hidden lg:block"}`}>
          <div className="mt-5">
            <p className="font-medium text-gray-800 mb-2">Popular filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index} label={room}
                selected={selectedFilters.roomType.includes(room)}
                onChange={(checked) => handleFilterChange(checked, room, 'roomType')}
              />
            ))}
          </div>

          <div className="mt-6">
            <p className="font-medium text-gray-800 mb-2">Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index} label={`₹ ${range}`}
                selected={selectedFilters.priceRange.includes(range)}
                onChange={(checked) => handleFilterChange(checked, range, 'priceRange')}
              />
            ))}
          </div>

          <div className="mt-6">
            <p className="font-medium text-gray-800 mb-2">Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index} label={option}
                selected={selectedSort === option}
                onChange={() => handleSortChange(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;