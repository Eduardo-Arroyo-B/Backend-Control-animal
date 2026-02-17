import express from "express";
import {
    getAllReportes,
    createReporte,
    updateStatusReporte,
    createReporteSeguimiento
} from "../../controllers/reports/reportes.controller.js";
import upload from "../../middlewares/multerConfigReports.js";

// Router
const router = express();

// Rutas
router.get("/getAllReports", getAllReportes);
router.post("/createReport", upload.array("fotos", 5), createReporte);
router.put("/updateStatusReporte/:id", updateStatusReporte);
router.put("/createReporteSeguimiento", createReporteSeguimiento);

export default router;

