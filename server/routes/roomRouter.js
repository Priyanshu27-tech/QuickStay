import express from "express";
import { protect, isOwner } from "../middleware/authMiddleware.js";
import { upload } from "../configs/cloudinary.js";
import {
  createRoom,
  getOwnerRooms,
  getRooms,
  toggleRoomAvailability,
   updateRoom,
  deleteRoom
} from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.get("/", getRooms);

roomRouter.get("/owner", protect, isOwner, getOwnerRooms);

roomRouter.post(
  "/",
  protect,
  isOwner,
  upload.array("images", 4),
  createRoom
);

roomRouter.post(
  "/toggle-availability",
  protect,
  isOwner,
  toggleRoomAvailability
);
roomRouter.put("/update-room", protect, isOwner, updateRoom);
roomRouter.delete("/delete-room", protect, isOwner, deleteRoom);


export default roomRouter;