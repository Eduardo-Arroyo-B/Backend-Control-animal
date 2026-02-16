import express from "express";
import {
    getAllDates,
    getDate,
    createDate
} from "../../controllers/date/date.controller.js";

// Router
const router = express.Router();

// Rutas
router.get("/getAllDates", getAllDates);
router.get("/getDate", getDate);
router.post("/createDate", createDate);

export default router