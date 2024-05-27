let PrendasSeleccionadas = localStorage.getItem("prendas-seleccionadas");
PrendasSeleccionadas = JSON.parse(PrendasSeleccionadas);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorProductosEnCarrito = document.querySelector("#productos-car");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorAgradecimiento = document.querySelector("#agradecimiento");
let botonesEliminar = document.querySelectorAll(".eliminar-producto");
const botonVaciar = document.querySelector("#vaciar-carrito");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#finalizar-compra");

function cargarProductosCarrito() {
    if (PrendasSeleccionadas && PrendasSeleccionadas.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorProductosEnCarrito.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorAgradecimiento.classList.add("disabled");
        contenedorProductosEnCarrito.innerHTML = "";
        PrendasSeleccionadas.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-talla">
                    <small>Talla</small>
                    <p>${producto.talla || "No especificada"}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="eliminar-producto" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
            contenedorProductosEnCarrito.append(div);
        })
        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorProductosEnCarrito.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorAgradecimiento.classList.add("disabled");
    }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".eliminar-producto");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #EDC51E, #474545)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function () {}
    }).showToast();
    const idBoton = e.currentTarget.id;
    const index = PrendasSeleccionadas.findIndex(producto => producto.id === idBoton);
    PrendasSeleccionadas.splice(index, 1);
    cargarProductosCarrito();
    localStorage.setItem("prendas-seleccionadas", JSON.stringify(PrendasSeleccionadas));
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'warning',
        html: `Se van a borrar todos productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            PrendasSeleccionadas.length = 0;
            localStorage.setItem("prendas-seleccionadas", JSON.stringify(PrendasSeleccionadas));
            cargarProductosCarrito();
        }
    })
}

function actualizarTotal() {
    const totalCalculado = PrendasSeleccionadas.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    PrendasSeleccionadas.length = 0;
    localStorage.setItem("prendas-seleccionadas", JSON.stringify(PrendasSeleccionadas));
    contenedorCarritoVacio.classList.add("disabled");
    contenedorProductosEnCarrito.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorAgradecimiento.classList.remove("disabled");
}