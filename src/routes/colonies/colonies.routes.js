import express from 'express';
import {
    getAllColonies,
    createColonie,
    deleteColonie
} from "../../controllers/colonies/colonies.controller.js";

// Router
const router = express.Router();

// Rutas
router.get('/getAllColonies', getAllColonies);
router.post('/createColonie', createColonie);
router.delete('/deleteColonie/:id', deleteColonie);

export default router;