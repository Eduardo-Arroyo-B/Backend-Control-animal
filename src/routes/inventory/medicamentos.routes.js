import express from "express";
import {
    getAllMedicamentos,
    createMedicamento,
    updateMedicamento
} from "../../controllers/inventory/medicamentos.controller.js";

// Router
const router = express();

// Rutas
router.get("/getAllMedicamentos", getAllMedicamentos);
router.post("/createMedicamento", createMedicamento);
router.put("/updateMedicamento/:id", updateMedicamento);

export default router;

