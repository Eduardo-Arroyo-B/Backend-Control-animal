import express from "express";
import {
    getAllDeaths,
    getDeathsById,
    createDeaths
} from "../../controllers/deaths/deaths.controller.js";

// Router
const router = express.Router();

// Rutas
router.get("/getAllDeaths", getAllDeaths)
router.get("/getAllDeathsByID/:id", getDeathsById)
router.post("/createDeaths", createDeaths)

export default router;