import express from "express";
import {
    getVaccinations,
    getVaccinationByID,
    createVaccination,
    getCatVaccination,
    getCatVaccinationByID,
    createCatVaccination,
    updateVaccination,
    deleteVaccination
} from "../../controllers/vaccinations/vaccinations.controller.js";

// Router
const router = express();

// Rutas
router.get("/getVaccinations", getVaccinations);
router.get("/getVaccinationsByID/:id", getVaccinationByID);
router.post("/createVaccination", createVaccination);
router.put("/updateVaccination/:id", updateVaccination);
router.delete("/deleteVaccination", deleteVaccination);

// Rutas Stock vacunas
router.get("/getCatVaccination", getCatVaccination)
router.get("/getCatVaccinationByID/:id", getCatVaccinationByID)
router.post("/createCatVaccination", createCatVaccination);

export default router;