import prisma from "../../../prisma/prismaClient.js"

const getAnimals = async (req, res) => {
    try {
        const animals = prisma.animales.findMany()

        if (!animals) {
            return res.status(404).json({ message: "No se pudieron obtener los animales"})
        }

        return res.status(200).json({ message: "Animales obtenidos exitosamente", animals })
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

const getAnimalsByID = async (req, res) => {
    // Extracion del id por parametros
    const { id } = req.params

    // Manejo de errores
    if (!id) {
        return res.status(404).json({ message: "Falta ID"})
    }

    try {
        const animal = await prisma.animales.findUnique({
            where: {
                animal_id: id
            },
        })

        if (!animal) {
            return res.status(404).json({ message: "No se pudo obtener el animal" })
        }

        return res.status(200).json({ message: "Animal obtenido exitosamente", animal })
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

const createAnimals = async (req, res) => {
    const {
        folio_interno,
        microchip,
        nombre,
        especie_animal,
        raza_id,
        sexo_animal,
        edad_aproximada,
        peso_kg,
        tamano_animal,
        temperamento_animal,
        propietario_id,
        estatus_animal,
        es_adoptable,
        disponible_adopcion,
        fecha_disponible_adopcion,
        autorizado_adopcion_por
    } = req.body;

    try {
        // Validar duplicados (indices UNIQUE)
        const exists = await prisma.animales.findFirst({
            where: {
                OR: [
                    { folio_interno },
                    { microchip }
                ]
            }
        });

        if (exists) {
            return res.status(409).json({
                message: "Ya existe un animal con ese folio o microchip"
            });
        }

        // Crear animal
        const animal = await prisma.animales.create({
            data: {
                folio_interno,
                microchip,
                nombre,
                especie_animal,
                raza_id: Number(raza_id),
                sexo_animal,
                edad_aproximada: Number(edad_aproximada),
                peso_kg: Number(peso_kg),
                tamano_animal: Number(tamano_animal),
                temperamento_animal,
                propietario_id,
                estatus_animal,
                es_adoptable: Boolean(es_adoptable),
                disponible_adopcion: Boolean(disponible_adopcion),
                fecha_disponible_adopcion: fecha_disponible_adopcion
                    ? new Date(fecha_disponible_adopcion)
                    : null,
                autorizado_adopcion_por
            }
        });

        if (!animal) {
            return res.status(404).json({ message: "No se pudo crear el animal"})
        }

        return res.status(201).json({
            message: "Animal creado correctamente",
            data: animal
        });

    } catch (error) {
        // Errores comunes Prisma
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Registro duplicado (folio o microchip)"
            });
        }

        if (error.code === "P2003") {
            return res.status(400).json({
                message: "Relación inválida (raza, propietario o usuario no existe)"
            });
        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

const deleteAnimals = async (req, res) => {
    // Obtener id de los parametros
    const { id } = req.params

    // Manejo de errores
    if (!id) {
        return res.status(404).json({ message: "Falta ID"})
    }

    try {
        const animal = await prisma.animales.findUnique({
            where: {
                animal_id: id
            }
        })

        if (!animal) {
            return res.status(404).json({ message: "No se encontro el animal a eliminar" })
        }

        return res.status(200).json({ message: "Animal eliminado exitosamente", animal })
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

export {
    getAnimals,
    getAnimalsByID,
    createAnimals,
    deleteAnimals
}