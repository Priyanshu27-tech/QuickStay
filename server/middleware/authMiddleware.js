import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Not authorized. No token." });
        }

        const token = authHeader.split(" ")[1];

        if (!token || token === "undefined" || token === "null") {
            return res.status(401).json({ success: false, message: "Invalid token." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found." });
        }

        req.user = user;
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
        }
        res.status(401).json({ success: false, message: "Invalid token." });
    }
};

export const isOwner = (req, res, next) => {
    if (req.user?.role !== "hotelOwner" && req.user?.role !== "admin") {
        return res.status(403).json({ success: false, message: "Hotel Owner access required." });
    }
    next();
};
