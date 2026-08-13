const { getConnection } = require("../config/db");

async function obtenerPlatos(req, res) {
    try {
        const pool = await getConnection();
        const resultado = await pool.request().execute("usp_ListarPlatos");
        res.json(resultado.recordset);
    } catch (error) {
        console.error("DETALLE DEL ERROR:", error); // <-- Agregá esto
        res.status(500).json({
            mensaje: "Error al obtener los platos",
            error: error.message
        });
    }
}

module.exports = {
    obtenerPlatos
};