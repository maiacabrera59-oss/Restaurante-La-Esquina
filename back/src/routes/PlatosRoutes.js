const express = require("express");
const router = express.Router();
const { obtenerPlatos } = require("../controllers/PlatosController");


router.get("/", obtenerPlatos);

module.exports = router;