import express from "express";
import {
    getAllReportes,
    createReporte,
    createReporteSeguimiento
} from "../../controllers/reports/reportes.controller.js";

// Router
const router = express();

// Rutas
router.get("/getAllReports", getAllReportes);
router.post("/createReport", createReporte);
router.put("/createReporteSeguimiento", createReporteSeguimiento);

export default router;

