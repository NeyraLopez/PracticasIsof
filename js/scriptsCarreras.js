//Scripst Carreras
function validarFormulario() {
  const id = document.getElementById('id').value;
  // Puedes agregar más validaciones aquí
  if (id.length < 3) {
      alert('La matrícula debe tener al menos 3 caracteres');
      return false;
  }
  return true;
}

//Scripts para formulariolistar.html
 // Variable para controlar si es edición
 let editando = false;

 // Cargar tabla inicial
 function cargarTabla() {
     fetch('../php/carreras/listar.php')
         .then(response => response.json())
         .then(data => {
             const tablaBody = document.getElementById('tablaAlumnosBody');
             tablaBody.innerHTML = '';
             
             if (data.length === 0) {
                 tablaBody.innerHTML = "<tr><td colspan='4'>No se encontraron registros.</td></tr>";
             } else {
                 data.forEach(carrera => {
                     const row = tablaBody.insertRow();
                     row.innerHTML = `
                         <td>${carrera.id}</td>
                         <td>${carrera.nombreCarrera}</td>
                         <td>${carrera.direccion}</td>
                         <td>
                             <button onclick="editarAlumno('${carrera.id}')">Modificar</button>
                             <button onclick="eliminarAlumno('${carrera.id}')">Borrar</button>
                         </td>
                     `;
                 });
             }
         });
 }

 // Mostrar modal para editar
 function editarAlumno(id) {
     editando = true;
     fetch(`../php/carreras/obtener.php?id=${id}`)
         .then(response => response.json())
         .then(data => {
             document.getElementById('modalTitulo').textContent = 'Editar Alumno';
             document.getElementById('idEditar').value = data.id;
             document.getElementById('nombreCarrera').value = data.nombreCarrera;
             document.getElementById('modalFormulario').style.display = 'flex';
         });
 }

 // Eliminar carrera
 function eliminarAlumno(id) {
     if (confirm('¿Estás seguro de eliminar este carrera?')) {
         fetch(`../php/carreras/eliminar.php?id=${id}`, {
             method: 'POST'
         })
         .then(() => cargarTabla());
     }
 }

 // Mostrar modal para agregar
 function mostrarModalAgregar() {
     editando = false;
     document.getElementById('modalTitulo').textContent = 'Agregar Nuevo Alumno';
     document.getElementById('formularioAlumno').reset();
     document.getElementById('modalFormulario').style.display = 'flex';
 }

 // Cerrar modal
 function cerrarModal() {
     document.getElementById('modalFormulario').style.display = 'none';
 }

 // Guardar carrera (nuevo o edición)
 function guardarAlumno(event) {
     event.preventDefault();
     
     const data = {
       //  id: editando ? document.getElementById('idEditar').value : null,
         id: document.getElementById('idEditar').value ,
         nombreCarrera: document.getElementById('nombreCarrera').value,
     };

     const url = editando ? '../php/carreras/actualizar.php' : '../php/carreras/grabar.php';
     const method = editando ? 'PUT' : 'POST';

     fetch(url, {
         method: method,
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
     })
     .then(() => {
         cerrarModal();
         cargarTabla();
     });
 }

 // Cargar tabla al iniciar
 cargarTabla();

 // Cerrar modal al hacer click fuera
/*  window.onclick = function(event) {
     const modal = document.getElementById('modalFormulario');
     if (event.target == modal) {
         cerrarModal();
     }
 }*/
 // Variables de paginación
 let paginaActual = 1;
 let registrosPorPagina = 10;
 let datosAlumnos = [];

 // Cargar tabla inicial
 function cargarTabla() {
     fetch('../php/carreras/listar.php')
         .then(response => response.json())
         .then(data => {
             datosAlumnos = data;
             renderizarTabla();
             actualizarControlesPaginacion();
         });
 }

 // Renderizar tabla con paginación
 function renderizarTabla() {
     const inicio = (paginaActual - 1) * registrosPorPagina;
     const fin = inicio + registrosPorPagina;
     const alumnosPagina = datosAlumnos.slice(inicio, fin);

     const tablaBody = document.getElementById('tablaAlumnosBody');
     tablaBody.innerHTML = '';
     
     if (alumnosPagina.length === 0) {
         tablaBody.innerHTML = "<tr><td colspan='4'>No se encontraron registros.</td></tr>";
     } else {
         alumnosPagina.forEach(carrera => {
             const row = tablaBody.insertRow();
             row.innerHTML = `
                 <td>${carrera.id}</td>
                 <td>${carrera.nombreCarrera}</td>
                 <td>
                     <button class="btn-modificar" onclick="editarAlumno('${carrera.id}')">Modificar</button>
                     <button class="btn-borrar" onclick="eliminarAlumno('${carrera.id}')">Borrar</button>
                 </td>
             `;
         });
     }
 }

 // Actualizar controles de paginación
 function actualizarControlesPaginacion() {
     const totalPaginas = Math.ceil(datosAlumnos.length / registrosPorPagina);
     const controles = document.getElementById('controlesPaginacion');
     controles.innerHTML = '';

     // Botón Anterior
     if (paginaActual > 1) {
         const botonAnterior = document.createElement('button');
         botonAnterior.innerText = 'Anterior';
         botonAnterior.addEventListener('click', () => {
             paginaActual--;
             renderizarTabla();
             actualizarControlesPaginacion();
         });
         controles.appendChild(botonAnterior);
     }

     // Números de página
     for (let i = 1; i <= totalPaginas; i++) {
         const botonPagina = document.createElement('button');
         botonPagina.innerText = i;
         botonPagina.disabled = (i === paginaActual);
         botonPagina.addEventListener('click', () => {
             paginaActual = i;
             renderizarTabla();
             actualizarControlesPaginacion();
         });
         controles.appendChild(botonPagina);
     }

     // Botón Siguiente
     if (paginaActual < totalPaginas) {
         const botonSiguiente = document.createElement('button');
         botonSiguiente.innerText = 'Siguiente';
         botonSiguiente.addEventListener('click', () => {
             paginaActual++;
             renderizarTabla();
             actualizarControlesPaginacion();
         });
         controles.appendChild(botonSiguiente);
     }
 }

 // Cambiar cantidad de registros por página
 function cambiarRegistrosPorPagina(valor) {
     registrosPorPagina = parseInt(valor);
     paginaActual = 1;
     renderizarTabla();
     actualizarControlesPaginacion();
 }