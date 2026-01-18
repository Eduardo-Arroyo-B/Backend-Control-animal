import express from "express";
import {
    getAllMedicamentos,
    createMedicamento
} from "../../controllers/inventory/medicamentos.controller.js";

// Router
const router = express();

// Rutas
router.get("/getAllMedicamentos", getAllMedicamentos);
router.post("/createMedicamento", createMedicamento);

export default router;

