import express from "express";
import {
    getAgendaMes,
    getAgendaDia,
    createCita
} from "../../controllers/schedule/schedule.controller.js"

// Router
const router = express();

// Rutas
router.post("/getAgendaMes", getAgendaMes);
router.post("/getAgendaDia", getAgendaDia);
router.post("/createCita", createCita);

export default router;
