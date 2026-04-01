import React, { useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/title.jsx";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";

const AddRoom = () => {
  const { axios } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: "",
    amenities: {
      "Free WiFi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputs.roomType) { toast.error("Please select a room type"); return; }
    if (!inputs.pricePerNight || inputs.pricePerNight <= 0) { toast.error("Please enter a valid price"); return; }
    const hasImage = Object.values(images).some((img) => img !== null);
    if (!hasImage) { toast.error("Please upload at least one image"); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("roomType", inputs.roomType);
      formData.append("pricePerNight", inputs.pricePerNight);

      const selectedAmenities = Object.keys(inputs.amenities).filter((a) => inputs.amenities[a]);
      formData.append("amenities", JSON.stringify(selectedAmenities));

      Object.values(images).forEach((img) => {
        if (img) formData.append("images", img);
      });

      const { data } = await axios.post("/api/rooms", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (data.success) {
        toast.success(data.message);
        setImages({ 1: null, 2: null, 3: null, 4: null });
        setInputs({
          roomType: "",
          pricePerNight: "",
          amenities: {
            "Free WiFi": false,
            "Free Breakfast": false,
            "Room Service": false,
            "Mountain View": false,
            "Pool Access": false
          }
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Title
        align="left" font="outfit" title="Add Room"
        subTitle="Fill in the details carefully to enhance the booking experience."
      />

      {/* Images */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap">
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key}>
            <img
              className="max-h-14 cursor-pointer opacity-80"
              src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
              alt=""
            />
            <input
              type="file" accept="image/*"
              id={`roomImage${key}`} hidden
              onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })}
            />
          </label>
        ))}
      </div>

      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-4">
        {/* Room Type */}
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mt-4">Room Type</p>
          <select
            value={inputs.roomType}
            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
            className="border border-gray-300 mt-1 rounded p-2 w-full"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        {/* Price */}
        <div className="flex-1 max-w-40">
          <p className="text-gray-800 mt-4">Price <span className="text-xs">/night</span></p>
          <input
            type="number" placeholder="0" min={0}
            value={inputs.pricePerNight}
            className="border border-gray-300 mt-1 rounded p-2 w-full"
            onChange={(e) => setInputs({ ...inputs, pricePerNight: e.target.value })}
          />
        </div>
      </div>

      {/* Amenities */}
      <p className="text-gray-800 mt-4">Amenities</p>
      <div className="flex flex-col flex-wrap mt-1 text-gray-500 max-w-sm">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`amenities${index}`}
              checked={inputs.amenities[amenity]}
              onChange={() => setInputs({
                ...inputs,
                amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] }
              })}
            />
            <label htmlFor={`amenities${index}`}>{amenity}</label>
          </div>
        ))}
      </div>

      <button
        type="submit" disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded mt-8 cursor-pointer disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add Room"}
      </button>
    </form>
  );
};

export default AddRoom;