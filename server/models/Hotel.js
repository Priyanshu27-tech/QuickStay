import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    address:     { type: String, required: true },
    contact:     { type: String, required: true },
    city:        { type: String, required: true },
    owner:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    images:      [{ type: String }],
    amenities:   [{ type: String }],
    starRating:  { type: Number, min: 1, max: 5, default: 3 },
    description: { type: String, default: "" },
    isActive:    { type: Boolean, default: true },
}, { timestamps: true });

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
