// /api/charts.js

import oracledb from 'oracledb';
// 💡 Consejo: Es una buena práctica poner los detalles de tu conexión
// en un archivo separado (ej: /config/db-config.js) para no repetirlos.
import { dbConfig } from '../../config/db-config'; // Asumiendo que creas este archivo

// Para evitar errores en Vercel, es importante indicar la ruta del Oracle Client
// Si no lo has hecho, créa una carpeta 'instantclient' en tu proyecto.
// oracledb.initOracleClient({ libDir: 'instantclient' });

export default async function handler(req, res) {
    // Capturamos el tipo de gráfico que pide el frontend desde la URL
    // Ejemplo: /api/charts?type=ingresosPorMes
    const { type } = req.query;

    let connection;
    let query;

    // Decidimos qué consulta SQL ejecutar basándonos en el 'type'
    switch (type) {
        case 'ingresosPorMes':
            query = `
        SELECT 
          TO_CHAR(FECHA_INGRESO, 'YYYY-MM') AS label, 
          COUNT(ID_INGRESO) AS value
        FROM INGRESOS
        GROUP BY TO_CHAR(FECHA_INGRESO, 'YYYY-MM')
        ORDER BY label ASC
      `;
            break;

        case 'diagnosticosComunes':
            query = `
        SELECT 
          d.DESCRIPCION AS label, 
          COUNT(i.ID_INGRESO) AS value
        FROM INGRESOS i
        JOIN DIAGNOSTICOS d ON i.ID_DIAGNOSTICO = d.ID_DIAGNOSTICO
        GROUP BY d.DESCRIPCION
        ORDER BY value DESC
        FETCH FIRST 5 ROWS ONLY
      `;
            break;

        // Aquí puedes añadir más 'case' para futuros gráficos
        default:
            return res.status(400).json({ error: 'Tipo de gráfico no especificado o no válido' });
    }

    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(query);

        // Formateamos los datos para que Chart.js los entienda directamente
        const labels = result.rows.map(row => row[0]);
        const data = result.rows.map(row => row[1]);

        res.status(200).json({ labels, datasets: [{ data }] });

    } catch (err) {
        console.error('Error en la API de gráficos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
}