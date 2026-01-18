import express from "express";
import {
    getAllReportes,
    createReporte
} from "../../controllers/reports/reportes.controller.js";

// Router
const router = express();

// Rutas
router.get("/getAllReportes", getAllReportes);
router.post("/createReporte", createReporte);

export default router;

