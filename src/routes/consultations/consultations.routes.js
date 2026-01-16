import express from "express"
import {
    getConsultations,
    getConsultationByID,
    createConsultation,
    deleteConsultation
} from "../../controllers/consultations/consultations.controller.js";

// Router
const router = express.Router()

// Rutas
router.get("/getConsultations", getConsultations);
router.get("/getConsultationByID", getConsultationByID);
router.post("/createConsultation", createConsultation);
router.delete("/deleteConsultation", deleteConsultation);


export default router;