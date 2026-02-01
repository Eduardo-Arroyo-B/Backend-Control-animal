import express from 'express'
import {
    getAllBreeds,
    getBreedsByID,
    createBreed,
    deleteBreed
} from "../../controllers/breeds/breeds.controller.js";

// Router
const router = express.Router()

// Rutas
router.get("/getAllBreeds", getAllBreeds)
router.get("/getBreedsByID/:id", getBreedsByID)
router.post("/createBreed", createBreed)
router.delete("/deleteBreed/:id", deleteBreed)

export default router