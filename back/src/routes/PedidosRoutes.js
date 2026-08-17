const express = require("express");
const router = express.Router();
const {
    obtenerPedidos,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
    obtenerTotalPorMesa,
    retrocederEstadoPedido
} = require("../controllers/PedidosController");

router.get("/", obtenerPedidos);

router.post("/", crearPedido);

router.put("/:id", actualizarPedido);

router.delete("/:id", eliminarPedido);

router.get('/total-mesa/:mesa', obtenerTotalPorMesa);

router.put('/retroceder/:id', retrocederEstadoPedido);

module.exports = router;