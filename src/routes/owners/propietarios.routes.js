import express from "express";
import {
    getAllPropietarios,
    getPropietarioById,
    getAllPropietariosEXP,
    createPropietario,
    updatePropietario,
    vinculatePropietarioAnimal,
    deletePropietario,
    createPropietarioPortal
} from "../../controllers/owners/propietarios.controller.js";

// Router
const router = express();

// Rutas
router.get("/getAllPropietarios", getAllPropietarios);
router.get("/getPropietarioById/:search", getPropietarioById);
router.get("/getPropietarioEXP", getAllPropietariosEXP);
router.post("/createPropietario", createPropietario);
router.put("/updatePropietario/:id", updatePropietario);
router.put("/vinculatePropietarioAnimal", vinculatePropietarioAnimal);
router.delete("/deletePropietario/:id", deletePropietario);
router.post("/createPropietarioPortal", createPropietarioPortal)

export default router;

