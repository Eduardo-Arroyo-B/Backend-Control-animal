import prisma from "../../../prisma/prismaClient.js";
import bitacora from "../../helpers/binnacle.js";
import generateFolio from "../../helpers/generateFolio.js";

const getAllEsterilizaciones = async (req, res) => {
    try {
        const esterilizaciones = await prisma.esterilizaciones.findMany({
            orderBy: {
                fecha_cirujia: "desc"
            },
            include: {
                Animal: {
                    select: {
                        animal_id: true,
                        nombre_animal: true,
                        especie: true,
                        Raza: true,
                        sexo: true,
                        RazaCatalogo: true,
                    }
                },
                Propietario: {
                    select: {
                        propietario_id: true,
                        nombre: true,
                        apellido_paterno: true,
                        apellido_materno: true,
                        telefono: true,
                        email: true
                    }
                },
                Veterinario: {
                    select: {
                        usuario_id: true,
                        username: true,
                        nombre_completo: true,
                        email: true
                    }
                }
            }
        });

        return res.status(200).json({
            message: "Esterilizaciones obtenidas exitosamente",
            esterilizaciones
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createEsterilizacion = async (req, res) => {
    const {
        animal_id,
        tipo,
        fecha_cirujia,
        metodo,
        complicaciones,
        observaciones,
        propietario_id,
        veterinario_cirujano_id,
        zona
    } = req.body;

    // Validación de campos requeridos
    if (!animal_id || !tipo || !fecha_cirujia || !metodo || !veterinario_cirujano_id) {
        return res.status(400).json({
            message: "Faltan campos requeridos: animal_id, tipo, fecha_cirujia, metodo, propietario_id, veterinario_cirujano_id"
        });
    }

    try {
        // Normalizar propietario_id opcional: si viene vacío, lo convertimos a null
        const propietarioIdValue =
            propietario_id && propietario_id.trim() !== "" ? propietario_id : null;

        // Obtener la última esterilización para generar el siguiente folio
        const ultimaEsterilizacion = await prisma.esterilizaciones.findFirst({
            orderBy: {
                esterilizacion_id: "desc"
            }
        });

        const nuevoFolio = await generateFolio("EST")

        const transaction = async (req, res) => {
            const { id, estadoReproductivo } = req.body;
                try{
                    const result = await prisma.$transaction(async tx => {
                        const esterilizacion = await tx.esterilizacion.create({
                            data: {
                                folio_servicio: nuevoFolio,
                                animal_id: Number(animal_id),
                                tipo,
                                fecha_cirujia: new Date(fecha_cirujia),
                                metodo,
                                complicaciones: complicaciones || "",
                                observaciones: observaciones || "",
                                propietario_id: propietarioIdValue,
                                veterinario_cirujano_id,
                                zona
                            },
                            include: {
                                Animal: {
                                    select: {
                                        animal_id: true,
                                        nombre: true,
                                        especie: true,
                                        Raza: true
                                    }
                                },
                                Propietario: {
                                    select: {
                                        propietario_id: true,
                                        nombre: true,
                                        apellido_paterno: true,
                                        apellido_materno: true
                                    }
                                },
                                Veterinario: {
                                    select: {
                                        usuario_id: true,
                                        username: true,
                                        nombre_completo: true
                                    }
                                }
                            }
                        })
                        if (!esterilizacion) {
                                return res.status(404).json({ message: "No se pudo crear esterilizacion" })
                            }
                        const animalid = await prisma.animales.findUnique({
                                where: {
                                    animal_id: Number(id)
                                }
                            })

                        if (!animalid) {
                            return res.status(404).json({ message: "No se encontro el animal a actualizar" })
                        }

                        const animal = await tx.animales.update({
                            where: { animal_id: Number(id) },
                            estado_reproductivo : estadoReproductivo
                        })

                        if (!animal) {
                            return res.status(404).json({ message: "No se pudo actualizar el animal" })
                        }
                        const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

                        const ip = rawIp?.replace('::ffff', '');
                        await bitacora({
                            usuarioId: veterinario_cirujano_id,
                            fecha_hora: new Date().toISOString(),
                            operacion: "CREACION",
                            ip,
                            resultado: `Esterilizacion creada con ID ${nuevoFolio}`
                        })       
                    })
                    if (!result) {
                        return res.status(404).json({ message: "No se pudo crear esterilizacion ni modificar estatus" })
                    }
                    return res.status(201).json({
                    message: "Esterilización registrada correctamente",
                    esterilizacion
                });
                } catch (error) {
                    return res.status(500).json({
                    message: error.message
                });
            }
        }
    } catch (error) {
        // Errores comunes de prisma
        if (error.code === "P2002") {
            return res.status(400).json({
                message: "Error al generar el folio. Intente nuevamente."
            });
        }
        if (error.code === "P2003") {
            return res.status(400).json({
                message: "El animal, propietario o veterinario no existe"
            });
        }
    }
};

export {
    getAllEsterilizaciones,
    createEsterilizacion
};

