import express from 'express';
import {
    getAllBites,
    getBiteById,
    createBite,
    deleteBite
} from "../../controllers/bites/bites.controller.js";

// Router
const router = express.Router();

// Rutas
router.get("/getAllBites", getAllBites);
router.get("/getBiteByID/:id", getBiteById);
router.post("/createBite", createBite);
router.delete("/deleteBite/:id", deleteBite);

export default router;