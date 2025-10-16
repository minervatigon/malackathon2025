// En /api/kpis.js
// (Necesitarás instalar el driver de node-oracledb)

import oracledb from 'oracledb';
// ... (aquí iría tu configuración de conexión a la BD)

export default async function handler(req, res) {
    let connection;
    try {
        // ... (código para conectar a Oracle)

        const totalIngresos = await connection.execute(`SELECT COUNT(*) FROM INGRESOS`);
        const pacientesUnicos = await connection.execute(`SELECT COUNT(DISTINCT ID_PACIENTE) FROM PACIENTES`);
        const diagnosticoComun = await connection.execute(`
      SELECT d.DESCRIPCION
      FROM INGRESOS i
      JOIN DIAGNOSTICOS d ON i.ID_DIAGNOSTICO = d.ID_DIAGNOSTICO
      GROUP BY d.DESCRIPCION
      ORDER BY COUNT(*) DESC
      FETCH FIRST 1 ROWS ONLY
    `);

        // ... y la cuarta métrica que defináis.

        res.status(200).json({
            totalIngresos: totalIngresos.rows[0][0],
            pacientesUnicos: pacientesUnicos.rows[0][0],
            diagnosticoComun: diagnosticoComun.rows[0][0],
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
    } finally {
        if (connection) {
            // ... (código para cerrar la conexión)
        }
    }
}