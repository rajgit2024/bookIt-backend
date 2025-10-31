import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import experienceRoutes from "./routes/experienceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import promoRoutes from "./routes/promoRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.REACT_APP_API_URL, // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allows credentials (cookies, Authorization header)
}));
app.use(express.json());

app.use("/api/experiences", experienceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/promo", promoRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => 
    res.send("BookIt API is running")
);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Server is healthy and API working correctly!",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
