let productos = [];

fetch("./javascript/prendas.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    });

const contenedorProductos = document.querySelector("#prendas-container");
const botonesCategorias = document.querySelectorAll(".boton-prenda");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".agregar-prenda");
const contador = document.querySelector("#contador");

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <select class="producto-talla">
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                </select>
                <button class="agregar-prenda" id="${producto.id}">Seleccionar</button>
            </div>
        `;
        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar();
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".agregar-prenda");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let PrendasSeleccionadas;

let PrendasSeleccionadasLS = localStorage.getItem("prendas-seleccionadas");

if (PrendasSeleccionadasLS) {
    PrendasSeleccionadas = JSON.parse(PrendasSeleccionadasLS);
    actualizarcontador();
} else {
    PrendasSeleccionadas = [];
}

function agregarAlCarrito(e) {
    Toastify({
        text: "Producto agregado",
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
        onClick: function(){} 
      }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);
    const talleSeleccionado = e.currentTarget.parentElement.querySelector(".producto-talla").value;

    if(PrendasSeleccionadas.some(producto => producto.id === idBoton && producto.talla === talleSeleccionado)) {
        const index = PrendasSeleccionadas.findIndex(producto => producto.id === idBoton && producto.talla === talleSeleccionado);
        PrendasSeleccionadas[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productoAgregado.talla = talleSeleccionado;
        PrendasSeleccionadas.push(productoAgregado);
    }

    actualizarcontador();
    localStorage.setItem("prendas-seleccionadas", JSON.stringify(PrendasSeleccionadas));
}

function actualizarcontador() {
    let nuevocontador = PrendasSeleccionadas.reduce((acc, producto) => acc + producto.cantidad, 0);
    contador.innerText = nuevocontador;
}