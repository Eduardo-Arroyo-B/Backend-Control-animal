import express from 'express';
import getVpagosByRecibo from "../../controllers/receipts/receipts.controller.js"

// Router
const router = express.Router();

// Rutas
router.get("/getVpagosByRecibo/:recibo",getVpagosByRecibo)

export default router;