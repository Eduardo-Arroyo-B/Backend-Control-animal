import express from 'express';
import {
    getAllHairs,
    createHair,
    deleteHair
} from "../../controllers/hair/hair.controller.js";

// Router
const router = express.Router();

// Rutas
router.get("/getAllHairs", getAllHairs)
router.post("/createHair", createHair)
router.get("/deleteHair", deleteHair)

export default router;