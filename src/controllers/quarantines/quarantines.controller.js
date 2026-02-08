import prisma from "../../../prisma/prismaClient.js";
import bitacora from "../../helpers/binnacle.js";

const getAllQuarantines = async (req, res) => {
    try {
        const { estatus } = req.query; // Puede ser: Activa, Finalizada, Cancelada o undefined para todas

        const whereClause = estatus 
            ? { estatus_cuarentena: estatus }
            : {
                estatus_cuarentena: {
                    in: ["Activa", "Finalizada", "Cancelada"]
                }
            };

        const quarantines = await prisma.cuarentenas.findMany({
            where: whereClause,
            orderBy: {
                fecha_inicio: "desc"
            },
            include: {
                Animal: {
                    select: {
                        animal_id: true,
                        nombre_animal: true,
                        especie: true,
                        estado_salud: true,
                        numero_microchip: true,
                        folio: true
                    }
                },
                Usuarios: {
                    select: {
                        usuario_id: true,
                        nombre_completo: true
                    }
                },
                Consulta: {
                    select: {
                        consulta_id: true,
                        diagnostico: true,
                        fecha_hora_consulta: true
                    }
                }
            }
        });

        return res.status(200).json(quarantines);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getQuarantinesByAnimal = async (req, res) => {
    const { search } = req.params; // Puede ser: nombre, id o microchip

    try {
        // Intentar convertir a número para buscar por ID
        const searchAsNumber = Number(search);
        const isNumeric = !isNaN(searchAsNumber) && search !== "";

        // Buscar el animal primero por nombre, id o microchip
        const animals = await prisma.animales.findMany({
            where: {
                OR: [
                    isNumeric ? { animal_id: searchAsNumber } : undefined,
                    { nombre_animal: { contains: search, mode: "insensitive" } },
                    { numero_microchip: { contains: search, mode: "insensitive" } }
                ].filter(Boolean)
            }
        });

        if (!animals || animals.length === 0) {
            return res.status(404).json({
                message: "Animal no encontrado"
            });
        }

        // Obtener los IDs de los animales encontrados
        const animalIds = animals.map(animal => animal.animal_id);

        // Buscar cuarentenas de esos animales (solo activas, finalizadas o canceladas)
        const quarantines = await prisma.cuarentenas.findMany({
            where: {
                animal_id: { in: animalIds },
                estatus_cuarentena: {
                    in: ["Activa", "Finalizada", "Cancelada"]
                }
            },
            orderBy: {
                fecha_inicio: "desc"
            },
            include: {
                Animal: {
                    select: {
                        animal_id: true,
                        nombre_animal: true,
                        especie: true,
                        estado_salud: true,
                        numero_microchip: true
                    }
                },
                Usuarios: {
                    select: {
                        usuario_id: true,
                        nombre_completo: true
                    }
                },
                Consulta: {
                    select: {
                        consulta_id: true,
                        diagnostico: true,
                        fecha_hora_consulta: true
                    }
                }
            }
        });

        return res.status(200).json(quarantines);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createQuarantine = async (req, res) => {
    const {
        animal_id,
        consulta_id,
        cantidad_dias,
        fecha_inicio,
        observaciones,
        registrado_por
    } = req.body;

    try {
        // Validar campos requeridos
        if (!animal_id || !cantidad_dias || !fecha_inicio || !observaciones || !registrado_por) {
            return res.status(400).json({
                message: "Faltan campos requeridos: animal_id, cantidad_dias, fecha_inicio, observaciones, registrado_por"
            });
        }

        // Validar que el animal existe
        const animal = await prisma.animales.findUnique({
            where: { animal_id: Number(animal_id) }
        });

        if (!animal) {
            return res.status(404).json({
                message: "Animal no encontrado"
            });
        }

        // Validar que el usuario existe
        const usuario = await prisma.usuarios.findUnique({
            where: { usuario_id: registrado_por }
        });

        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        // Si se proporciona consulta_id, validar que existe
        if (consulta_id) {
            const consulta = await prisma.consultas_Veterinarias.findUnique({
                where: { consulta_id: Number(consulta_id) }
            });

            if (!consulta) {
                return res.status(404).json({
                    message: "Consulta veterinaria no encontrada"
                });
            }
        }

        // Calcular fecha_fin_estimada basada en cantidad_dias
        const fechaInicio = new Date(fecha_inicio);
        const fechaFinEstimada = new Date(fechaInicio);
        fechaFinEstimada.setDate(fechaFinEstimada.getDate() + Number(cantidad_dias));

        // Crear cuarentena
        const quarantine = await prisma.cuarentenas.create({
            data: {
                animal_id: Number(animal_id),
                consulta_id: consulta_id ? Number(consulta_id) : null,
                cantidad_dias: Number(cantidad_dias),
                fecha_inicio: fechaInicio,
                fecha_fin_estimada: fechaFinEstimada,
                observaciones: observaciones,
                registrado_por
            },
            include: {
                Animal: {
                    select: {
                        animal_id: true,
                        nombre_animal: true,
                        especie: true
                    }
                },
                Usuarios: {
                    select: {
                        usuario_id: true,
                        nombre_completo: true
                    }
                },
                Consulta: {
                    select: {
                        consulta_id: true,
                        diagnostico: true,
                        fecha_hora_consulta: true
                    }
                }
            }
        });

        const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

        const ip = rawIp?.replace('::ffff', '');

        await bitacora({
            usuarioId: registrado_por,
            fecha_hora: new Date().toISOString(),
            operacion: "CREACION",
            ip,
            resultado: `Cuarentena creada con ID ${quarantine.cuarentena_id}`
        })

        return res.status(201).json({
            message: "Cuarentena registrada correctamente",
            data: quarantine
        });

    } catch (error) {
        // Errores comunes en prisma
        if (error.code === "P2003") {
            return res.status(400).json({
                message: "Animal, consulta o usuario no existe"
            });
        }

        return res.status(500).json({ message: error.message });
    }
};

const updateQuarantine = async (req, res) => {
    const { id } = req.params;
    const {
        animal_id,
        consulta_id,
        cantidad_dias,
        fecha_inicio,
        observaciones,
        registrado_por,
        estatus_cuarentena,
        fecha_fin_real
    } = req.body;

    try {
        // Verificar que la cuarentena existe
        const existingQuarantine = await prisma.cuarentenas.findUnique({
            where: { cuarentena_id: Number(id) }
        });

        if (!existingQuarantine) {
            return res.status(404).json({
                message: "Cuarentena no encontrada"
            });
        }

        // Preparar datos de actualización
        const updateData = {};

        // Validar y actualizar animal_id si se proporciona
        if (animal_id !== undefined) {
            const animal = await prisma.animales.findUnique({
                where: { animal_id: Number(animal_id) }
            });

            if (!animal) {
                return res.status(404).json({
                    message: "Animal no encontrado"
                });
            }

            updateData.animal_id = Number(animal_id);
        }

        // Validar y actualizar registrado_por si se proporciona
        if (registrado_por !== undefined) {
            const usuario = await prisma.usuarios.findUnique({
                where: { usuario_id: registrado_por }
            });

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                });
            }

            updateData.registrado_por = registrado_por;
        }

        // Validar y actualizar consulta_id si se proporciona
        if (consulta_id !== undefined) {
            if (consulta_id === null || consulta_id === "") {
                updateData.consulta_id = null;
            } else {
                const consulta = await prisma.consultas_Veterinarias.findUnique({
                    where: { consulta_id: Number(consulta_id) }
                });

                if (!consulta) {
                    return res.status(404).json({
                        message: "Consulta veterinaria no encontrada"
                    });
                }

                updateData.consulta_id = Number(consulta_id);
            }
        }

        // Actualizar cantidad_dias y recalcular fecha_fin_estimada
        if (cantidad_dias !== undefined) {
            updateData.cantidad_dias = Number(cantidad_dias);
        }

        // Actualizar fecha_inicio y recalcular fecha_fin_estimada
        if (fecha_inicio !== undefined) {
            updateData.fecha_inicio = new Date(fecha_inicio);
        }

        // Recalcular fecha_fin_estimada si cambió cantidad_dias o fecha_inicio
        if (cantidad_dias !== undefined || fecha_inicio !== undefined) {
            const fechaInicio = updateData.fecha_inicio || existingQuarantine.fecha_inicio;
            const cantidadDias = updateData.cantidad_dias || existingQuarantine.cantidad_dias;
            const fechaFinEstimada = new Date(fechaInicio);
            fechaFinEstimada.setDate(fechaFinEstimada.getDate() + cantidadDias);
            updateData.fecha_fin_estimada = fechaFinEstimada;
        }

        // Actualizar observaciones
        if (observaciones !== undefined) {
            updateData.observaciones = observaciones;
        }

        // Actualizar estatus_cuarentena
        if (estatus_cuarentena !== undefined) {
            updateData.estatus_cuarentena = estatus_cuarentena;
        }

        // Actualizar fecha_fin_real
        if (fecha_fin_real !== undefined) {
            updateData.fecha_fin_real = fecha_fin_real ? new Date(fecha_fin_real) : null;
        }

        // Actualizar cuarentena
        const updatedQuarantine = await prisma.cuarentenas.update({
            where: { cuarentena_id: Number(id) },
            data: updateData,
            include: {
                Animal: {
                    select: {
                        animal_id: true,
                        nombre_animal: true,
                        especie: true
                    }
                },
                Usuarios: {
                    select: {
                        usuario_id: true,
                        nombre_completo: true
                    }
                },
                Consulta: {
                    select: {
                        consulta_id: true,
                        diagnostico: true,
                        fecha_hora_consulta: true
                    }
                }
            }
        });

        return res.status(200).json({
            message: "Cuarentena actualizada correctamente",
            data: updatedQuarantine
        });

    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Cuarentena no encontrada"
            });
        }

        if (error.code === "P2003") {
            return res.status(400).json({
                message: "Animal, consulta o usuario no existe"
            });
        }

        return res.status(500).json({ message: error.message });
    }
};

export {
    getAllQuarantines,
    getQuarantinesByAnimal,
    createQuarantine,
    updateQuarantine
};

