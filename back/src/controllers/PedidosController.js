const { getConnection, sql } = require("../config/db");

// GET /api/pedidos 
async function obtenerPedidos(req, res) {
    try {
        const pool = await getConnection();

        const resultado = await pool.request().execute("usp_ListarPedidos");

        res.json(resultado.recordset);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los pedidos",
            error: error.message
        });
    }
}

// POST /api/pedidos 
async function crearPedido(req, res) {
    const { idPlato, mesa, cantidad } = req.body;

    try {
        const pool = await getConnection();

        await pool.request()
            .input("IdPlato", sql.Int, idPlato)
            .input("Mesa", sql.Int, mesa)
            .input("Cantidad", sql.Int, cantidad)
            .execute("usp_CrearPedido");

        res.status(201).json({ mensaje: "Pedido creado correctamente" });
    } catch (error) {
        res.status(400).json({
            mensaje: "Error al crear el pedido",
            error: error.message
        });
    }
}

// PUT /api/pedidos/:id -> Modificar cantidad o cambiar estado 
async function actualizarPedido(req, res) {
    const id = Number(req.params.id);
    const { cantidad, estado } = req.body;


    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ mensaje: "El ID ingresado no es válido" });
    }

    try {
        const pool = await getConnection();

        await pool.request()
            .input("IdPedido", sql.Int, id)
            .input("Cantidad", sql.Int, cantidad)
            .input("Estado", sql.NVarChar(20), estado)
            .execute("usp_ActualizarPedido");

        res.json({ mensaje: "Pedido fue actualizado correctamente" });
    } catch (error) {
    
        if (error.message.includes("50002")) {
            return res.status(404).json({ mensaje: "El pedido no existe", error: error.message });
        }

        res.status(400).json({
            mensaje: "No se pudo actualizar el pedido",
            error: error.message
        });
    }
}

// DELETE /api/pedidos/:id 
async function eliminarPedido(req, res) {
    const id = Number(req.params.id);

   
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ mensaje: "El ID ingresado no es válido" });
    }

    try {
        const pool = await getConnection();

        await pool.request()
            .input("IdPedido", sql.Int, id)
            .execute("usp_EliminarPedido");

        res.json({ mensaje: "Pedido fue eliminado correctamente" });
    } catch (error) {
        
        if (error.message.includes("50002")) {
            return res.status(404).json({ mensaje: "El pedido no existe", error: error.message });
        }

        res.status(400).json({
            mensaje: "No se puede eliminar el pedido",
            error: error.message
        });
    }
}

module.exports = {
    obtenerPedidos,
    crearPedido,
    actualizarPedido,
    eliminarPedido
};