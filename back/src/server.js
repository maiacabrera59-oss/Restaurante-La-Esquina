const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

const PedidosRoutes = require("./routes/PedidosRoutes");
const PlatosRoutes= require("./routes/PlatosRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/pedidos", PedidosRoutes);
app.use("/api/platos", PlatosRoutes);


app.get("/", (req, res) => {
    res.send("API Restaurante La Esquina funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});