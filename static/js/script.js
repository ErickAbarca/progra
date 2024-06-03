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
        document.getElementById('boton_anadir').href = '/api/vehiculos/insertar';
        activo = 'vehiculos';
    } else if (id === 'tabla-repuestos') {
        opciones = ['Nombre', 'Marca', 'Modelo', 'Año', 'Cantidad'];
        document.getElementById('boton_anadir').href = '/api/repuestos/insertar';
        activo = 'repuestos';
    } else if (id === 'tabla-pedidos') {
        opciones = ['Nombre', 'Dirección', 'Correo', 'Fecha'];
        document.getElementById('boton_anadir').href = '/api/pedidos/insertar';
        activo = 'pedidos';
    }

    const filtro = document.getElementById('filtros');
        filtro.innerHTML = '';
        opciones.forEach(opcion => {
          const op =  document.createElement('option');
          op.value = opcion;
          op.textContent = opcion;
          filtro.appendChild(op);
        });




    const tabla = document.querySelector('.'+id);
    tabla.classList.remove('ocultarTabla');
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

  function cargarOpciones(){
    fetch('http://127.0.0.1:5000/api/opciones')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener el archivo JSON');
      }

      return response.json();
    })
    .then(data =>{
      const selectMarcas=document.getElementById('selMarcaV');
      const selectTrans=document.getElementById('selTrans');
      const selectEstilo=document.getElementById('selEstilo');
      const selectCombustible=document.getElementById('selCombustible');
      const selects = [selectMarcas,selectTrans,selectEstilo,selectCombustible];
      selects.forEach(cargar);
      function cargar(select,index){
        data[index].forEach(opcion => {
          const op =  document.createElement('option');
          op.value = opcion;
          op.textContent = opcion;
          select.appendChild(op);
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
  cargarVehiculos();
  cargarOpciones();
  