import { body } from "express-validator"

export const validateAnimal = [
    body("nombre_animal")
]