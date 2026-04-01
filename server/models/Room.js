import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    hotel:          { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    roomType:       { type: String, required: true },
    pricePerNight:  { type: Number, required: true },
    amenities:      [{ type: String }],   // fixed: was "amenties" (typo)
    images:         [{ type: String }],
    isAvailable:    { type: Boolean, default: true },
    maxOccupancy:   { type: Number, default: 2 },
    description:    { type: String, default: "" },
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);

export default Room;
