// backend/models/bookingModel.js
import pool from "../db/pool.js";

export const createBooking = async (client, bookingData) => {
  const {
    experience_id,
    slot_id,
    user_name,
    user_email,
    seats_booked,
    total_amount,
    promo_code = null,
  } = bookingData;

  const q = `
    INSERT INTO bookings
    (experience_id, slot_id, user_name, user_email, seats_booked, total_amount, promo_code)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `;
  const values = [experience_id, slot_id, user_name, user_email, seats_booked, total_amount, promo_code];
  const { rows } = await client.query(q, values);
  return rows[0];
};

export const userAlreadyBookedSlot = async (clientOrPool, slotId, userEmail) => {
  const q = `SELECT COUNT(*) FROM bookings WHERE slot_id = $1 AND user_email = $2`;
  const { rows } = await clientOrPool.query(q, [slotId, userEmail]);
  return Number(rows[0].count) > 0;
};
