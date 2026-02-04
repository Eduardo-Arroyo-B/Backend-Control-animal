import { body } from 'express-validator';

export const animalModelo1Validator = [

    body('nombre_animal')
        .notEmpty().withMessage('El nombre del animal es obligatorio')
        .isString().withMessage('El nombre del animal debe ser texto')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

    body('especie')
        .notEmpty().withMessage('La especie es obligatoria')
        .isString().withMessage('La especie debe ser texto'),

    body('Raza')
        .notEmpty().withMessage('La raza es obligatoria')
        .isInt({ gt: 0 }).withMessage('La raza debe ser un ID numérico válido'),

    body('edad')
        .notEmpty().withMessage('La edad es obligatoria')
        .isString().withMessage('La edad debe ser texto'),

    body('pelaje')
        .notEmpty().withMessage('El pelaje es obligatorio')
        .isString().withMessage('El pelaje debe ser texto'),

    body('peso')
        .notEmpty().withMessage('El peso es obligatorio')
        .isInt({ gt: 0 }).withMessage('El peso debe ser un número positivo'),

    body('numero_microchip')
        .notEmpty().withMessage('El número de microchip es obligatorio')
        .isString().withMessage('El número de microchip debe ser texto')
        .isLength({ min: 5 }).withMessage('El microchip debe tener al menos 5 caracteres'),

    body('tipo_ingreso')
        .notEmpty().withMessage('El tipo de ingreso es obligatorio')
        .isString().withMessage('El tipo de ingreso debe ser texto'),

    body('ubicacion_actual')
        .notEmpty().withMessage('La ubicación actual es obligatoria')
        .isString().withMessage('La ubicación actual debe ser texto'),

    body('estado_salud')
        .notEmpty().withMessage('El estado de salud es obligatorio')
        .isString().withMessage('El estado de salud debe ser texto'),

    body('sexo')
        .notEmpty().withMessage('El sexo es obligatorio')
        .isString().withMessage('El sexo debe ser texto'),

    body('observaciones')
        .notEmpty().withMessage('Las observaciones son obligatorias')
        .isString().withMessage('Las observaciones deben ser texto'),

    body('estado_reproductivo')
        .notEmpty().withMessage('El estado reproductivo es obligatorio')
        .isString().withMessage('El estado reproductivo debe ser texto'),

    body('temperamento')
        .notEmpty().withMessage('El temperamento es obligatorio')
        .isString().withMessage('El temperamento debe ser texto')
];
