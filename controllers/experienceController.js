// backend/controllers/experienceController.js
import { fetchAllExperiences, fetchExperienceById } from "../models/experienceModel.js";

export const getAllExperiences = async (req, res) => {
  try {
    const experiences = await fetchAllExperiences();
    res.status(200).json({ success: true, data: experiences });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchExperienceById(id);

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching experience by id:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
