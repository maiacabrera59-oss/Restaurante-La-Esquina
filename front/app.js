// =====================================================
// CONFIGURACIÓN
// =====================================================

const API_URL = "http://localhost:3000/api";


// =====================================================
// ELEMENTOS DEL HTML
// =====================================================

const formulario = document.getElementById("form-pedido");

const inputMesa = document.getElementById("mesa");

const selectPlato = document.getElementById("idPlato");

const inputCantidad = document.getElementById("cantidad");

const listaPedidos = document.getElementById("lista-pedidos");

const btnTodos = document.getElementById("btn-todos");

const btnEnCurso = document.getElementById("btn-en-curso");


// =====================================================
// FILTRO ACTUAL
// =====================================================

let filtroActual = "todos";


// =====================================================
// AL CARGAR LA PÁGINA
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    cargarPlatos();

    cargarPedidos();

});


// =====================================================
// CARGAR PLATOS
// GET /api/platos
// =====================================================

async function cargarPlatos() {

    try {

        const respuesta = await fetch(`${API_URL}/platos`);

        if (!respuesta.ok) {

            throw new Error("No se pudieron cargar los platos.");

        }

        const platos = await respuesta.json();


        // Limpiar el combo

        selectPlato.innerHTML = `
            <option value="" disabled selected>
                Seleccione un plato
            </option>
        `;


        // Agregar platos

        platos.forEach(plato => {

            const option = document.createElement("option");

            option.value = plato.idPlato;

            option.textContent =
                `${plato.nombre} - ${formatearPesos(plato.precio)}`;

            selectPlato.appendChild(option);

        });

    } catch (error) {

        console.error("Error al cargar platos:", error);

        selectPlato.innerHTML = `
            <option value="">
                Error al cargar los platos
            </option>
        `;

    }

}


// =====================================================
// CARGAR PEDIDOS
// GET /api/pedidos
// =====================================================

async function cargarPedidos() {

    try {

        const respuesta = await fetch(`${API_URL}/pedidos`);

        if (!respuesta.ok) {

            throw new Error("No se pudieron cargar los pedidos.");

        }

        const pedidos = await respuesta.json();

        mostrarPedidos(pedidos);

    } catch (error) {

        console.error("Error al cargar pedidos:", error);

        listaPedidos.innerHTML = `
            <div class="sin-pedidos">

                <p>
                    No se pudieron cargar los pedidos.
                </p>

            </div>
        `;

    }

}


// =====================================================
// MOSTRAR PEDIDOS
// =====================================================

function mostrarPedidos(pedidos) {

    listaPedidos.innerHTML = "";


    // =================================================
    // FILTRO "EN CURSO"
    // Oculta los entregados
    // =================================================

    if (filtroActual === "en-curso") {

        pedidos = pedidos.filter(pedido =>
            pedido.estado !== "Entregado"
        );

    }


    // =================================================
    // SI NO HAY PEDIDOS
    // =================================================

    if (pedidos.length === 0) {

        listaPedidos.innerHTML = `
            <div class="sin-pedidos">

                <p>
                    No hay pedidos para mostrar.
                </p>

            </div>
        `;

        return;

    }


    // =================================================
    // CREAR TARJETAS
    // =================================================

    pedidos.forEach(pedido => {

        const tarjeta = crearTarjetaPedido(pedido);

        listaPedidos.appendChild(tarjeta);

    });

}


// =====================================================
// CREAR TARJETA DE PEDIDO
// =====================================================

function crearTarjetaPedido(pedido) {

    const tarjeta = document.createElement("div");

    tarjeta.classList.add("pedido-card");


    // Si está entregado agregamos clase especial

    if (pedido.estado === "Entregado") {

        tarjeta.classList.add("entregado");

    }


    // =================================================
    // CLASE DEL CHIP DE ESTADO
    // =================================================

    let claseEstado = "";


    if (pedido.estado === "Pendiente") {

        claseEstado = "estado-pendiente";

    }

    else if (pedido.estado === "En preparación") {

        claseEstado = "estado-preparacion";

    }

    else if (pedido.estado === "Entregado") {

        claseEstado = "estado-entregado";

    }


    // =================================================
    // ACCIONES
    // =================================================

    let accionesHTML = "";


    // =================================================
    // PEDIDO PENDIENTE
    // =================================================

    if (pedido.estado === "Pendiente") {

        accionesHTML = `

            <div class="acciones">

                <input
                    type="number"
                    min="1"
                    value="${pedido.cantidad}"
                    id="cantidad-${pedido.idPedido}"
                >

                <button
                    class="guardar"
                    onclick="guardarPedido(${pedido.idPedido})"
                >
                    Guardar
                </button>

                <button
                    class="avanzar"
                    onclick="avanzarPedido(${pedido.idPedido})"
                >
                    Avanzar
                </button>

                <button
                    class="cancelar"
                    onclick="cancelarPedido(${pedido.idPedido})"
                >
                    Cancelar
                </button>

            </div>

        `;

    }


    // =================================================
    // PEDIDO EN PREPARACIÓN
    // =================================================

    else if (pedido.estado === "En preparación") {

        accionesHTML = `

            <div class="acciones">

                <input
                    type="number"
                    min="1"
                    value="${pedido.cantidad}"
                    id="cantidad-${pedido.idPedido}"
                >

                <button
                    class="guardar"
                    onclick="guardarPedido(${pedido.idPedido})"
                >
                    Guardar
                </button>

                <button
                    class="avanzar"
                    onclick="avanzarPedido(${pedido.idPedido})"
                >
                    Avanzar
                </button>

            </div>

        `;

    }


    // =================================================
    // ENTREGADO
    // =================================================
    
    // No agregamos botones.
    // La consigna dice que un entregado
    // no puede modificarse.


    // =================================================
    // HTML DE LA TARJETA
    // =================================================

    tarjeta.innerHTML = `

        <h3>
            Pedido #${pedido.idPedido}
        </h3>

        <p>
            <strong>Mesa:</strong>
            ${pedido.mesa}
        </p>

        <p>
            <strong>Plato:</strong>
            ${pedido.plato}
        </p>

        <p>
            <strong>Precio unitario:</strong>
            ${formatearPesos(pedido.precioUnitario)}
        </p>

        <p>
            <strong>Cantidad:</strong>
            ${pedido.cantidad}
        </p>

        <span class="estado ${claseEstado}">
            ${pedido.estado}
        </span>

        <p class="importe">
            Importe:
            ${formatearPesos(pedido.importe)}
        </p>

        ${accionesHTML}

    `;


    return tarjeta;

}


// =====================================================
// CREAR PEDIDO
// POST /api/pedidos
// =====================================================

formulario.addEventListener("submit", async function (event) {

    event.preventDefault();


    // Obtener valores

    const mesa = Number(inputMesa.value);

    const idPlato = Number(selectPlato.value);

    const cantidad = Number(inputCantidad.value);


    // =================================================
    // VALIDACIONES
    // =================================================

    if (!Number.isInteger(mesa) || mesa <= 0) {

        alert("La mesa debe ser un número positivo.");

        return;

    }


    if (!Number.isInteger(idPlato) || idPlato <= 0) {

        alert("Seleccione un plato.");

        return;

    }


    if (!Number.isInteger(cantidad) || cantidad <= 0) {

        alert("La cantidad debe ser mayor que cero.");

        return;

    }


    // =================================================
    // ENVIAR PEDIDO
    // =================================================

    try {

        const respuesta = await fetch(`${API_URL}/pedidos`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                mesa: mesa,

                idPlato: idPlato,

                cantidad: cantidad

            })

        });


        const datos = await respuesta.json();


        // Error

        if (!respuesta.ok) {

            alert(
                datos.mensaje ||
                datos.error ||
                "No se pudo crear el pedido."
            );

            return;

        }


        // Éxito

        alert("Pedido tomado correctamente.");


        // Limpiar formulario

        formulario.reset();

        inputCantidad.value = 1;


        // Actualizar lista

        cargarPedidos();

    } catch (error) {

        console.error(error);

        alert("Error de conexión con el servidor.");

    }

});


// =====================================================
// GUARDAR CAMBIO DE CANTIDAD
// PUT /api/pedidos/:id
// =====================================================

async function guardarPedido(idPedido) {

    const input = document.getElementById(
        `cantidad-${idPedido}`
    );


    const cantidad = Number(input.value);


    // Validación

    if (!Number.isInteger(cantidad) || cantidad <= 0) {

        alert("La cantidad debe ser mayor que cero.");

        return;

    }


    try {

        // Obtener pedido actual

        const respuestaPedidos =
            await fetch(`${API_URL}/pedidos`);


        if (!respuestaPedidos.ok) {

            throw new Error(
                "No se pudieron obtener los pedidos."
            );

        }


        const pedidos = await respuestaPedidos.json();


        const pedido = pedidos.find(
            p => p.idPedido === idPedido
        );


        if (!pedido) {

            alert("El pedido no existe.");

            return;

        }


        // =================================================
        // PUT
        // =================================================

        const respuesta = await fetch(
            `${API_URL}/pedidos/${idPedido}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    cantidad: cantidad,

                    estado: pedido.estado

                })

            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            alert(
                datos.mensaje ||
                datos.error ||
                "No se pudo modificar el pedido."
            );

            return;

        }


        alert("Cantidad actualizada correctamente.");

        cargarPedidos();


    } catch (error) {

        console.error(error);

        alert("Error de conexión con el servidor.");

    }

}


// =====================================================
// AVANZAR ESTADO
// PUT /api/pedidos/:id
// =====================================================

async function avanzarPedido(idPedido) {

    try {

        // Obtener pedidos actuales

        const respuestaPedidos =
            await fetch(`${API_URL}/pedidos`);


        if (!respuestaPedidos.ok) {

            throw new Error(
                "No se pudieron obtener los pedidos."
            );

        }


        const pedidos = await respuestaPedidos.json();


        const pedido = pedidos.find(
            p => p.idPedido === idPedido
        );


        if (!pedido) {

            alert("El pedido no existe.");

            return;

        }


        // =================================================
        // DETERMINAR SIGUIENTE ESTADO
        // =================================================

        let nuevoEstado;


        if (pedido.estado === "Pendiente") {

            nuevoEstado = "En preparación";

        }

        else if (pedido.estado === "En preparación") {

            nuevoEstado = "Entregado";

        }

        else {

            alert(
                "Un pedido entregado no puede avanzar."
            );

            return;

        }


        // =================================================
        // ACTUALIZAR
        // =================================================

        const respuesta = await fetch(
            `${API_URL}/pedidos/${idPedido}`,
            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    cantidad: pedido.cantidad,

                    estado: nuevoEstado

                })

            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            alert(
                datos.mensaje ||
                datos.error ||
                "No se pudo avanzar el pedido."
            );

            return;

        }


        cargarPedidos();


    } catch (error) {

        console.error(error);

        alert("Error de conexión con el servidor.");

    }

}


// =====================================================
// CANCELAR PEDIDO
// DELETE /api/pedidos/:id
// =====================================================

async function cancelarPedido(idPedido) {


    // =================================================
    // CONFIRMACIÓN
    // =================================================

    const confirmar = confirm(
        "¿Está seguro de que desea cancelar este pedido?"
    );


    if (!confirmar) {

        return;

    }


    try {

        const respuesta = await fetch(
            `${API_URL}/pedidos/${idPedido}`,
            {

                method: "DELETE"

            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            alert(
                datos.mensaje ||
                datos.error ||
                "No se pudo cancelar el pedido."
            );

            return;

        }


        alert("Pedido cancelado correctamente.");


        cargarPedidos();


    } catch (error) {

        console.error(error);

        alert("Error de conexión con el servidor.");

    }

}


// =====================================================
// FILTRO: TODOS
// =====================================================

btnTodos.addEventListener("click", () => {

    filtroActual = "todos";

    cargarPedidos();

});


// =====================================================
// FILTRO: EN CURSO
// =====================================================

btnEnCurso.addEventListener("click", () => {

    filtroActual = "en-curso";

    cargarPedidos();

});


// =====================================================
// FORMATO DE PESOS ARGENTINOS
// =====================================================

function formatearPesos(valor) {

    return new Intl.NumberFormat(
        "es-AR",
        {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2
        }
    ).format(Number(valor));

}