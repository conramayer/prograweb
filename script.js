let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(producto => producto.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }

    console.log(`${nombre} ha sido agregado al carrito.`);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function actualizarCarrito() {
    const carritoLink = document.getElementById('carrito');
    const totalItems = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    carritoLink.textContent = `Carrito (${totalItems})`;
}

function aumentarCantidad(nombre) {
    const producto = carrito.find(producto => producto.nombre === nombre);
    if (producto) {
        producto.cantidad++;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
}

function disminuirCantidad(nombre) {
    const producto = carrito.find(producto => producto.nombre === nombre);
    if (producto && producto.cantidad > 1) {
        producto.cantidad--;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    } else if (producto && producto.cantidad === 1) {
        eliminarProducto(nombre);
    }
}

function eliminarProducto(nombre) {
    carrito = carrito.filter(producto => producto.nombre !== nombre);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    
    localStorage.removeItem('carrito');
    document.getElementById('lista-carrito').innerHTML = '';
    document.getElementById('resumen-productos').innerHTML = '';
    
    document.getElementById('total-compra').textContent = '0';
    
    actualizarCarrito();
 
    mostrarCarrito();

    alert('El carrito ha sido vaciado');
}

function mostrarCarrito() {
    let listaCarrito = document.getElementById('lista-carrito');
    let resumenProductos = document.getElementById('resumen-productos');
    let totalSpan = document.getElementById('total-compra');
    listaCarrito.innerHTML = '';
    resumenProductos.innerHTML = '';
    
    let total = 0;

    carrito.forEach(producto => {
        let subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        
        let resumenItem = document.createElement('div');
        resumenItem.className = 'item-carrito';
        resumenItem.innerHTML = `
            <div class="producto-info">
                ${producto.nombre} 
                <div class="controles-cantidad">
                    <button onclick="disminuirCantidad('${producto.nombre}')">-</button>
                    <span>${producto.cantidad}</span>
                    <button onclick="aumentarCantidad('${producto.nombre}')">+</button>
                </div>
                = $${subtotal}
            </div>
        `;
        resumenProductos.appendChild(resumenItem);
    });

    totalSpan.textContent = total;

    if (carrito.length === 0) {
        listaCarrito.textContent = 'El carrito está vacío.';
        resumenProductos.innerHTML = '<p>No hay productos en el carrito</p>';
        document.getElementById('btn-finalizar').style.display = 'none'; 
    } else {
        document.getElementById('btn-finalizar').style.display = 'block';
    }
}

const enlaces = document.querySelectorAll('nav ul li a');

const urlActual = window.location.href;

enlaces.forEach(enlace => {
    if (urlActual.includes(enlace.href)) {
        enlace.classList.add('active');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
    if (window.location.href.includes('carrito.html')) {
        mostrarCarrito()
    }
});

function mostrarFormularioPago() {
    const formulario = document.getElementById('formulario-pago');
    formulario.style.display = 'block';
}

function procesarPago(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const dni = document.getElementById('dni').value;
    const tarjeta = document.getElementById('tarjeta').value;
    const codigoSeguridad = document.getElementById('codigo-seguridad').value;
    const direccion = document.getElementById('direccion').value;
    const total = document.getElementById('total-compra').textContent;


    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        alert('Por favor, ingrese un nombre válido (solo letras)');
        return;
    }

    if (!/^[0-9]{7,8}$/.test(dni)) {
        alert('Por favor, ingrese un DNI válido (7 u 8 números)');
        return;
    }

    if (!/^[0-9]{16}$/.test(tarjeta)) {
        alert('Por favor, ingrese un número de tarjeta válido (16 números)');
        return;
    }

    if (!/^[0-9]{3}$/.test(codigoSeguridad)) {
        alert('Por favor, ingrese un código de seguridad válido (3 números)');
        return;
    }

    alert(`Compra realizada con éxito!\n
        Total: $${total}\n
        Nombre: ${nombre}\n
        Envío a: ${direccion}`);
    
    localStorage.removeItem('carrito');
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('dni').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 8);
    });

    document.getElementById('tarjeta').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 16);
    });

    document.getElementById('codigo-seguridad').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 3);
    });

    document.getElementById('nombre').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ\s]/g, '');
    });
});