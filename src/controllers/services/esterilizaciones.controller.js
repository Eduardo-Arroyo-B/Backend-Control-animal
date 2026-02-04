import prisma from "../../../prisma/prismaClient.js";

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

        // Generar el nuevo folio
        let nuevoFolio;
        const añoActual = new Date().getFullYear();

        if (ultimaEsterilizacion && ultimaEsterilizacion.folio_servicio) {
            // Extraer el número del último folio
            // Formato esperado: EST-YYYY-NNN o similar
            const match = ultimaEsterilizacion.folio_servicio.match(/(\d+)$/);
            if (match) {
                const ultimoNumero = parseInt(match[1], 10);
                const siguienteNumero = ultimoNumero + 1;
                nuevoFolio = `EST-${añoActual}-${String(siguienteNumero).padStart(3, '0')}`;
            } else {
                // Si no se puede parsear, empezar desde 1
                nuevoFolio = `EST-${añoActual}-001`;
            }
        } else {
            // Si no hay esterilizaciones previas, empezar desde 1
            nuevoFolio = `EST-${añoActual}-001`;
        }

        const esterilizacion = await prisma.esterilizaciones.create({
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
        });

        return res.status(201).json({
            message: "Esterilización registrada correctamente",
            esterilizacion
        });
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

        return res.status(500).json({
            message: error.message
        });
    }
};

export {
    getAllEsterilizaciones,
    createEsterilizacion
};

