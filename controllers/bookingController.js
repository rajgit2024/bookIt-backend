// backend/controllers/bookingController.js
import pool from "../db/pool.js";
import { getSlotForUpdate, fetchSlotById, decrementSlotSeats } from "../models/slotModel.js";
import { createBooking, userAlreadyBookedSlot } from "../models/bookingModel.js";
import { findPromoByCode, incrementPromoUsage } from "../models/promoModel.js";

export const createBookingHandler = async (req, res) => {
  const {
    experience_id,
    slot_id,
    user_name,
    user_email,
    seats_booked = 1,
    promo_code = null,
  } = req.body;

  if (!experience_id || !slot_id || !user_name || !user_email) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const seatsToBook = Number(seats_booked);
  if (seatsToBook <= 0) return res.status(400).json({ success: false, error: "seats_booked must be >= 1" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Lock slot row to prevent race conditions
    const slot = await getSlotForUpdate(client, slot_id);
    if (!slot) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, error: "Slot not found" });
    }

    // Validate slot belongs to experience
    if (Number(slot.experience_id) !== Number(experience_id)) {
      await client.query("ROLLBACK");
      return res.status(400).json({ success: false, error: "Slot does not belong to the experience" });
    }

    // Prevent duplicate booking by same email for same slot
    const alreadyBooked = await userAlreadyBookedSlot(client, slot_id, user_email);
    if (alreadyBooked) {
      await client.query("ROLLBACK");
      console.log("User has already booked the slot");
      
      return res.status(400).json({ success: false, error: "User has already booked this slot" });
    }

    if (slot.available_seats < seatsToBook) {
      await client.query("ROLLBACK");
      console.log("The seat is already full");
      
      return res.status(400).json({ success: false, error: "Not enough seats available" });
    }

    // compute amount
    let amount = Number(slot.price) * seatsToBook;

    // apply promo if present
    let promo = null;
    let discountAmount = 0;
    if (promo_code) {
      promo = await findPromoByCode(promo_code);
      if (!promo) {
        await client.query("ROLLBACK");
        return res.status(404).json({ success: false, error: "Promo code not found" });
      }
      if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
        await client.query("ROLLBACK");
        return res.status(400).json({ success: false, error: "Promo expired" });
      }
      if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
        await client.query("ROLLBACK");
        return res.status(400).json({ success: false, error: "Promo usage limit reached" });
      }

      if (promo.discount_percent) {
        discountAmount = (amount * Number(promo.discount_percent)) / 100;
      } else if (promo.flat_discount) {
        discountAmount = Number(promo.flat_discount);
      }
      // guard discount not exceed amount
      if (discountAmount > amount) discountAmount = amount;
      amount = amount - discountAmount;
    }

    // create booking
    const booking = await createBooking(client, {
      experience_id,
      slot_id,
      user_name,
      user_email,
      seats_booked: seatsToBook,
      total_amount: amount,
      promo_code: promo ? promo.code : null,
    });

    // decrement seats
    await decrementSlotSeats(client, slot_id, seatsToBook);

    // increment promo used_count if applicable
    if (promo) {
      await incrementPromoUsage(client, promo.id);
    }

    await client.query("COMMIT");

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("createBookingHandler:", err);
    res.status(500).json({ success: false, error: "Failed to create booking" });
  } finally {
    client.release();
  }
};
