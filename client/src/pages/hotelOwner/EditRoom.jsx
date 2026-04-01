import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const EditRoom = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();

  const [roomType, setRoomType] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [amenities, setAmenities] = useState("");

  const fetchRoom = async () => {

    try {

      const { data } = await axios.get("/api/rooms/owner");

      const room = data.rooms.find(r => r._id === id);

      if (room) {
        setRoomType(room.roomType);
        setPricePerNight(room.pricePerNight);
        setAmenities(room.amenities.join(", "));
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      const { data } = await axios.put("/api/rooms/update-room", {
        roomId: id,
        roomType,
        pricePerNight,
        amenities: amenities.split(",").map(a => a.trim())
      });

      if (data.success) {
        toast.success("Room updated successfully");
        navigate("/owner/list-room");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (

    <div className="p-6 max-w-xl">

      <h2 className="text-2xl font-semibold mb-4">Edit Room</h2>

      <form onSubmit={handleUpdate} className="space-y-4">

        <div>
          <label>Room Type</label>
          <input
            type="text"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label>Price per Night</label>
          <input
            type="number"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            className="border w-full p-2 rounded"
          />
        </div>

        <div>
          <label>Amenities (comma separated)</label>
          <input
            type="text"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            className="border w-full p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Room
        </button>

      </form>

    </div>
  );
};

export default EditRoom;