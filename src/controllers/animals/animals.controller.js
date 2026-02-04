import prisma from "../../../prisma/prismaClient.js"
import convertToBoolean from "../../helpers/convertToBoolean.js";
import generateFolio from "../../helpers/generateFolio.js";

const getAnimals = async (req, res) => {
    try {
        const animals = await prisma.animales.findMany({
            include: {
                RazaCatalogo: true,
                Animales_Fotos: true,
                Propietario: true,
                Consultas_Veterinarias: {
                    select: {
                        disponible_adopcion: true
                    }
                },
                Vacunaciones: true,
                Esterilizaciones: true,
                Cuarentenas: true,
                Desparacitaciones: true
            },
            orderBy: {
                animal_id: "desc"
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

const getAnimalsDeaths = async (req, res) => {
    try {
        const animals = await prisma.animales.findMany({
            where: {
                muerto: true
            }
        })

        if (!animals > 0) {
            return res.status(404).json({ message: "No se pudieron obtener los animales"})
        }

        return res.status(200).json({ message: "Animales finados obtenidos exitosamente", animals })
    } catch (error) {
        return res.status(500).json({ message: "No se pudieron obtener los animales muertos", error: error.message });
    }
}

const getAnimalsByID = async (req, res) => {
    // Extracion del id por parametros
    const { search } = req.params

    // Manejo de errores
    if (!search) {
        return res.status(404).json({ message: "Falta ID"})
    }

    const conditions = [
        !isNaN(Number(search)) ? { animal_id: Number(search) } : null,
        { nombre_animal: { contains: search, mode: "insensitive" } },
        { numero_microchip: { contains: search, mode: "insensitive" } },
        { medalla: { contains: search, mode: "insensitive" } },
    ].filter(Boolean);

    try {
        const animal = await prisma.animales.findMany({
            where: {
                OR: conditions
            },
            include: {
                Consultas_Veterinarias: true
            }
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
            nombre_animal,
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
            estado_reproductivo,
            temperamento,
            costo,
            muerto 
        } = req.body;

        const razaId = Number(Raza)

        // Validar que Raza sea un numero para la relacion con el catalogo de razas
        if (!Number.isInteger(razaId)) {
            return res.status(400).json({ message: "La raza deber esta en el catalogo del sistema, no puede ser un texto" })
        }



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

        const raza = await prisma.cat_Razas.findUnique({
            where: {
                id: razaId
            }
        })

        if (!raza) {
            return res.status(404).json({ message: "La raza no existe en el catalogo" })
        }

        const booleanAdoptable = es_adoptable === true || es_adoptable === "true"

        const folioGenerado = await generateFolio("ANM")

        const animal = await prisma.animales.create({
            data: {
                folio: folioGenerado,
                nombre_animal,
                especie,
                Raza: razaId,
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
                es_adoptable: booleanAdoptable,
                registrado_por,
                estado_reproductivo,
                temperamento,
                costo,
                muerto: convertToBoolean(muerto)
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
        registrado_por,
        estado_reproductivo,
        temperamento,
        tiempo_estancia
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
        registrado_por,
        estado_reproductivo,
        temperamento,
        tiempo_estancia
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

    const {
        nombre_animal,
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
    } = req.body;

    const booleanAdoptable = es_adoptable === true || es_adoptable === "true"

    const data = {
        nombre_animal,
        especie,
        Raza: Number(Raza),
        edad,
        pelaje,
        peso: peso !== undefined ? Number(peso) : undefined,
        numero_microchip,
        medalla,
        tipo_ingreso,
        ubicacion_actual,
        estado_salud,
        sexo,
        observaciones,
        fecha_ingreso,
        es_adoptable: booleanAdoptable,
    };

    // Elimina campos undefined
    Object.keys(data).forEach(
        key => data[key] === undefined && delete data[key]
    )

    // Manejo de errores
    if (Object.keys(data).length === 0) {
        return res.status(404).json({ message: "No hay campos para actualizar" })
    }

    try {
        const animal = await prisma.animales.update({
            where: { animal_id: Number(id) },
            data
        })

        if (!animal) {
            return res.status(404).json({ message: "No se pudo actualizar el animal" })
        }

        return res.status(200).json({ message: "Animal actualizado correctamente", animal })
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
    getAnimalsDeaths,
    getAnimalsByID,
    createAnimal,
    createAnimalFlujo,
    updateAnimal,
    deleteAnimals
}