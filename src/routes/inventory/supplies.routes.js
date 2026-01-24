import express from 'express'
import {
    getAllSupplies,
    getSuppliesByID,
    createSupplies,
    deleteSupplies,
} from "../../controllers/inventory/supplies.controller.js";

// Router
const router = express.Router()

// Rutas
router.get("/getAllSupplies", getAllSupplies)
router.get("/getSuppliesByID/:id", getSuppliesByID)
router.post("/createSupplie", createSupplies)
router.delete("/deleteSupplie", deleteSupplies)

export default router