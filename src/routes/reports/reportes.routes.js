import express from "express";
import {
    getAllReportes,
    createReporte,
    createReporteSeguimiento
} from "../../controllers/reports/reportes.controller.js";

// Router
const router = express();

// Rutas
router.get("/getAllReportes", getAllReportes);
router.post("/createReporte", createReporte);
router.put("/createReporteSeguimiento", createReporteSeguimiento);

export default router;

