import User from "../models/User.js";
import Hotel from "../models/Hotel.js";


// POST /api/hotels/register
export const registerHotel = async (req, res) => {

  try {

    const { name, address, contact,city,location } = req.body;

    const owner = req.user._id;

    // Check if owner already has a hotel
    const existingHotel = await Hotel.findOne({ owner });

    if (existingHotel) {
      return res.json({
        success: false,
        message: "You already have a registered hotel."
      });
    }

    // Create new hotel
    const hotel = await Hotel.create({
      name,
      address,
      contact,
      owner,
      city,
      location
    });

    // Update user role
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({
      success: true,
      message: "Hotel Registered Successfully",
      hotel
    });

  } catch (error) {

    console.log("Register Hotel Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



// GET /api/hotels/owner
export const getOwnerHotel = async (req, res) => {

  try {

    const hotel = await Hotel.findOne({ owner: req.user._id });

    res.json({
      success: true,
      hotel
    });

  } catch (error) {

    console.log("Get Owner Hotel Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};



// GET /api/hotels
export const getAllHotels = async (req, res) => {

  try {

    const hotels = await Hotel.find({ isActive: true })
      .populate("owner", "name email image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      hotels
    });

  } catch (error) {

    console.log("Get Hotels Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
