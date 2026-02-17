import express from 'express'
import {
    getAnimals,
    getAnimalsDeaths,
    getAnimalsByID,
    createAnimal,
    createAnimalFlujo,
    updateAnimal,
    deleteAnimals,
    getMiniExpedienteAnimal,
    createMiniExpedienteAnimal,
    createRUAC
} from "../../controllers/animals/animals.controller.js";
import upload from "../../middlewares/multerConfigAnimals.js"
import uploadMini from "../../middlewares/multerConfigMiniExpediente.js"

// Router
const router = express.Router()

// Rutas
router.get("/getAnimals", getAnimals)
router.get("/getAnimalsDeaths", getAnimalsDeaths)
router.get("/getAnimalByID/:search", getAnimalsByID)
router.post("/createAnimal", upload.array("fotos", 5), createAnimal)
router.post("/createAnimalFlujo", upload.array("fotos", 5), createAnimalFlujo)
router.put("/updateAnimal/:id", updateAnimal)
router.delete("/deleteAnimals/:id", deleteAnimals)

// Mini expediente
router.get("/getMiniExpedienteAnimal", getMiniExpedienteAnimal)
router.post("/createMiniExpedienteAnimal", uploadMini.single("foto"), createMiniExpedienteAnimal)
router.post("/createRUAC", createRUAC)

export default router