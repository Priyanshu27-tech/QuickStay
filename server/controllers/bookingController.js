import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Stripe from "stripe";
import transporter from "../configs/nodemailer.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CHECK ROOM AVAILABILITY
export const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      status: "confirmed",
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

    res.json({ success: true, isAvailable });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// CREATE BOOKING (Pay at Hotel)
export const createBooking = async (req, res) => {
  try {

    const { room, checkInDate, checkOutDate, guests } = req.body;
    const userId = req.user._id;

    if (!room || !checkInDate || !checkOutDate) {
      return res.json({
        success: false,
        message: "Missing required fields."
      });
    }

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

    const roomData = await Room.findById(room).populate("hotel");

    if (!roomData) {
      return res.json({ success: false, message: "Room not found." });
    }

    if (!roomData.isAvailable) {
      return res.json({
        success: false,
        message: "Room currently unavailable."
      });
    }

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

    await Booking.create({
      user: userId,
      room,
      hotel: roomData.hotel._id,
      checkInDate: checkin,
      checkOutDate: checkout,
      guests: guests || 1,
      totalPrice,
      status: "confirmed",
      paymentMethod: "Pay At Hotel",
      isPaid: false
    });

    // Send confirmation email
    const user = await User.findById(userId);
    await transporter.sendMail({
      from: `"QuickStay" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Booking Confirmed — QuickStay 🏨",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #111827;">Your Booking is Confirmed! ✅</h2>
          <p style="color: #374151;">Hi <strong>${user.name}</strong>, your room has been successfully booked.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <h3 style="color: #111827;">Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse; color: #374151;">
            <tr><td style="padding: 8px 0;"><strong>Hotel</strong></td><td>${roomData.hotel.name}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Room Type</strong></td><td>${roomData.roomType}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Check-in</strong></td><td>${checkin.toDateString()}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Check-out</strong></td><td>${checkout.toDateString()}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Nights</strong></td><td>${nights}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Guests</strong></td><td>${guests || 1}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Total Amount</strong></td><td>₹${totalPrice}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Payment</strong></td><td>Pay At Hotel</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <p style="color: #6b7280; font-size: 14px;">Thank you for choosing <strong>QuickStay</strong>. We wish you a pleasant stay!</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: "Booking created successfully"
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};


// CREATE STRIPE SESSION
export const createStripeSession = async (req, res) => {
  try {

    const { room, checkInDate, checkOutDate, guests } = req.body;
    const userId = req.user._id;

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

    const roomData = await Room.findById(room).populate("hotel");

    if (!roomData) {
      return res.json({
        success: false,
        message: "Room not found."
      });
    }

    const checkin = new Date(checkInDate);
    const checkout = new Date(checkOutDate);

    checkin.setHours(0,0,0,0);
    checkout.setHours(0,0,0,0);

    const nights = (checkout - checkin) / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return res.json({
        success: false,
        message: "Invalid dates."
      });
    }

    const totalPrice = nights * roomData.pricePerNight;

    // Create booking with pending status
    const booking = await Booking.create({
      user: userId,
      room,
      hotel: roomData.hotel._id,
      checkInDate: checkin,
      checkOutDate: checkout,
      guests: guests || 1,
      totalPrice,
      status: "pending",
      paymentMethod: "Stripe",
      isPaid: false
    });

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],

      line_items: [{
        price_data: {
          currency: "inr",

          product_data: {
            name: `${roomData.hotel.name} - ${roomData.roomType}`,
            description:
              `Check-in: ${checkin.toDateString()} | ` +
              `Check-out: ${checkout.toDateString()} | ${nights} night(s)`,

            images: roomData.images?.length
              ? [roomData.images[0]]
              : []
          },

          unit_amount: Math.round(totalPrice * 100)
        },

        quantity: 1
      }],

      mode: "payment",

      success_url:
        `${process.env.CLIENT_URL}/my-bookings?payment=success&bookingId=${booking._id}`,

      cancel_url:
        `${process.env.CLIENT_URL}/rooms/${room}?payment=cancelled`,

      metadata: {
        bookingId: booking._id.toString()
      }
    });

    res.json({
      success: true,
      sessionUrl: session.url
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message
    });
  }
};


// VERIFY STRIPE PAYMENT
export const verifyStripePayment = async (req, res) => {
  try {

    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found."
      });
    }

    booking.isPaid = true;
    booking.status = "confirmed";

    await booking.save();

    // Send confirmation email after Stripe payment
    const bookingData = await Booking.findById(bookingId).populate("room hotel user");
    await transporter.sendMail({
      from: `"QuickStay" <${process.env.SMTP_USER}>`,
      to: bookingData.user.email,
      subject: "Payment Confirmed — QuickStay 🏨",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #111827;">Payment Received & Booking Confirmed! ✅</h2>
          <p style="color: #374151;">Hi <strong>${bookingData.user.name}</strong>, your payment was successful and your room is booked.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <h3 style="color: #111827;">Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse; color: #374151;">
            <tr><td style="padding: 8px 0;"><strong>Hotel</strong></td><td>${bookingData.hotel.name}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Room Type</strong></td><td>${bookingData.room.roomType}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Check-in</strong></td><td>${bookingData.checkInDate.toDateString()}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Check-out</strong></td><td>${bookingData.checkOutDate.toDateString()}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Guests</strong></td><td>${bookingData.guests}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Total Paid</strong></td><td>₹${bookingData.totalPrice}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Payment</strong></td><td>Stripe (Online)</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <p style="color: #6b7280; font-size: 14px;">Thank you for choosing <strong>QuickStay</strong>. We wish you a pleasant stay!</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: "Payment verified successfully"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};


// GET USER BOOKINGS
export const getUserBookings = async (req, res) => {
  try {

    const bookings = await Booking
      .find({ user: req.user._id })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });

  } catch (error) {
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

    const bookings = await Booking
      .find({ hotel: hotel._id })
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
    res.json({
      success: false,
      message: error.message
    });
  }
};
