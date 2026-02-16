import express from 'express';
import {
    getStatistics,
    getCompleteStatistics,
    getStatisticsCampaigns
} from "../../controllers/statistics/statistics.controller.js";

// Router
const router = express();

// Rutas
router.get("/getStatistics", getStatistics);
router.get("/getCompleteStatistics", getCompleteStatistics);
router.get("/getStatisticsCampaigns", getStatisticsCampaigns);

export default router;