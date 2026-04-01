import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";


// CHECK ROOM AVAILABILITY
export const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {

  try {

    const bookings = await Booking.find({
      room,
      status: { $in: ["pending", "confirmed"] },
      checkInDate: { $lt: new Date(checkOutDate) },
      checkOutDate: { $gt: new Date(checkInDate) }
    });

    return bookings.length === 0;

  } catch (error) {

    console.log(error.message);
    return false;

  }
};


// API: CHECK AVAILABILITY
export const checkAvailabilityAPI = async (req, res) => {

  try {

    const { checkInDate, checkOutDate, room } = req.body;

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room
    });

    res.json({
      success: true,
      isAvailable
    });

  } catch (error) {

    res.json({
      success: false,
      message: error.message
    });

  }
};


// CREATE BOOKING
export const createBooking = async (req, res) => {

  try {

    const { room, checkInDate, checkOutDate, guests } = req.body;

    const userId = req.user._id || req.user.id;

    if (!room || !checkInDate || !checkOutDate) {

      return res.json({
        success: false,
        message: "Missing required fields."
      });

    }

    // Check date availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room
    });

    if (!isAvailable) {

      return res.json({
        success: false,
        message: "Room is not available for selected dates."
      });

    }

    // Get room info
    const roomData = await Room.findById(room).populate("hotel");

    if (!roomData) {

      return res.json({
        success: false,
        message: "Room not found."
      });

    }

    // Check if owner disabled room
    if (!roomData.isAvailable) {

      return res.json({
        success: false,
        message: "Room currently unavailable."
      });

    }

    // Get user info
    const userData = await User.findById(userId);

    if (!userData) {

      return res.json({
        success: false,
        message: "User not found."
      });

    }

    // Calculate nights
    const checkin = new Date(checkInDate);
    const checkout = new Date(checkOutDate);

    checkin.setHours(0,0,0,0);
    checkout.setHours(0,0,0,0);

    const nights = (checkout - checkin) / (1000 * 60 * 60 * 24);

    if (nights <= 0) {

      return res.json({
        success: false,
        message: "Invalid booking dates."
      });

    }

    const totalPrice = nights * roomData.pricePerNight;

    // Create booking
    const booking = await Booking.create({

      user: userId,
      room,
      hotel: roomData.hotel._id,
      checkInDate: checkin,
      checkOutDate: checkout,
      guests: guests || 1,
      totalPrice,
      status: "confirmed"

    });


    // EMAIL CONFIRMATION
    const mailOptions = {

      from: process.env.SENDER_EMAIL,
      to: userData.email,
      subject: "Hotel Booking Confirmation",

      html: `
        <h2>Booking Confirmed</h2>

        <p>Dear ${userData.username},</p>

        <p>Your booking has been confirmed. Here are the details:</p>

        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Hotel:</strong> ${roomData.hotel.name}</li>
          <li><strong>Location:</strong> ${roomData.hotel.address}</li>
          <li><strong>Check-in:</strong> ${new Date(booking.checkInDate).toDateString()}</li>
          <li><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toDateString()}</li>
          <li><strong>Total Nights:</strong> ${nights}</li>
          <li><strong>Total Price:</strong> ₹${booking.totalPrice}</li>
        </ul>

        <p>We look forward to welcoming you!</p>
      `

    };

    await transporter.sendMail(mailOptions);


    res.json({

      success: true,
      message: "Booking created successfully",
      booking

    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message
    });

  }

};


// GET USER BOOKINGS
export const getUserBookings = async (req, res) => {

  try {

    const userId = req.user._id || req.user.id;

    const bookings = await Booking.find({ user: userId })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message
    });

  }

};


// OWNER DASHBOARD BOOKINGS
export const getHotelBookings = async (req, res) => {

  try {

    const hotel = await Hotel.findOne({ owner: req.user._id });

    if (!hotel) {

      return res.json({
        success: false,
        message: "No hotel found."
      });

    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;

    const totalRevenue = bookings.reduce(
      (acc, b) => acc + b.totalPrice,
      0
    );

    res.json({

      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        bookings
      }

    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: error.message
    });

  }

}

