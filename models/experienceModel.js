// backend/models/experienceModel.js
import pool from "../db/pool.js";

// ✅ Get all experiences
export const fetchAllExperiences = async () => {
  const q = `SELECT id, title, description, image_url, base_price FROM experiences ORDER BY id ASC`;
  const { rows } = await pool.query(q);
  return rows;
};

// ✅ Get a single experience and its slots
export const fetchExperienceById = async (id) => {
  const expQuery = `
    SELECT id, title, description, image_url, base_price 
    FROM experiences 
    WHERE id = $1
  `;
  const expResult = await pool.query(expQuery, [id]);
  const experience = expResult.rows[0];
  if (!experience) return null;

  // New part 👇
  const slotQuery = `
    SELECT id, TO_CHAR(slot_date, 'YYYY-MM-DD'), available_seats 
    FROM slots 
    WHERE experience_id = $1
    ORDER BY slot_date ASC
  `;
  const slotResult = await pool.query(slotQuery, [id]);

  return {
    experience,
    slots: slotResult.rows,
  };
};
