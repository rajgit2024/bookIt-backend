import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import experienceRoutes from "./routes/experienceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import promoRoutes from "./routes/promoRoutes.js";
import userRoutes from "./routes/userRoutes.js"

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/experiences", experienceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/promo", promoRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => 
    res.send("BookIt API is running")
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
