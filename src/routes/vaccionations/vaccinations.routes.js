import express from "express";
import {
    getVaccinations,
    getVaccinationByID,
    createVaccination,
    deleteVaccination
} from "../../controllers/vaccinations/vaccinations.controller.js";

// Router
const router = express();

// Rutas
router.get("/getVaccinations", getVaccinations);
router.get("/getVaccinationsByID/:id", getVaccinationByID);
router.post("/createVaccination", createVaccination);
router.delete("/deleteVaccination", deleteVaccination);

export default router;