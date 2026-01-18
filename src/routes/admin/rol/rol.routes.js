import express from "express";
import {
    getRoles,
    createRole,
    deleteRol
} from "../../../controllers/admin/rol/rol.controller.js";

// Router
const router = express.Router();

// Rutas
router.get("/getRoles", getRoles);
router.post("/createRol", createRole);
router.delete("/deleteRol/:id", deleteRol);

export default router;