import express from "express";
import {
    getAgendaMes,
    getAgendaDia,
    createCita
} from "../../controllers/schedule/schedule.controller.js"

// Router
const router = express();

// Rutas
router.get("/getAgendaMes", getAgendaMes);
router.get("/getAgendaDia", getAgendaDia);
router.post("/createCita/:id", createCita);

export default router;
