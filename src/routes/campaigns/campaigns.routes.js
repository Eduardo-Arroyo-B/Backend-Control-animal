import express from "express";
import {
    getAllCampaigns,
    createCampaign,
    deleteCampaign
} from "../../controllers/campaigns/campaigns.controller.js";

// Router
const router = express.Router();

// Rutas
router.get("/getAllCampaigns", getAllCampaigns);
router.post("/createCampaign", createCampaign);
router.delete("/deleteCampaign/:id", deleteCampaign);

export default router;