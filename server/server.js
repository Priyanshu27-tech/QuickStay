import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

import authRouter    from "./routes/authRoutes.js";
import userRouter    from "./routes/userRoutes.js";
import hotelRouter   from "./routes/hotelRoutes.js";
import roomRouter    from "./routes/roomRouter.js";
import bookingRouter from "./routes/bookingRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js"

connectDB();
connectCloudinary();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://quick-stay-yq9r.vercel.app"],
    credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => res.send("LuxeStay API is working ✅"));
app.use("/api/auth",    authRouter);
app.use("/api/user",    userRouter);
app.use("/api/hotels",  hotelRouter);
app.use("/api/rooms",   roomRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/reviews", reviewRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});