import express from "express";
import {
    getAllDates,
    getDate,
    createDate,
    updateDate,
    deleteDate
} from "../../controllers/date/date.controller.js";

// Router
const router = express.Router();

// Rutas
router.get("/getAllDates", getAllDates);
router.get("/getDate", getDate);
router.post("/createDate", createDate);
router.put("/updateDate/:id", updateDate);
router.delete("/deleteDate/:id", deleteDate);

export default router