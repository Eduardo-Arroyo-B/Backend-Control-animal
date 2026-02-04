import express from 'express'
import {
    getAnimals,
    getAnimalsDeaths,
    getAnimalsByID,
    createAnimal,
    createAnimalFlujo,
    updateAnimal,
    deleteAnimals
} from "../../controllers/animals/animals.controller.js";
import upload from "../../middlewares/multerConfigAnimals.js"
import { animalModelo1Validator } from "../../middlewares/animalModel1.js";
import { validarCampos } from "../../middlewares/validationResult.js";

// Router
const router = express.Router()

// Rutas
router.get("/getAnimals", getAnimals)
router.get("/getAnimalsDeaths", getAnimalsDeaths)
router.get("/getAnimalByID/:search", getAnimalsByID)
router.post("/createAnimal", upload.array("fotos", 5), animalModelo1Validator, validarCampos,createAnimal)
router.post("/createAnimalFlujo", upload.array("fotos", 5), createAnimalFlujo)
router.put("/updateAnimal/:id", updateAnimal)
router.delete("/deleteAnimals/:id", deleteAnimals)

export default router