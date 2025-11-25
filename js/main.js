// 1. Array de objetos de productos
const productos = [
    { id: 1, nombre: "Samsung S24 ULTRA", precio: 1200.00, descripcion: "Última generación, cámara 108mp y batería de larga duración.", imagen: "IMG/1500_1500-celular-samsung-galaxy-s24-12.webp" },
    { id: 2, nombre: "Auriculares Bluetooth", precio: 50.00, descripcion: "Sonido envolvente y hasta 24h de batería.", imagen: "IMG/AURICULARES.jpg" },
    { id: 3, nombre: "Cargador Rápido USB-C", precio: 25.00, descripcion: "Cargador de pared de 65W con cable USB-C.", imagen: "IMG/cargador.webp" },
    { id: 4, nombre: "Kit de Repuestos Originales", precio: 150.00, descripcion: "Pantallas, baterías y más con garantía asegurada.", imagen: "IMG/RESPUESTO.png" }
];

// 2. Variables del DOM y del estado
const productosContainer = document.getElementById('productos-container');
const carritoItems = document.getElementById('carrito-items');
const contadorCarrito = document.getElementById('contador-carrito');
const carritoTotal = document.getElementById('carrito-total');
const btnVaciar = document.getElementById('vaciar-carrito');

// Cargar el carrito desde localStorage o inicializar como array vacío
let carrito = JSON.parse(localStorage.getItem('carritoTechStore')) || [];

// Función auxiliar para guardar el carrito en localStorage
const guardarCarrito = () => {
    try {
        localStorage.setItem('carritoTechStore', JSON.stringify(carrito));
    } catch (error) {
        console.error("Error al guardar en localStorage:", error);
    }
};

// 3. Renderizar Productos (DOM)
const renderizarProductos = () => {
    // Si el contenedor principal no existe, esta función no debería ejecutarse (protegida por init)
    productosContainer.innerHTML = ''; // Limpiar el contenedor
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('col-12', 'col-md-6', 'col-lg-3');
        card.innerHTML = `
            <div class="card h-full shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition duration-300">
                <img src="${producto.imagen}" class="card-img-top imgaccesorios" alt="${producto.nombre}" onerror="this.onerror=null; this.src='https://placehold.co/400x200/5e6b7d/white?text=Imagen+No+Disp'">
                <div class="card-body text-center p-4">
                    <h5 class="card-title text-xl font-bold mb-2">${producto.nombre}</h5>
                    <p class="card-text text-sm text-gray-600 mb-3">${producto.descripcion}</p>
                    <p class="text-2xl font-extrabold text-green-600 mb-3">$${producto.precio.toFixed(2)}</p>
                    <button class="btn btn-primary w-full agregar-btn" data-id="${producto.id}">
                        <i class="bi bi-cart-plus"></i> Agregar al Carrito
                    </button>
                </div>
            </div>
        `;
        productosContainer.appendChild(card);
    });

    // Agregar Event Listeners a los botones de 'Agregar al Carrito'
    document.querySelectorAll('.agregar-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const idProducto = parseInt(e.currentTarget.dataset.id);
            agregarAlCarrito(idProducto);
        });
    });
};

// 4. Lógica de Agregar al Carrito (Evento + Lógica)
const agregarAlCarrito = (id) => {
    const productoExistente = carrito.find(p => p.id === id);

    if (productoExistente) {
        // Si existe, incrementa la cantidad
        productoExistente.cantidad++;
    } else {
        // Si no existe, lo agrega al carrito
        const producto = productos.find(p => p.id === id);
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    renderizarCarrito(); // Actualizar la vista del carrito
};

// 5. Renderizar el Carrito (DOM)
const renderizarCarrito = () => {
    // Si el carritoItems no existe, esta función fallará (protegida por init)
    carritoItems.innerHTML = ''; // Limpiar la tabla del modal
    let totalGeneral = 0;

    if (carrito.length === 0) {
        carritoItems.innerHTML = '<tr><td colspan="5" class="text-center text-muted">El carrito está vacío. ¡Agrega productos!</td></tr>';
    } else {
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            totalGeneral += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.nombre}</td>
                <td>$${item.precio.toFixed(2)}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary me-2" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn btn-sm btn-outline-secondary ms-2" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    </div>
                </td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${item.id})">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </td>
            `;
            carritoItems.appendChild(row);
        });
    }

    // Actualizar contador del header y total
    contadorCarrito.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    carritoTotal.textContent = `$${totalGeneral.toFixed(2)}`;
};

// 6. Funciones de Modificación del Carrito (Eventos y Lógica)
window.cambiarCantidad = (id, delta) => {
    const item = carrito.find(p => p.id === id);
    if (!item) return;

    item.cantidad += delta;

    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
    } else {
        guardarCarrito();
        renderizarCarrito();
    }
};

window.eliminarDelCarrito = (id) => {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    renderizarCarrito();
};

const vaciarCarrito = () => {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    // Cerrar el modal (opcional, pero mejora la UX)
    // const modal = bootstrap.Modal.getInstance(document.getElementById('carritoModal'));
    // if (modal) modal.hide(); 
};

// Asignar Event Listener al botón de Vaciar
// LÍNEA 146: Aquí está la comprobación clave. Si el elemento es nulo, no intenta agregar el listener.
if (btnVaciar) {
    btnVaciar.addEventListener('click', vaciarCarrito);
} else {
    // Si no se encuentra el elemento, se imprime un error en la consola, pero la aplicación no falla.
    console.error("Error de DOM: No se encontró el botón con ID 'vaciar-carrito'. Asegúrate de que el HTML tenga el ID correcto.");
}

// 7. Función de Inicialización
const init = () => {
    // Es crucial que estos elementos existan antes de llamar a renderizarProductos/Carrito
    if (!productosContainer || !carritoItems || !contadorCarrito || !carritoTotal) {
         console.error("Error de DOM: Faltan contenedores principales (productos-container, carrito-items, contador-carrito, o carrito-total).");
         return;
    }

    renderizarProductos(); // Renderiza las tarjetas de productos
    renderizarCarrito();   // Carga los datos del carrito de localStorage y actualiza el contador

    // Opcional: inicializar animaciones si se usan AOS/GSAP
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }
};

// Iniciar la aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', init);