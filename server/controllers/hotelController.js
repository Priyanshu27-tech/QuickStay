import User from "../models/User.js";
import Hotel from "../models/Hotel.js";

// POST /api/hotels/register
export const registerHotel = async (req, res) => {
    try {

        const { name, address, contact, city, location } = req.body;
        const owner = req.user._id;

        const existingHotel = await Hotel.findOne({ owner });

        if (existingHotel) {
            return res.json({
                success: false,
                message: "You already have a registered hotel."
            });
        }

        await Hotel.create({
            name,
            address,
            contact,
            city,
            owner,
            location
        });

        await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

        res.json({
            success: true,
            message: "Hotel Registered Successfully"
        });

    } catch (error) {
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
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};