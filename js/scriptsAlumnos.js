function light(sw) {
    var pic;
    if (sw == 0) {
      pic = "../images/pic_bulboff.gif"
    } else {
      pic = "../images/pic_bulbon.gif"
    }
    document.getElementById('myImage').src = pic;
  }

  function myFunction() {
    document.getElementById("demo").style.fontSize = "25px"; 
    document.getElementById("demo").style.color = "red";
    document.getElementById("demo").style.backgroundColor = "yellow";        
    }
function fecha_actual(){
    document.getElementById('demo').innerHTML = 'Esta es la fecha y hora:' + ' ' + Date();
}
function validarFormulario() {
  const matricula = document.getElementById('matricula').value;
  // Puedes agregar más validaciones aquí
  if (matricula.length < 3) {
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
     fetch('../php/alumnos/listar.php')
         .then(response => response.json())
         .then(data => {
             const tablaBody = document.getElementById('tablaAlumnosBody');
             tablaBody.innerHTML = '';
             
             if (data.length === 0) {
                 tablaBody.innerHTML = "<tr><td colspan='4'>No se encontraron registros.</td></tr>";
             } else {
                 data.forEach(alumno => {
                     const row = tablaBody.insertRow();
                     row.innerHTML = `
                         <td>${alumno.matricula}</td>
                         <td>${alumno.nombre}</td>
                         <td>${alumno.direccion}</td>
                         <td>${alumno.carrera}</td>
                         <td>
                             <button onclick="editarAlumno('${alumno.matricula}')">Modificar</button>
                             <button onclick="eliminarAlumno('${alumno.matricula}')">Borrar</button>
                         </td>
                     `;
                 });
             }
         });
 }

 // Mostrar modal para editar
 function editarAlumno(matricula) {
     editando = true;
     fetch(`../php/alumnos/obtener.php?matricula=${matricula}`)
         .then(response => response.json())
         .then(data => {
             document.getElementById('modalTitulo').textContent = 'Editar Alumno';
             document.getElementById('matriculaEditar').value = data.matricula;
             document.getElementById('nombre').value = data.nombre;
             document.getElementById('direccion').value = data.direccion;
             document.getElementById('carrera').value = data.carrera;
             document.getElementById('modalFormulario').style.display = 'flex';
             cargarCarreras();//Cargar carreras dentro del modal
             
             
         });
 }

 // Eliminar alumno
 function eliminarAlumno(matricula) {
     if (confirm('¿Estás seguro de eliminar este alumno?')) {
         fetch(`../php/eliminar.php?matricula=${matricula}`, {
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
     //document.getElementById('matriculaEditar').value = '';
     cargarCarreras();//Cargar carreras dentro del modal
     
 }

 // Cerrar modal
 function cerrarModal() {
     document.getElementById('modalFormulario').style.display = 'none';
 }

 // Guardar alumno (nuevo o edición)
 function guardarAlumno(event) {
     event.preventDefault();
     
     const data = {
       //  matricula: editando ? document.getElementById('matriculaEditar').value : null,
         matricula: document.getElementById('matriculaEditar').value ,
         nombre: document.getElementById('nombre').value,
         direccion: document.getElementById('direccion').value,
         idcarrera: document.getElementById('carrera').value
     };

     const url = editando ? '../php/alumnos/actualizar.php' : '../php/alumnos/grabar.php';
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
     fetch('../php/alumnos/listar.php')
         .then(response => response.json())
         .then(data => {
             datosAlumnos = data;
             renderizarTabla();
             actualizarControlesPaginacion();
         });
 }
 function cargarCarreras() {
    fetch('../php/carreras/listar.php')
        .then(response => response.json())
        .then(data => {

            const selectCarreras = document.getElementById('carrera');

            // Clear existing options (except the default one if present).
             while (selectCarreras.options.length > 1) {
                 selectCarreras.remove(1);
              }
            //Selecciona el id carrera del modal
            data.forEach(carrera => {
                const option = document.createElement('option');
                option.value = carrera.id;
                option.textContent = carrera.nombreCarrera;
                selectCarreras.appendChild(option);
            });
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
         alumnosPagina.forEach(alumno => {
             const row = tablaBody.insertRow();
             row.innerHTML = `
                 <td>${alumno.matricula}</td>
                 <td>${alumno.nombre}</td>
                 <td>${alumno.direccion}</td>
                 <td>${alumno.carrera}</td>
                 <td>
                     <button class="btn-modificar" onclick="editarAlumno('${alumno.matricula}')">Modificar</button>
                     <button class="btn-borrar" onclick="eliminarAlumno('${alumno.matricula}')">Borrar</button>
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