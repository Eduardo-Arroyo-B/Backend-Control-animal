import express from "express";
import {
    getAllPropietarios,
    getPropietarioById,
    getAllPropietariosEXP,
    createPropietario,
    updatePropietario,
    deletePropietario
} from "../../controllers/owners/propietarios.controller.js";

// Router
const router = express();

// Rutas
router.get("/getAllPropietarios", getAllPropietarios);
router.get("/getPropietarioById/:search", getPropietarioById);
router.get("/getPropietarioEXP", getAllPropietariosEXP);
router.post("/createPropietario", createPropietario);
router.put("/updatePropietario/:id", updatePropietario);
router.delete("/deletePropietario/:id", deletePropietario);

export default router;

