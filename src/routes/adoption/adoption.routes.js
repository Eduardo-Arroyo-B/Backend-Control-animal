import express from "express";
import {
    getAllAdoptions,
    getAdoptionByID,
    createAdoption,
    deleteAdoption,
    // Nuevos endpoints
    getAllAdoptionRequests,
    getAdoptionRequestByID,
    createAdoptionRequest,
    updateAdoptionStatus,
    uploadContract
} from "../../controllers/adoption/adoption.controller.js";
import upload from "../../middlewares/multerConfigAdoptionReport.js";
import uploadConImg from "../../middlewares/multerCofigContracts.js"

// Router
const router = express.Router();

// Rutas existentes (no modificar)
router.get("/getAllAdoptions", getAllAdoptions);
router.get("/getAdoptionByID/:id", getAdoptionByID);
router.post("/createAdoption", createAdoption);
router.delete("/deleteAdoption/:id", deleteAdoption);

// Nuevas rutas para solicitudes de adopción
router.get("/getAllAdoptionRequests", getAllAdoptionRequests);
router.get("/getAdoptionRequestByID/:search", getAdoptionRequestByID);
router.post("/createAdoptionRequest", upload.array("fotos", 5) ,createAdoptionRequest);
router.put("/updateAdoptionStatus/:id", updateAdoptionStatus);
router.post("/uploadContract/:id", uploadConImg.single("foto"), uploadContract);

export default router;