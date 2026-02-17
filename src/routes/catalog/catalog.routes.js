import express from 'express';
import {
    getAllCosts,
    createCost
} from "../../controllers/catalog/Costs.controller.js";

// Router
const router = express.Router();

// Rutas
router.get('/getAllCosts', getAllCosts)
router.post('/createCost', createCost)

export default router;