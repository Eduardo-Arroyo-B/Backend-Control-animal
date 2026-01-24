import express from "express";
import {
    getAllAdoptions,
    getAdoptionByID,
    createAdoption,
    deleteAdoption
} from "../../controllers/adoption/adoption.controller.js";

// Router
const router = express.Router();

// Rutas
router.get("/getAllAdoptions", getAllAdoptions);
router.get("/getAdoptionByID/:id", getAdoptionByID);
router.post("/createAdoption", createAdoption);
router.delete("deleteAdoption/:id", deleteAdoption);

export default router;