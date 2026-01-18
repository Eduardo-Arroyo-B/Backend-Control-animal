import express from "express";
import {
    getAllEsterilizaciones,
    createEsterilizacion
} from "../../controllers/services/esterilizaciones.controller.js";

// Router
const router = express();

// Rutas
router.get("/getAllEsterilizaciones", getAllEsterilizaciones);
router.post("/createEsterilizacion", createEsterilizacion);

export default router;

