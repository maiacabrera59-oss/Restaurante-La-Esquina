const express = require("express");
const router = express.Router();
const {
    obtenerPedidos,
    crearPedido,
    actualizarPedido,
    eliminarPedido
} = require("../controllers/PedidosController");

router.get("/", obtenerPedidos);

router.post("/", crearPedido);

router.put("/:id", actualizarPedido);

router.delete("/:id", eliminarPedido);

module.exports = router;