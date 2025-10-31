// backend/controllers/promoController.js
import { findPromoByCode } from "../models/promoModel.js";

export const validatePromo = async (req, res) => {
  const { code, amount } = req.body;
  if (!code) return res.status(400).json({ success: false, error: "Promo code required" });

  try {
    const promo = await findPromoByCode(code);
    if (!promo) return res.status(404).json({ success: false, error: "Promo not found" });

    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return res.status(400).json({ success: false, error: "Promo expired" });
    }
    if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
      return res.status(400).json({ success: false, error: "Promo usages exceeded" });
    }

    // compute discount
    let discount = 0;
    if (promo.discount_percent) {
      discount = (Number(amount) * Number(promo.discount_percent)) / 100;
    } else if (promo.flat_discount) {
      discount = Number(promo.flat_discount);
    }

    res.json({
      success: true,
      data: {
        code: promo.code,
        discount,
        discount_percent: promo.discount_percent,
        flat_discount: promo.flat_discount,
      },
    });
  } catch (err) {
    console.error("validatePromo:", err);
    res.status(500).json({ success: false, error: "Failed to validate promo" });
  }
};
