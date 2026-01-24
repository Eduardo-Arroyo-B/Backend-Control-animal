import express from 'express';
import {
    getAllCremations,
    getCremationByID,
    createCremation,
} from "../../controllers/cremations/cremations.controller.js";

// Router
const router = express.Router();

// Rutas
router.get("/getAllCremations", getAllCremations);
router.get("/getCremationByID/:id", getCremationByID);
router.post("/createCremation", createCremation);


export default router