import express from 'express'
import {
    getAnimals,
    getAnimalsByID,
    getAnimalsEXP,
    createAnimal,
    updateAnimal,
    deleteAnimals
} from "../../controllers/animals/animals.controller.js";

// Router
const router = express.Router()

// Rutas
router.get("/getAnimals", getAnimals)
router.get("/getAnimalByID/:search", getAnimalsByID)
router.get("/getAnimalsEXP", getAnimalsEXP)
router.post("/createAnimal", createAnimal)
router.put("/updateAnimal/:id", updateAnimal)
router.delete("/deleteAnimals/:id", deleteAnimals)

export default router