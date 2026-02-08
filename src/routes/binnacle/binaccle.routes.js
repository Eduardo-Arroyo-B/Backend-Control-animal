import express from "express";
import {
    getAllBinnacles
} from "../../controllers/binnacle/binnacle.controller.js";

// Router
const router = express.Router();

// Rutas
router.get("/getAllBinaccle", getAllBinnacles);

export default router;