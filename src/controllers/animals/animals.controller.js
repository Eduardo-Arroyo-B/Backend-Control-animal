import prisma from "../../../prisma/prismaClient.js"

const getAnimals = async (req, res) => {
    try {
        const animals = await prisma.animales.findMany({
            include: {
                Animales_Fotos: true
            }
        })

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
    const { search } = req.params

    // Manejo de errores
    if (!id) {
        return res.status(404).json({ message: "Falta ID"})
    }

    try {
        const animal = await prisma.animales.findUnique({
            where: {
                OR: [
                    { animal_id: Number(search) },

                    { nombre_animal: { contains: search, mode: "insensitive" } },
                    { numero_microchip: { contains: search, mode: "insensitive" } },
                    { medalla: { contains: search, mode: "insensitive" } },
                ]
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

const createAnimal = async (req, res) => {
    try {
        const {
            nombre,
            especie,
            Raza,
            edad,
            pelaje,
            peso,
            numero_microchip,
            medalla,
            tipo_ingreso,
            ubicacion_actual,
            estado_salud,
            sexo,
            observaciones,
            fecha_ingreso,
            es_adoptable,
            registrado_por,
        } = req.body;

        // Validar relacion con el usuario que lo crea
        const usuario = await prisma.usuarios.findUnique({
            where: {
                usuario_id: registrado_por,
            },
        });

        if (!usuario) {
            return res.status(404).json({
                message: "El usuario autorizador no existe",
            });
        }

        const animal = await prisma.animales.create({
            data: {
                nombre,
                especie,
                Raza,
                edad,
                pelaje,
                peso: Number(peso),
                numero_microchip,
                medalla,
                tipo_ingreso,
                ubicacion_actual,
                estado_salud,
                sexo,
                observaciones: observaciones || "",
                fecha_ingreso,
                es_adoptable: Boolean(es_adoptable),
                registrado_por,
            },
        });

        // Guardar fotos si se enviaron
        if (req.files && req.files.length > 0) {
            const fotosData = req.files.map((file, index) => ({
                animal_id: animal.animal_id,
                url: file.path.replace(/\\/g, "/"),
            }))

            const animalFotos = await prisma.animales_Fotos.createMany({
                data: fotosData
            })

            console.log("Fotos creadas", animalFotos)
        }

        return res.status(201).json({
            message: "Animal creado correctamente",
            animal,
        });
    } catch (error) {
        console.error("Error al crear animal:", error);

        // Error por campo unique (si luego lo agregas)
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "El número de microchip ya existe",
            });
        }

        return res.status(500).json({ message: "Error interno del servidor",  error: error.message });
    }
};

const createAnimalFlujo = async (req, res) => {
    // Extraccion de los datos del body
    const {
        tipo_ingreso,
        fecha_hora_ingreso,
        condicion_ingreso,
        ubicacion_captura_rescate,
        colonia,
        responsable_captura,
        motivo_ingreso,
        nombre,
        apellido_paterno,
        apellido_materno,
        tipo_identificacion,
        numero_identificacion,
        telefono,
        correo,
        relacion_animal,
        registrado_por
    } = req.body;

    // Objeto del animal
    const animalData = {
        tipo_ingreso,
        fecha_hora_ingreso,
        condicion_ingreso,
        ubicacion_captura_rescate,
        colonia,
        responsable_captura,
        motivo_ingreso,
        nombre,
        apellido_paterno,
        apellido_materno,
        tipo_identificacion,
        numero_identificacion,
        telefono,
        correo,
        relacion_animal,
        registrado_por
    }

    try {
        const animal = await prisma.animales.create({
            data: animalData
        })

        if (!animal) {
            return res.status(404).json({ message: "No se pudo crear el animal" })
        }

        // Guardar fotos si se enviaron
        if (req.files && req.files.length > 0) {
            const fotosData = req.files.map((file, index) => ({
                animal_id: animal.animal_id,
                url: file.path.replace(/\\/g, "/"),
            }))

            const animalFotos = await prisma.animales_Fotos.createMany({
                data: fotosData
            })

            console.log("Fotos creadas", animalFotos)
        }

        return res.status(201).json({ message: "Animal creado exitosamente", animal })
    } catch(error) {
        return res.status(404).json({ message: error.message });
    }
}

const updateAnimal = async (req, res) => {
    // Extraer el ID de los parametros
    const { id } = req.params;

    try {

    } catch (error) {
        return res.status(500).json({ message: "No se pudo crear el animal", error: error.message });
    }
}

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
    createAnimal,
    createAnimalFlujo,
    deleteAnimals
}