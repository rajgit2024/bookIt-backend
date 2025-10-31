// backend/models/promoModel.js
import pool from "../db/pool.js";

export const findPromoByCode = async (code) => {
  const q = `SELECT * FROM promo_codes WHERE code = $1`;
  const { rows } = await pool.query(q, [code]);
  return rows[0];
};

// optional: increment used_count (within a transaction)
export const incrementPromoUsage = async (client, promoId) => {
  const q = `UPDATE promo_codes SET used_count = used_count + 1 WHERE id = $1`;
  await client.query(q, [promoId]);
};
