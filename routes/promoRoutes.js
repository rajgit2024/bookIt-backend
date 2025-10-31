// backend/routes/promoRoutes.js
import express from "express";
import { validatePromo } from "../controllers/promoController.js";

const router = express.Router();

router.post("/validate", validatePromo);

export default router;
