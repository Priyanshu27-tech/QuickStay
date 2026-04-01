import { cloudinary } from "../configs/cloudinary.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// CREATE ROOM
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    const hotel = await Hotel.findOne({ owner: req.user._id });

    if (!hotel) {
      return res.json({
        success: false,
        message: "No hotel found. Register a hotel first."
      });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "hotel-booking"
        });

        images.push(result.secure_url);
      }
    }

    const room = await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight),
      amenities: amenities ? JSON.parse(amenities) : [],
      images,
      isAvailable: true // ✅ default availability
    });

    res.json({
      success: true,
      message: "Room created successfully",
      room
    });

  } catch (error) {
    console.error("CREATE ROOM ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL AVAILABLE ROOMS
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find() // ✅ fixed
      .populate({
        path: "hotel",
        select: "name address city images starRating owner",
        populate: { path: "owner", select: "name email image" }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      rooms
    });

  } catch (error) {
    console.error("GET ROOMS ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ROOMS FOR OWNER
export const getOwnerRooms = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user._id });

    if (!hotel) {
      return res.json({
        success: false,
        message: "No hotel found."
      });
    }

    const rooms = await Room.find({ hotel: hotel._id }).populate("hotel");

    res.json({
      success: true,
      rooms
    });

  } catch (error) {
    console.error("GET OWNER ROOMS ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// TOGGLE ROOM AVAILABILITY
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.json({
        success: false,
        message: "Room not found"
      });
    }

    room.isAvailable = !room.isAvailable;

    await room.save();

    res.json({
      success: true,
      message: "Room availability updated",
      room
    });

  } catch (error) {
    console.error("TOGGLE ROOM ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// UPDATE ROOM
export const updateRoom = async (req, res) => {
  try {
    const { roomId, roomType, pricePerNight, amenities } = req.body;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.json({
        success: false,
        message: "Room not found"
      });
    }

    room.roomType = roomType || room.roomType;
    room.pricePerNight = pricePerNight || room.pricePerNight;
    room.amenities = amenities || room.amenities;

    await room.save();

    res.json({
      success: true,
      message: "Room updated successfully",
      room
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE ROOM
export const deleteRoom = async (req, res) => {
  try {

    const { roomId } = req.body;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.json({
        success: false,
        message: "Room not found"
      });
    }

    await Room.findByIdAndDelete(roomId);

    res.json({
      success: true,
      message: "Room deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};