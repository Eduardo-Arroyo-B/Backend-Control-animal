import express from 'express'
import {
    getDewormings,
    getDewormingByID,
    createDeworming
} from "../../controllers/deworming/Deworming.controller.js";

// Router
const router = express.Router()

// Rutas
router.get("/getDewormings", getDewormings)
router.post("/createDeworming", createDeworming)

export default router