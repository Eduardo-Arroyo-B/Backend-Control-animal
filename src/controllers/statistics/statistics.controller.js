import prisma from "../../../prisma/prismaClient.js";

const getStatistics = async (req, res) => {
    try {
        const animales = await prisma.animales.count()

        const adopciones =  await prisma.adopciones.count()

        const vacunaciones = await prisma.vacunaciones.count()

        return res.status(200).json({
            message: "Estadisticas obtenidas exitosamente",
            animales,
            adopciones,
            vacunaciones
        })
    } catch (error) {
        res.status(500).json({ message: "Ha ocurrido un error al obtener las estadisticas", error: error.message });
    }
}

const getCompleteStatistics = async (req, res) => {
    try {
        // Estadísticas de Animales
        const totalAnimales = await prisma.animales.count();
        const animalesAdoptables = await prisma.animales.count({
            where: { es_adoptable: true }
        });
        const animalesConPropietario = await prisma.animales.count({
            where: { propietario_id: { not: null } }
        });
        const animalesMuertos = await prisma.animales.count({
            where: { muerto: true }
        });
        const animalesVivos = await prisma.animales.count({
            where: { muerto: false }
        });

        // Estadísticas por especie
        const animalesPorEspecie = await prisma.animales.groupBy({
            by: ['especie'],
            where: { especie: { not: null } },
            _count: { especie: true }
        });

        // Estadísticas de Adopciones
        const totalAdopciones = await prisma.adopciones.count();
        const adopcionesAprobadas = await prisma.adopciones.count({
            where: { estatus_adopcion: 'Aprobada' }
        });
        const adopcionesPendientes = await prisma.adopciones.count({
            where: { estatus_adopcion: 'Pendiente' }
        });
        const adopcionesRechazadas = await prisma.adopciones.count({
            where: { estatus_adopcion: 'Rechazada' }
        });
        const adopcionesCanceladas = await prisma.adopciones.count({
            where: { estatus_adopcion: 'Cancelada' }
        });

        // Estadísticas de Propietarios
        const totalPropietarios = await prisma.propietario.count();
        const propietariosActivos = await prisma.propietario.count({
            where: { estatus_propietario: { contains: 'Activo', mode: 'insensitive' } }
        });

        // Estadísticas de Vacunaciones
        const totalVacunaciones = await prisma.vacunaciones.count();
        const vacunacionesProximas = await prisma.vacunaciones.count({
            where: {
                proxima_dosis: {
                    gte: new Date(),
                    lte: new Date(new Date().setDate(new Date().getDate() + 30))
                }
            }
        });

        // Estadísticas de Consultas Veterinarias
        const totalConsultas = await prisma.consultas_Veterinarias.count();
        const consultasDisponiblesAdopcion = await prisma.consultas_Veterinarias.count({
            where: { disponible_adopcion: true }
        });

        // Estadísticas de Esterilizaciones
        const totalEsterilizaciones = await prisma.esterilizaciones.count();

        // Estadísticas de Cuarentenas
        const totalCuarentenas = await prisma.cuarentenas.count();
        const cuarentenasActivas = await prisma.cuarentenas.count({
            where: { estatus_cuarentena: 'Activa' }
        });
        const cuarentenasFinalizadas = await prisma.cuarentenas.count({
            where: { estatus_cuarentena: 'Finalizada' }
        });

        // Estadísticas de Defunciones
        const totalDefunciones = await prisma.defunciones.count();

        // Estadísticas de Cremaciones
        const totalCremaciones = await prisma.cremaciones.count();

        // Estadísticas de Reportes Ciudadanos
        const totalReportes = await prisma.reportes_Ciudadanos.count();
        const reportesPendientes = await prisma.reportes_Ciudadanos.count({
            where: { estatus_reporte: 'Pendiente' }
        });
        const reportesEnProceso = await prisma.reportes_Ciudadanos.count({
            where: { estatus_reporte: 'En_Proceso' }
        });
        const reportesAtendidos = await prisma.reportes_Ciudadanos.count({
            where: { estatus_reporte: 'Atendido' }
        });
        const reportesCerrados = await prisma.reportes_Ciudadanos.count({
            where: { estatus_reporte: 'Resuelto' }
        });

        // Estadísticas de Inventario
        const totalMedicamentos = await prisma.inventario_Medicamentos.count();
        const medicamentos = await prisma.inventario_Medicamentos.findMany({
            select: {
                cantidad_disponibles: true,
                stock_alerta: true
            }
        });
        const medicamentosBajoStock = medicamentos.filter(
            m => m.cantidad_disponibles <= m.stock_alerta
        ).length;

        const totalAlimentos = await prisma.inventario_Alimento.count();
        const alimentos = await prisma.inventario_Alimento.findMany({
            select: {
                cantidad_disponible_kg: true,
                stock_alerta: true
            }
        });
        const alimentosBajoStock = alimentos.filter(
            a => a.cantidad_disponible_kg <= a.stock_alerta
        ).length;

        const totalInsumos = await prisma.inventario_Insumos.count();
        const insumos = await prisma.inventario_Insumos.findMany({
            select: {
                cantidad_disponible: true,
                stock_alerta: true
            }
        });
        const insumosBajoStock = insumos.filter(
            i => i.cantidad_disponible <= i.stock_alerta
        ).length;

        const totalVacunasInventario = await prisma.inventario_Vacunas.count();
        const vacunas = await prisma.inventario_Vacunas.findMany({
            select: {
                cantidad_disponible: true,
                stock_alerta: true
            }
        });
        const vacunasBajoStock = vacunas.filter(
            v => v.cantidad_disponible <= v.stock_alerta
        ).length;

        // Estadísticas de Usuarios
        const totalUsuarios = await prisma.usuarios.count();
        const usuariosActivos = await prisma.usuarios.count({
            where: { estatus_usuario: 'ACTIVO' }
        });
        const usuariosInactivos = await prisma.usuarios.count({
            where: { estatus_usuario: 'INACTIVO' }
        });

        // Estadísticas de Desparasitaciones
        const totalDesparasitaciones = await prisma.desparasitaciones.count();

        // Estadísticas de Mordeduras
        const totalMordeduras = await prisma.mordeduras.count();

        // Estadísticas de Ingresos y Egresos
        const totalIngresos = await prisma.ingresos_Animales.count();
        const totalEgresos = await prisma.egresos_Animales.count();

        // Estadísticas de Seguimientos de Adopción
        const totalSeguimientosAdopcion = await prisma.seguimientos_Adopciones.count();

        // Estadísticas de Pagos de Servicios
        const totalPagosServicios = await prisma.pagos_Servicios.count();

        // Estadísticas de Movimientos de Inventario
        const totalMovimientosInventario = await prisma.movimientos_Inventario.count();

        return res.status(200).json({
            message: "Estadísticas completas obtenidas exitosamente",
            estadisticas: {
                animales: {
                    total: totalAnimales,
                    adoptables: animalesAdoptables,
                    conPropietario: animalesConPropietario,
                    muertos: animalesMuertos,
                    vivos: animalesVivos,
                    porEspecie: animalesPorEspecie.map(item => ({
                        especie: item.especie || 'Sin especificar',
                        cantidad: item._count.especie
                    }))
                },
                adopciones: {
                    total: totalAdopciones,
                    aprobadas: adopcionesAprobadas,
                    pendientes: adopcionesPendientes,
                    rechazadas: adopcionesRechazadas,
                    canceladas: adopcionesCanceladas
                },
                propietarios: {
                    total: totalPropietarios,
                    activos: propietariosActivos
                },
                vacunaciones: {
                    total: totalVacunaciones,
                    proximasAVencer: vacunacionesProximas
                },
                consultasVeterinarias: {
                    total: totalConsultas,
                    disponiblesAdopcion: consultasDisponiblesAdopcion
                },
                esterilizaciones: {
                    total: totalEsterilizaciones
                },
                cuarentenas: {
                    total: totalCuarentenas,
                    activas: cuarentenasActivas,
                    finalizadas: cuarentenasFinalizadas
                },
                defunciones: {
                    total: totalDefunciones
                },
                cremaciones: {
                    total: totalCremaciones
                },
                reportesCiudadanos: {
                    total: totalReportes,
                    pendientes: reportesPendientes,
                    enProceso: reportesEnProceso,
                    atendidos: reportesAtendidos,
                    cerrados: reportesCerrados
                },
                inventario: {
                    medicamentos: {
                        total: totalMedicamentos,
                        bajoStock: medicamentosBajoStock
                    },
                    alimentos: {
                        total: totalAlimentos,
                        bajoStock: alimentosBajoStock
                    },
                    insumos: {
                        total: totalInsumos,
                        bajoStock: insumosBajoStock
                    },
                    vacunas: {
                        total: totalVacunasInventario,
                        bajoStock: vacunasBajoStock
                    }
                },
                usuarios: {
                    total: totalUsuarios,
                    activos: usuariosActivos,
                    inactivos: usuariosInactivos
                },
                servicios: {
                    desparasitaciones: totalDesparasitaciones,
                    seguimientosAdopcion: totalSeguimientosAdopcion,
                    pagosServicios: totalPagosServicios
                },
                incidentes: {
                    mordeduras: totalMordeduras
                },
                movimientos: {
                    ingresosAnimales: totalIngresos,
                    egresosAnimales: totalEgresos,
                    movimientosInventario: totalMovimientosInventario
                }
            }
        });
    } catch (error) {
        console.error("Error al obtener estadísticas completas:", error);
        return res.status(500).json({
            message: "Ha ocurrido un error al obtener las estadísticas completas",
            error: error.message
        });
    }
};

const getStatisticsCampaigns = async (req, res) => {
    try {
        const [vacunacionesCount, desparasitacionesCount, consultasCount] = await prisma.$transaction([
            // Contar campañas asociadas con vacunaciones
            prisma.campaigns.count({
                where: {
                    Vacunaciones: {
                        some: {} // Verifica si hay alguna vacuna asociada a la campaña
                    }
                }
            }),
            // Contar campañas asociadas con desparasitaciones
            prisma.campaigns.count({
                where: {
                    Desparasitaciones: {
                        some: {} // Verifica si hay alguna desparacitación asociada a la campaña
                    }
                }
            }),
            // Contar campañas asociadas con consultas veterinarias
            prisma.campaigns.count({
                where: {
                    Consultas_Veterinarias: {
                        some: {} // Verifica si hay alguna consulta veterinaria asociada a la campaña
                    }
                }
            })
        ]);

        return res.status(200).json({
            vacunacionesCount,
            desparasitacionesCount,
            consultasCount
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ha ocurrido un error al obtener las estadísticas de las campañas",
            error: error.message
        });
    }
};

export {
    getStatistics,
    getCompleteStatistics,
    getStatisticsCampaigns
}