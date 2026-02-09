import express from "express";
import {
    getAllBinnacles,
    createDeleteBinnacle,
    createBinnacleReports
} from "../../controllers/binnacle/binnacle.controller.js";

// Router
const router = express.Router();

// Rutas
router.get("/getAllBinaccle", getAllBinnacles);
router.delete("/createDeleteBinnacle", createDeleteBinnacle);
router.post("/createBinnacleReports", createBinnacleReports);

export default router;