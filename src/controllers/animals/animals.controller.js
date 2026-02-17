import prisma from "../../../prisma/prismaClient.js"
import convertToBoolean from "../../helpers/convertToBoolean.js";
import generateFolio from "../../helpers/generateFolio.js";
import bitacora from "../../helpers/binnacle.js"

const getAnimals = async (req, res) => {
    try {
        const animals = await prisma.animales.findMany({
            include: {
                RazaCatalogo: true,
                Animales_Fotos: true,
                Propietario: true,
                Consultas_Veterinarias: true,
                Vacunaciones: true,
                Esterilizaciones: true,
                Cuarentenas: true,
                Desparacitaciones: true,
                Usuarios: {
                    select: {
                        nombre_completo: true,
                        username: true
                    }
                }
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
            },
            include: {
                RazaCatalogo: true
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

    const isAnimalId =
        /^\d+$/.test(search) && Number(search) <= 2147483647;

    // Busqueda
    const conditions = [
        isAnimalId ? { animal_id: Number(search) } : null,
        { nombre_animal: { contains: search, mode: "insensitive" } },
        { numero_microchip: { contains: search, mode: "insensitive" } },
        { folio: { contains: search, mode: "insensitive" } },
        { ruac: { contains: search, mode: "insensitive" } },
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

        if (animal > 0) {
            return res.status(404).json({ message: "No existen animales actualmente" })
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
            fecha_implantacion_microchip,
            ubicacion_anatomica_microchip,
            lote_microchip,
            medico_implanto_microchip,
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

        const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        const ip = rawIp?.replace('::ffff', '');

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

        const microchip = await prisma.animales.findUnique({
            where: {
                numero_microchip
            }
        })

        if (microchip) {
            return res.status(404).json({ message: "No se puede crear un animal con microchip existente" })
        }

        const booleanAdoptable = es_adoptable === true || es_adoptable === "true"

        const folioGenerado = await generateFolio("ANM")

        console.log(numero_microchip)

        const animal = await prisma.animales.create({
            data: {
                folio: folioGenerado,
                nombre_animal,
                especie,
                Raza: razaId,
                edad,
                pelaje,
                peso: Number(peso),
                numero_microchip: numero_microchip?.trim() && /^\d+$/.test(numero_microchip.trim())
                ?  numero_microchip.trim()
                : null,
                fecha_implantacion_microchip,
                ubicacion_anatomica_microchip,
                lote_microchip,
                medico_implanto_microchip,
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

        await bitacora({
            usuarioId: registrado_por,
            fecha_hora: new Date().toISOString(),
            operacion: "CREACION",
            ip,
            resultado: `Animal creado con ID ${folioGenerado}`
        })

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
        nombre_animal,
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
        numero_microchip,
        fecha_implantacion_microchip,
        ubicacion_anatomica_microchip,
        lote_microchip,
        medico_implanto_microchip,
        relacion_animal,
        registrado_por,
        estado_reproductivo,
        temperamento,
        tiempo_estancia,
        Raza,
        especie
    } = req.body;

    const razaId = Number(Raza)

    // Objeto del animal
    const animalData = {
        nombre_animal,
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
        numero_microchip,
        fecha_implantacion_microchip,
        ubicacion_anatomica_microchip,
        lote_microchip,
        medico_implanto_microchip,
        relacion_animal,
        registrado_por,
        estado_reproductivo,
        temperamento,
        tiempo_estancia,
        Raza: razaId,
        especie
    }
    try {
        // Validar que no exista Microchip identico
        if (numero_microchip){
            const microchip = await prisma.animales.findUnique({
                where: {
                    numero_microchip
                }
            })
            if (microchip) {
                return res.status(200).json({ message: "No se puede crear un animal con microchip existente" })
            }
        }

        const folioGenerado = await generateFolio("ANM")

        const animal = await prisma.animales.create({
            data: {
                ...animalData,
                folio: folioGenerado
            }
        });

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

        const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const ip = rawIp?.replace('::ffff', '');

        await bitacora({
            usuarioId: registrado_por,
            fecha_hora: new Date().toISOString(),
            operacion: "CREACION",
            ip,
            resultado: `Animal creado con ID ${animal.animal_id}`
        })

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
        fecha_implantacion_microchip,
        ubicacion_anatomica_microchip,
        lote_microchip,
        medico_implanto_microchip,
        medalla,
        tipo_ingreso,
        ubicacion_actual,
        estado_salud,
        sexo,
        observaciones,
        actualizado_por,
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
        fecha_implantacion_microchip,
        ubicacion_anatomica_microchip,
        lote_microchip,
        medico_implanto_microchip,
        medalla,
        tipo_ingreso,
        ubicacion_actual,
        estado_salud,
        sexo,
        observaciones,
        actualizado_por,
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

    // Validar que no exista Microchip identico
    if (numero_microchip) {
        const existente = await prisma.animales.findFirst({
            where: {
            numero_microchip,
            animal_id: { not: Number(id) }
            }
        })

        if (existente) {
            return res.status(200).json({ 
            message: "Ya existe otro animal con ese microchip" 
            })
        }
    }

    try {
        const animal = await prisma.animales.update({
            where: { animal_id: Number(id) },
            data
        })

        if (!animal) {
            return res.status(404).json({ message: "No se pudo actualizar el animal" })
        }

        const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const ip = rawIp?.replace('::ffff', '');

        await bitacora({
            usuarioId: actualizado_por,
            fecha_hora: new Date().toISOString(),
            operacion: "UPDATE",
            ip,
            resultado: `Animal actualizado con ID ${animal.animal_id}`
        })

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

const getMiniExpedienteAnimal = async (req, res) => {
    try {
        const expediente = await prisma.mini_Expediente_Animal.findMany({
            include: {
                CatalogoRaza: true,
                Propietario: {
                    include: {
                        Animales: {
                            include: {
                                Animales_Fotos: true
                            }
                        }
                    }
                }
            }
        })

        if (expediente > 0) {
            return res.status(200).json({ message: "No hay expedientes creados por los ciudadanos" })
        }

        return res.status(200).json({ message: "Expedientes obtenidos exitosamente", expediente })
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
}

const createMiniExpedienteAnimal = async (req, res) => {
    // Extraccion de datos del body
    const {
        nombre,
        propietario_id,
        edad,
        sexo,
        pelaje,
        especie,
        estado_reproductivo,
        numero_microchip,
        foto_url,
        ubicacion_anatomica
    } = req.body;

    const expedienteData = {
        nombre:                 String(nombre || '').trim() || null,
        propietario_id:         propietario_id ? String(propietario_id).trim() : null,
        edad:                   edad ? Number(edad) : null,
        sexo:                   String(sexo || '').trim() || null,
        pelaje:                 String(pelaje || '').trim() || null,
        especie:                String(especie || '').trim() || null,
        estado_reproductivo:    String(estado_reproductivo || '').trim() || null,
        numero_microchip:       /^\d{15}$/.test(String(numero_microchip || '')) 
                                    ? String(numero_microchip).trim() 
                                    : null,
        foto_url:               String(foto_url || '').trim() || null,
        ubicacion_anatomica:    String(ubicacion_anatomica || '').trim() || null,

        CatalogoRaza: {
            connect: { id: Number(raza_id) }
        },

        Propietario: {
            connect: { id: propietario_id }
        }
    };

    try {
        const expediente = await prisma.Mini_Expediente_Animal.create({
            data: expedienteData,
            include: {
                propietario: true,
            }
        })

        if (!expediente) {
            return res.status().json({ message: "No se pudo crear el expediente" })
        }

        //  Generar RUAC
        const especieLetra = expediente.especie?.charAt(0).toUpperCase() || "X";
        const sexoLetra    = expediente.sexo?.charAt(0).toUpperCase() || "X";
        const paterno      = expediente.propietario?.apellido_paterno?.charAt(0).toUpperCase() || "X";
        const materno      = expediente.propietario?.apellido_materno?.charAt(0).toUpperCase() || "X";
        const inicialNom   = expediente.propietario?.nombre?.charAt(0).toUpperCase() || "X";

        const folio = await prisma.folio_RUAC.create({
            data: {
                tipo: "RUAC"
            }
        })

        const folioStr = String(folio.id).padStart(6, "0");

        const ruac = `${especieLetra}${sexoLetra}${paterno}${materno}${inicialNom}${folioStr}`;

        if (ruac.length !== 11) {
        return res.status(500).json({ message: "RUAC generado inválido" });
        }

        // Actualizar expediente con el RUAC
        const expedienteActualizado = await prisma.Mini_Expediente_Animal.update({
        where: { id: expediente.id },
        data: { ruac }
        });

        return res.status(201).json({ message: "Expediente creado exitosamente", expediente })
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al crear el expediente", error: error.message });
    }
}

const createRUAC = async (req, res) => {
    try {
        const { animalId } = req.body

        if (!animalId) {
            return res.status(404).json({ message: "El id del animal es requerido" })
        }

        // Buscar animal con propietario
        const animal = await prisma.animales.findUnique({
            where: { animal_id: Number(animalId) },
            include: { Propietario: true }
        })

        if (!animal) {
            return res.status(404).json({ message: "Animal no encontrado" })
        }

        const propietario = animal.Propietario

        if (!propietario) {
            return res.status(404).json({ message: "El animal no tiene propietario asignado" })
        }

        // Contruccion De RUAC

        const especie = animal.especie?.charAt(0).toUpperCase() || "X"
        const sexo = animal.sexo?.charAt(0).toUpperCase() || "X"

        const primerApellido = propietario.apellido_paterno?.charAt(0).toUpperCase() || "X"
        const segundoApellido = propietario.apellido_materno?.charAt(0).toUpperCase() || "X"

        const inicialNombre = propietario.nombre?.charAt(0).toUpperCase() || "X"

        // Generar folio consecutivo
        const nuevoFolio = await prisma.folio_RUAC.create({
            data: {
                tipo: "RUAC"
            }
        })

        if (!nuevoFolio) {
            return res.status(404).json({ message: "No se pudo generar el nuevo folio" })
        }

        const folioFormateado = String(nuevoFolio.id).padStart(6, "0")

        // Unir todo
        const ruac = `${especie}${sexo}${primerApellido}${segundoApellido}${inicialNombre}${folioFormateado}`

        if (ruac.length !== 11) {
            return res.status(404).json({ message: "Error generando RUAC invalido" })
        }

        const updateAnimal = await prisma.animales.update({
            where: {
                animal_id: Number(animalId),
            },
            data: {
                ruac,
            }
        })

        if (!updateAnimal) {
            return res.status(404).json({ message: "No se pudo actualizar el ruac del animal" })
        }

        return res.status(201).json({ message: "Animal actualizado correctamente", ruac })
    } catch (error) {
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
    deleteAnimals,
    getMiniExpedienteAnimal,
    createMiniExpedienteAnimal,
    createRUAC
}