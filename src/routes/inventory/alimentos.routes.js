import express from "express";
import {
    getAllAlimentos,
    createAlimento
} from "../../controllers/inventory/alimentos.controller.js";

// Router
const router = express();

// Rutas
router.get("/getAllAlimentos", getAllAlimentos);
router.post("/createAlimento", createAlimento);

export default router;

