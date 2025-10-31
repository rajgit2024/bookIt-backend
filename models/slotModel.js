// backend/models/slotModel.js
import pool from "../db/pool.js";

export const fetchSlotsByExperience = async (experienceId) => {
  const q = `
    SELECT id, experience_id, slot_date, available_seats, price
    FROM slots
    WHERE experience_id = $1
    ORDER BY slot_date ASC
  `;
  const { rows } = await pool.query(q, [experienceId]);
  return rows;
};

export const fetchSlotById = async (slotId) => {
  const q = `SELECT id, experience_id, slot_date, available_seats, price FROM slots WHERE id = $1`;
  const { rows } = await pool.query(q, [slotId]);
  return rows[0];
};

// Used within a transaction with FOR UPDATE
export const getSlotForUpdate = async (client, slotId) => {
  const q = `SELECT id, experience_id, slot_date, available_seats, price FROM slots WHERE id = $1 FOR UPDATE`;
  const res = await client.query(q, [slotId]);
  return res.rows[0];
};

export const decrementSlotSeats = async (client, slotId, seats) => {
  const q = `UPDATE slots SET available_seats = available_seats - $1 WHERE id = $2`;
  await client.query(q, [seats, slotId]);
};
