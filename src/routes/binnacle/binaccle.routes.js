import express from "express";
import {
    getAllBinnacles,
    createDeleteBinnacle
} from "../../controllers/binnacle/binnacle.controller.js";

// Router
const router = express.Router();

// Rutas
router.get("/getAllBinaccle", getAllBinnacles);
router.delete("/createDeleteBinnacle", createDeleteBinnacle);

export default router;