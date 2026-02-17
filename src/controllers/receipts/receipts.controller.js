import { sql } from 'mssql';

const getVpagosByRecibo = async (req, res) => {
    const { recibo } = req.query; // Recibo enviado como parámetro en la URL

    if (!recibo) {
        return res.status(400).json({
            message: 'Falta el número de recibo en la consulta'
        });
    }

    try {
        // Configuración de conexión a la base de datos
        const config = {
            user: 'ejemplo',
            password: 'ejemplo',
            server: '10.10.250.9', // Dirección del servidor
            database: 'nombre_de_base_de_datos', // Nombre de la base de datos
            options: {
                encrypt: true, // Usar encriptación si es necesario
                trustServerCertificate: true, // Si se necesita confiar en el certificado del servidor
            }
        };

        // Conectar a la base de datos
        await sql.connect(config);

        // Ejecutar la consulta SQL con el número de recibo proporcionado
        const result = await sql.query`SELECT * FROM VPAGOSSERVMED WHERE RECIBO = ${recibo}`;

        // Verificar si se encontraron resultados
        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron datos para el número de recibo proporcionado'
            });
        }

        // Devolver los resultados en formato JSON
        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        return res.status(500).json({
            message: 'Error al consultar la base de datos',
            error: error.message
        });
    }
};

export default getVpagosByRecibo;
