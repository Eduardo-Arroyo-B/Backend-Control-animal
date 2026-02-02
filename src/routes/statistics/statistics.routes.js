import express from 'express';
import {
    getStatistics,
    getCompleteStatistics,
} from "../../controllers/statistics/statistics.controller.js";

// Router
const router = express();

// Rutas
router.get("/getStatistics", getStatistics);
router.get("/getCompleteStatistics", getCompleteStatistics);

export default router;