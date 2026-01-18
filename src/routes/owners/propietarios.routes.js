import express from "express";
import {
    getAllPropietarios,
    getPropietarioById,
    createPropietario,
    updatePropietario,
    deletePropietario
} from "../../controllers/owners/propietarios.controller.js";

// Router
const router = express();

// Rutas
router.get("/getAllPropietarios", getAllPropietarios);
router.get("/getPropietarioById/:id", getPropietarioById);
router.post("/createPropietario", createPropietario);
router.put("/updatePropietario/:id", updatePropietario);
router.delete("/deletePropietario/:id", deletePropietario);

export default router;

