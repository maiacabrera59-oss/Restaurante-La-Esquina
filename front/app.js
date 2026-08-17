
const API_URL = "http://localhost:3000/api";

const formulario = document.getElementById("form-pedido");

const inputMesa = document.getElementById("mesa");

const selectPlato = document.getElementById("idPlato");

const inputCantidad = document.getElementById("cantidad");

const listaPedidos = document.getElementById("lista-pedidos");

const btnTodos = document.getElementById("btn-todos");

const btnEnCurso = document.getElementById("btn-en-curso");

const btnConsultarCuenta = document.getElementById("btn-consultar-cuenta");

const inputMesaCuenta = document.getElementById("mesa-cuenta");

const divResultadoCuenta = document.getElementById("resultado-cuenta");



let filtroActual = "todos";



document.addEventListener("DOMContentLoaded", () => {

    cargarPlatos();

    cargarPedidos();

    if (btnConsultarCuenta) {
        btnConsultarCuenta.addEventListener("click", consultarTotalMesa);
    }

});




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




function mostrarPedidos(pedidos) {

    listaPedidos.innerHTML = "";


    if (filtroActual === "en-curso") {

        pedidos = pedidos.filter(pedido =>
            pedido.estado !== "Entregado"
        );

    }



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

    pedidos.forEach(pedido => {

        const tarjeta = crearTarjetaPedido(pedido);

        listaPedidos.appendChild(tarjeta);

    });

}



function crearTarjetaPedido(pedido) {

    const tarjeta = document.createElement("div");

    tarjeta.classList.add("pedido-card");


    // Si está entregado agregamos clase especial

    if (pedido.estado === "Entregado") {

        tarjeta.classList.add("entregado");
    }

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

    let accionesHTML = "";


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
                    class="volver"
                    onclick="retrocederPedido(${pedido.idPedido})"
                >
                    ◀ Volver
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


formulario.addEventListener("submit", async function (event) {

    event.preventDefault();


    // Obtener valores

    const mesa = Number(inputMesa.value);

    const idPlato = Number(selectPlato.value);

    const cantidad = Number(inputCantidad.value);


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

        if (!respuesta.ok) {

            alert(
                datos.mensaje ||
                datos.error ||
                "No se pudo crear el pedido."
            );

            return;

        }

        alert("Pedido tomado correctamente.");


        formulario.reset();

        inputCantidad.value = 1;



        cargarPedidos();

    } catch (error) {

        console.error(error);

        alert("Error de conexión con el servidor.");

    }

});

async function guardarPedido(idPedido) {

    const input = document.getElementById(
        `cantidad-${idPedido}`
    );


    const cantidad = Number(input.value);


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

async function retrocederPedido(idPedido) {

    try {

        const respuesta = await fetch(
            `${API_URL}/pedidos/retroceder/${idPedido}`,
            {
                method: "PUT"
            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok) {

            alert(
                datos.mensaje ||
                datos.error ||
                "No se pudo retroceder el estado del pedido."
            );

            return;

        }


        cargarPedidos();


    } catch (error) {

        console.error("Error al retroceder pedido:", error);

        alert("Error de conexión con el servidor.");

    }

}



async function avanzarPedido(idPedido) {

    try {


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



async function cancelarPedido(idPedido) {

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



async function consultarTotalMesa() {

    const mesa = Number(inputMesaCuenta.value);


    if (!Number.isInteger(mesa) || mesa <= 0) {

        alert("Ingrese un número de mesa válido.");

        return;

    }


    try {

        const respuesta = await fetch(
            `${API_URL}/pedidos/total-mesa/${mesa}`
        );

        const datos = await respuesta.json();


        if (!respuesta.ok) {

            alert(
                datos.mensaje ||
                datos.error ||
                "No se pudo consultar la cuenta."
            );

            return;

        }


        divResultadoCuenta.innerHTML = `
            <div class="resumen-cuenta" style="padding: 10px; background-color: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 5px;">
                <p style="margin: 0; font-size: 1.1rem; font-weight: bold; color: #2e7d32;">
                    Total acumulado Mesa ${datos.mesa}: ${formatearPesos(datos.total)}
                </p>
            </div>
        `;


    } catch (error) {

        console.error("Error al obtener la cuenta:", error);

        alert("Error de conexión con el servidor.");

    }

}


// FILTRO: TODOS

btnTodos.addEventListener("click", () => {

    filtroActual = "todos";

    cargarPedidos();

});


// FILTRO: EN CURSO

btnEnCurso.addEventListener("click", () => {

    filtroActual = "en-curso";

    cargarPedidos();

});


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