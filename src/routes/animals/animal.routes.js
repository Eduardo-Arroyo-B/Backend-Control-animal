import express from 'express'
import {
    getAnimals,
    getAnimalsByID,
    createAnimal,
    updateAnimal,
    deleteAnimals
} from "../../controllers/animals/animals.controller.js";

// Router
const router = express.Router()

// Rutas
router.get("/getAnimals", getAnimals)
router.get("/getAnimalByID/:search", getAnimalsByID)
router.post("/createAnimal", createAnimal)
router.put("/updateAnimal/:id", updateAnimal)
router.delete("/deleteAnimals/:id", deleteAnimals)

export default router