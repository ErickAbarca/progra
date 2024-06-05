    // Selecting the sidebar and buttons
    const sidebar = document.querySelector(".sidebar");
    const sidebarOpenBtn = document.querySelector("#sidebar-open");
    const sidebarCloseBtn = document.querySelector("#sidebar-close");
    const sidebarLockBtn = document.querySelector("#lock-icon");
    
    // Function to toggle the lock state of the sidebar
    const toggleLock = () => {
      sidebar.classList.toggle("locked");
      // If the sidebar is not locked
      if (!sidebar.classList.contains("locked")) {
        sidebar.classList.add("hoverable");
        sidebarLockBtn.classList.replace("bx-lock-alt", "bx-lock-open-alt");
      } else {
        sidebar.classList.remove("hoverable");
        sidebarLockBtn.classList.replace("bx-lock-open-alt", "bx-lock-alt");
      }
    };
    
    // Function to hide the sidebar when the mouse leaves
    const hideSidebar = () => {
      if (sidebar.classList.contains("hoverable")) {
        sidebar.classList.add("close");
      }
    };
    
    // Function to show the sidebar when the mouse enter
    const showSidebar = () => {
      if (sidebar.classList.contains("hoverable")) {
        sidebar.classList.remove("close");
      }
    };
    
    // Function to show and hide the sidebar
    const toggleSidebar = () => {
      sidebar.classList.toggle("close");
    };
    
    // If the window width is less than 800px, close the sidebar and remove hoverability and lock
    if (window.innerWidth < 800) {
      sidebar.classList.add("close");
      sidebar.classList.remove("locked");
      sidebar.classList.remove("hoverable");
    }
    

  // codigo propio

let activo = 'vehiculos';

  function toggleActive(event) {
    event.preventDefault();
    const links = document.querySelectorAll('.link');
    links.forEach(link => {
        link.classList.remove('active');
    });
    const clickedLink = event.currentTarget;
    clickedLink.classList.add('active');
}

  
  function mostarTablas(event) {
    event.preventDefault();
    const tablas = document.querySelectorAll('.tabla');
    tablas.forEach(tabla => {
        tabla.classList.add('ocultarTabla');
    });

    const clickedLink = event.currentTarget;
    const id = clickedLink.getAttribute('href');
    opciones = [];
    if (id === 'tabla-vehiculos') {
        opciones = ['Placa','Marca', 'Modelo', 'Año', 'Transmisión', 'Estilo'];
        document.getElementById('boton_anadir').setAttribute('onclick', 'mostrarInsertarVehiculo()');
        activo = 'vehiculos';
    } else if (id === 'tabla-repuestos') {
        opciones = ['Nombre', 'Marca', 'Modelo', 'Año', 'Cantidad'];
        document.getElementById('boton_anadir').setAttribute('onclick', 'mostrarInsertarRepuesto()');
        activo = 'repuestos';
    } else if (id === 'tabla-pedidos') {
        opciones = ['Nombre', 'Dirección', 'Correo', 'Fecha'];
        document.getElementById('boton_anadir').href = '/api/pedidos/insertar';
        activo = 'pedidos';
    } else if (id === 'tabla-clientes') {
        opciones = ['Nombre', 'Dirección', 'Email'];
        document.getElementById('boton_anadir').setAttribute('onclick', 'mostrarInsertarCliente()');
        activo = 'clientes';
    }


    const filtro = document.getElementById('filtros');
        filtro.innerHTML = '';
        opciones.forEach(opcion => {
          const op =  document.createElement('option');
          op.value = opcion;
          op.textContent = opcion;
          filtro.appendChild(op);
        });

    const tablax = document.querySelector('.'+id);
    tablax.classList.remove('ocultarTabla');
  }
  function cargarVehiculos() {
    url = 'http://127.0.0.1:5000/api/vehiculos';
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener el archivo JSON');
      }

      return response.json();
    })
    .then(data => {
      const tabla = document.getElementById('vehiculosLista');
      tabla.innerHTML = '';
      data.forEach(vehiculo => {
        const fila = document.createElement('tr');
        const placa = document.createElement('td');
        placa.textContent = vehiculo.placa;
        fila.appendChild(placa);
        const marca = document.createElement('td');
        marca.textContent = vehiculo.marca;
        fila.appendChild(marca);
        const modelo = document.createElement('td');
        modelo.textContent = vehiculo.modelo;
        fila.appendChild(modelo);
        const anio = document.createElement('td');
        anio.textContent = vehiculo.anio;
        fila.appendChild(anio);
        const trans = document.createElement('td');
        trans.textContent = vehiculo.trans;
        fila.appendChild(trans);
        const estilo = document.createElement('td');
        estilo.textContent = vehiculo.estilo;
        fila.appendChild(estilo);
        
        const opciones = document.createElement('td');
        opciones.className = 'opcionesContainer';
    
        const boton3 = document.createElement('button');
        boton3.appendChild(document.createElement('i')).className = 'bx bx-detail boton';
        boton3.addEventListener('click', function() {
          const mostrado = document.querySelector('.opcionesVehiculo');
          mostrado.style.display = 'grid';
          document.getElementById('selPlacaV').value=vehiculo.placa;
          document.getElementById('selMarcaV').value=vehiculo.marca;
          document.getElementById('selModeloV').value=vehiculo.modelo;
          document.getElementById('selAnioV').value=vehiculo.anio;
          document.getElementById('selTrans').value=vehiculo.trans;
          document.getElementById('selEstilo').value=vehiculo.estilo;
          document.getElementById('selPlacaV').disabled=true;
          document.getElementById('selColor').value=vehiculo.color;
          document.getElementById('selCombustible').value=vehiculo.combustible;
          document.getElementById('selCilindrada').value=vehiculo.cilindrada;
          document.getElementById('selPasajeros').value=vehiculo.pasajeros;
          document.getElementById('selPuertas').value=vehiculo.puertas;
          document.getElementById('selEstado').value=vehiculo.estado;
        });
        opciones.appendChild(boton3);

        fila.appendChild(opciones);

    
        tabla.appendChild(fila);
      });
      
    });
  }

  function cargarRepuestos() {
    url = 'http://127.0.0.1:5000/api/repuestos';
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener el archivo JSON');
      }

      return response.json();
    })
    .then(data => {
      const tabla = document.getElementById('repuestosLista');
      tabla.innerHTML = '';
      data.forEach(repuesto => {
        const fila = document.createElement('tr');
        const nombre = document.createElement('td');
        nombre.textContent = repuesto.nombre;
        fila.appendChild(nombre);
        const marca = document.createElement('td');
        marca.textContent = repuesto.marca;
        fila.appendChild(marca);
        const modelo = document.createElement('td');
        modelo.textContent = repuesto.modelo;
        fila.appendChild(modelo);
        const anio = document.createElement('td');
        anio.textContent = repuesto.anio;
        fila.appendChild(anio);
        const cantidad = document.createElement('td');
        cantidad.textContent = repuesto.cantidad;
        fila.appendChild(cantidad);
        
        const opciones = document.createElement('td');
        opciones.className = 'opcionesContainer';
    
        const boton3 = document.createElement('button');
        boton3.appendChild(document.createElement('i')).className = 'bx bx-detail boton';
        boton3.addEventListener('click', function() {
          const mostrado = document.querySelector('.opcionesRepuesto');
          mostrado.style.display = 'grid';
          document.getElementById('selCodigoR').value=repuesto.codigo;
          document.getElementById('selNombreR').value=repuesto.nombre;
          document.getElementById('selMarcaR').value=repuesto.marca;
          document.getElementById('selModeloR').value=repuesto.modelo;
          document.getElementById('selAnioR').value=repuesto.anio;
          document.getElementById('selCodigoR').disabled=true;
          document.getElementById('selCantidadR').value=repuesto.cantidad;
        });
        opciones.appendChild(boton3);
        fila.appendChild(opciones);
        tabla.appendChild(fila);
      });
      
    });
  }

  function cargarClientes() {
    url = 'http://127.0.0.1:5000/api/clientes';
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener el archivo JSON');
      }

      return response.json();
    })
    .then(data => {
      const tabla = document.getElementById('clientesLista');
      tabla.innerHTML = '';
      data.forEach(cliente => {
        const fila = document.createElement('tr');
        const nombre = document.createElement('td');
        nombre.textContent = cliente.nombre;
        fila.appendChild(nombre);
        const direccion = document.createElement('td');
        direccion.textContent = cliente.correo;
        fila.appendChild(direccion);
        const email = document.createElement('td');
        email.textContent = cliente.direccion;
        fila.appendChild(email);
        
        const opciones = document.createElement('td');
        opciones.className = 'opcionesContainer';
    
        const boton3 = document.createElement('button');
        boton3.appendChild(document.createElement('i')).className = 'bx bx-detail boton';
        boton3.addEventListener('click', function() {
          const mostrado = document.querySelector('.opcionesCliente');
          mostrado.style.display = 'grid';
          document.getElementById('idC').value=cliente.id;
          document.getElementById('selNombreC').value=cliente.nombre;
          document.getElementById('selDireccionC').value=cliente.direccion;
          document.getElementById('selCorreoC').value=cliente.correo;
          document.getElementById('idC').disabled=true;
        });
        opciones.appendChild(boton3);
        fila.appendChild(opciones);
        tabla.appendChild(fila);
      });
      
    });
  }

  function modificarVehiculo(){
    const placa = document.getElementById('selPlacaV').value;
    const marca = document.getElementById('selMarcaV').value;
    const modelo = document.getElementById('selModeloV').value;
    const anio = document.getElementById('selAnioV').value;
    const trans = document.getElementById('selTrans').value;
    const estilo = document.getElementById('selEstilo').value;
    const color = document.getElementById('selColor').value;
    const combustible = document.getElementById('selCombustible').value;
    const cilindrada = document.getElementById('selCilindrada').value;
    const pasajeros = document.getElementById('selPasajeros').value;
    const puertas = document.getElementById('selPuertas').value;
    let estado = document.getElementById('selEstado').value;
    if (estado) {
      estado = 1;
    } else {
      estado = 0;
    }

    const url = 'http://127.0.0.1:5000/api/modificar_vehiculo';
    const data = {placa:placa,marca:marca,modelo:modelo,anio:parseInt(anio),
      trans:trans,estilo:estilo,color:color,combustible:combustible,
      cilindrada:parseInt(cilindrada),pasajeros:parseInt(pasajeros),puertas:parseInt(puertas),estado:estado};
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log(response.text());
    })
  }

  function modificarRepuesto(){
    const codigo = document.getElementById('selCodigoR').value;
    const nombre = document.getElementById('selNombreR').value;
    const marca = document.getElementById('selMarcaR').value;
    const modelo = document.getElementById('selModeloR').value;
    const anio = document.getElementById('selAnioR').value;
    const cantidad = document.getElementById('selCantidadR').value;

    const url = 'http://127.0.0.1:5000/api/repuestos/modificar';
    const data = {codigo:codigo,nombre:nombre,marca:marca,modelo:modelo,anio:parseInt(anio),cantidad:parseInt(cantidad)};
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log(response.text());
    })
  }

  function modificarCliente(){
    const id = document.getElementById('idC').value;
    const nombre = document.getElementById('selNombreC').value;
    const direccion = document.getElementById('selDireccionC').value;
    const correo = document.getElementById('selCorreoC').value;

    const url = 'http://127.0.0.1:5000/api/clientes/modificar';
    const data = {idCliente:id,nombre:nombre,direccion:direccion,correo:correo};
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log(response.text());
    })}

  function eliminarVehiculo(){
    const placa = document.getElementById('selPlacaV').value;
    const url = 'http://127.0.0.1:5000/api/vehiculos/eliminar';
    const data = {placa:placa};
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log(response.text());
    })}

  function eliminarRepuesto(){
    const codigo = document.getElementById('selCodigoR').value;
    const url = 'http://127.0.0.1:5000/api/repuestos/eliminar';
    const data = {codigo:codigo};
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log(response.text());
    })}

  function eliminarCliente(){
    const id = document.getElementById('idC').value;
    const url = 'http://127.0.0.1:5000/api/clientes/eliminar';
    const data = {idCliente:id};
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log(response.text());
    })}

  function insertarVehiculo(){
    const placa = document.getElementById('selPlacaVI').value;
    const marca = document.getElementById('selMarcaVI').value;
    const modelo = document.getElementById('selModeloVI').value;
    const anio = document.getElementById('selAnioVI').value;
    const trans = document.getElementById('selTransVI').value;
    const estilo = document.getElementById('selEstiloVI').value;
    const color = document.getElementById('selColorVI').value;
    const combustible = document.getElementById('selCombustibleVI').value;
    const cilindrada = document.getElementById('selCilindradaVI').value;
    const pasajeros = document.getElementById('selPasajerosVI').value;
    const puertas = document.getElementById('selPuertasVI').value;
    let estado = document.getElementById('selEstadoVI').value;
    if (estado) {
      estado = 1;
    } else {
      estado = 0;
    }
    
    const url = 'http://127.0.0.1:5000/api/vehiculos/insertar';
    const data = {placa:placa,marca:marca,modelo:modelo,anio:parseInt(anio),trans:trans,estilo:estilo,color:color,combustible:combustible,cilindrada:parseInt(cilindrada),pasajeros:parseInt(pasajeros),puertas:parseInt(puertas),estado:estado};
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log(response.text());
    })}

  function insertarRepuesto(){
    const codigo = document.getElementById('selCodigoRI').value;
    const nombre = document.getElementById('selNombreRI').value;
    const marca = document.getElementById('selMarcaRI').value;
    const modelo = document.getElementById('selModeloRI').value;
    const anio = document.getElementById('selAnioRI').value;
    const cantidad = document.getElementById('selCantidadRI').value;

    const url = 'http://127.0.0.1:5000/api/repuestos/insertar';
    const data = {codigo:codigo,nombre:nombre,marca:marca,modelo:modelo,anio:parseInt(anio),cantidad:parseInt(cantidad)};
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      alert(response.text());
      window.location.reload();
    })}

  function insertarCliente(){
    const nombre = document.getElementById('selNombreCI').value;
    const direccion = document.getElementById('selDireccionCI').value;
    const correo = document.getElementById('selCorreoCI').value;

    const url = 'http://127.0.0.1:5000/api/clientes/insertar';

    const data = {nombre:nombre,direccion:direccion,correo:correo};
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      alert(response.text());
      window.location.reload();
    })}

  function cargarOpciones(){
    fetch('http://127.0.0.1:5000/api/opciones')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener el archivo JSON');
      }

      return response.json();
    })
    .then(data =>{
      const selectMarcas=document.querySelectorAll('.selMarca');
      const selectTrans=document.querySelectorAll('.selTrans');
      const selectEstilo=document.querySelectorAll('.selEstilo');
      const selectCombustible=document.querySelectorAll('.selCombustible');
      const selects = [selectMarcas,selectTrans,selectEstilo,selectCombustible];
      selects.forEach(cargar);
      function cargar(select,index){
        data[index].forEach(opcion => {
          select.forEach(sel => {
            const op =  document.createElement('option');
            op.value = opcion;
            op.textContent = opcion;
            sel.appendChild(op);
          });
        });
      }
    });
  }

  function cerrarOpciones(){
    const mostrado = document.querySelectorAll('.opcionesDiv');
    mostrado.forEach(mostrar => {
      mostrar.style.display = 'none';
    });
  }

  function mostrarInsertarVehiculo(){
    const mostrado = document.querySelector('.insertarVehiculo');
    mostrado.style.display = 'grid';
  }
  function mostrarInsertarRepuesto(){
    const mostrado = document.querySelector('.insertarRepuesto');
    mostrado.style.display = 'grid';
  }
  function mostrarInsertarCliente(){
    const mostrado = document.querySelector('.insertarCliente');
    mostrado.style.display = 'grid';
  }
  
  cargarOpciones();
  cargarVehiculos();
  cargarRepuestos();
  cargarClientes();
  