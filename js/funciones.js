import { addUser, getUsers, updateUser, deleteUser } from "./API.js";

// Función para agregar un cliente nuevo
export async function agregarCliente(cliente) {
  try {
    await addUser(cliente);
    console.log("Cliente agregado exitosamente");
  } catch (error) {
    console.error("Error al agregar el cliente:", error);
  }
}

// Función para obtener clientes de IndexedDB
export async function obtenerClientes() {
  let clientes;

  try {
    clientes = await getUsers();
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    clientes = [];
  }

  pintarClientesHTML(clientes);
}

// Función para actualizar un cliente
export async function actualizarCliente(id, clienteActualizado) {
  try {
    await updateUser(id, clienteActualizado);
    console.log("Cliente actualizado exitosamente");
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
  }
}

// Función para eliminar un cliente por ID
export async function eliminarCliente(id) {
  try {
    await deleteUser(id);
    console.log(`Cliente con ID ${id} eliminado exitosamente`);
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
  }
}

// Función para pintar la lista de clientes en el HTML
function pintarClientesHTML(clientes) {
  const listadoClientes = document.querySelector("#listado-clientes");
  listadoClientes.innerHTML = ""; // Limpiar la lista previa

  clientes.forEach(cliente => {
    const { id, nombre, telefono, empresa } = cliente;
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-400">${nombre}</td>
      <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-400">${telefono}</td>
      <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-400">${empresa}</td>
      <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-400">
        <a href="editar-cliente.html?id=${id}" class="text-blue-400 hover:text-blue-600 font-bold">Editar</a>
        <button class="text-red-400 hover:text-red-600 font-bold ml-4" data-id="${id}">Eliminar</button>
      </td>
    `;
    listadoClientes.appendChild(row);
  });

  // Agregar evento para eliminar a cada botón generado dinámicamente
  document.querySelectorAll(".text-red-400").forEach(button => {
    button.addEventListener("click", async (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      await eliminarCliente(id);
      obtenerClientes(); // Refresca la lista de clientes después de eliminar
    });
  });
}

// Función para manejar el formulario de nuevo cliente con validación
export function manejarFormularioNuevoCliente() {
  const formulario = document.querySelector("#formulario");

  // Listeners para validación en tiempo real
  const inputs = formulario.querySelectorAll("input");
  inputs.forEach(input => {
    input.addEventListener("blur", () => validarCampo(input));
  });

  // Validación en el envío del formulario
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar todos los campos
    const nombre = document.querySelector("#nombre");
    const email = document.querySelector("#email");
    const telefono = document.querySelector("#telefono");
    const empresa = document.querySelector("#empresa");

    // Si todos los campos son válidos, continúa con el proceso
    if (validarCampo(nombre) & validarCampo(email) & validarCampo(telefono) & validarCampo(empresa)) {
      const cliente = {
        nombre: nombre.value,
        email: email.value,
        telefono: telefono.value,
        empresa: empresa.value,
      };

      await agregarCliente(cliente);
      window.location.href = "index.html"; // Redirigir a la lista de clientes
    } else {
      console.log("Por favor, completa todos los campos correctamente.");
    }
  });
}

// Función de validación de campos individuales
function validarCampo(input) {
  const error = input.parentElement.querySelector(".error");

  // Validación para el campo de correo electrónico
  if (input.id === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validarInput(input, emailRegex, "Introduce un correo electrónico válido", error)) return false;
  }

  // Validación para el campo de nombre (solo letras, mínimo 3 caracteres)
  if (input.id === "nombre") {
    const nombreRegex = /^[a-zA-ZÀ-ÿ\s]{3,}$/;
    if (!validarInput(input, nombreRegex, "Introduce un nombre válido (solo letras y al menos 3 caracteres)", error)) return false;
  }

  // Validación para el campo de teléfono (números de 10 dígitos)
  if (input.id === "telefono") {
    const telefonoRegex = /^\d{9}$/;
    if (!validarInput(input, telefonoRegex, "Introduce un número de teléfono válido (9 dígitos)", error)) return false;
  }

  // Validación para el campo de empresa (solo letras, mínimo 3 caracteres)
  if (input.id === "empresa") {
    const nombreRegex = /^[a-zA-ZÀ-ÿ\s]{3,}$/;
    if (!validarInput(input, nombreRegex, "Introduce un nombre de empresa válido (solo letras y al menos 3 caracteres)", error)) return false;
  }

  // Retorno del campo validado correctamente
  return true
}

function validarInput(input, regex, mensajeError, error) {
  if (input.value.trim() === "") {
    input.classList.add("border-red-500");
    input.classList.remove("border-gray-300");
    mostrarError(input, "Este campo es obligatorio", error);
    return false;
  } else if (!regex.test(input.value.trim())) {
    input.classList.add("border-red-500");
    input.classList.remove("border-gray-300");
    mostrarError(input, mensajeError, error);
    return false;
  } else {
    input.classList.remove("border-red-500");
    input.classList.add("border-gray-300");
    quitarError(error);
    return true;
  }
}


// Función para mostrar el mensaje de error
function mostrarError(input, mensaje, error) {
  // Crear el elemento de error si no existe
  if (!error) {
    const errorMsg = document.createElement("p");
    errorMsg.classList.add("text-red-500", "text-xs", "mt-1", "error");
    errorMsg.textContent = mensaje;
    input.parentElement.appendChild(errorMsg);
  } else {
    error.textContent = mensaje;
  }
}

// Función para eliminar el mensaje de error
function quitarError(error) {
  if (error) {
    error.remove();
  }
}

// Función para cargar los datos de un cliente en el formulario de edición
export async function cargarClienteParaEdicion(id) {
  try {
    const clientes = await getUsers();
    const cliente = clientes.find(cliente => cliente.id === id);
    if (cliente) {
      document.querySelector("#nombre").value = cliente.nombre;
      document.querySelector("#email").value = cliente.email;
      document.querySelector("#telefono").value = cliente.telefono;
      document.querySelector("#empresa").value = cliente.empresa;
      document.querySelector("#id").value = cliente.id;
    }
  } catch (error) {
    console.error("Error al cargar el cliente para edición:", error);
  }
}

// Función para manejar la actualización del cliente
export function manejarFormularioEdicionCliente() {
  const formulario = document.querySelector("#formulario");

  // Listeners para validación en tiempo real
  const inputs = formulario.querySelectorAll("input");
  inputs.forEach(input => {
    input.addEventListener("blur", () => validarCampo(input));
  });

  // Validación en el envío del formulario
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar todos los campos
    const nombre = document.querySelector("#nombre");
    const email = document.querySelector("#email");
    const telefono = document.querySelector("#telefono");
    const empresa = document.querySelector("#empresa");
    const id = Number(document.querySelector("#id").value);

    // Si todos los campos son válidos, continúa con el proceso
    if (validarCampo(nombre) & validarCampo(email) & validarCampo(telefono) & validarCampo(empresa)) {
      const cliente = {
        nombre: nombre.value,
        email: email.value,
        telefono: telefono.value,
        empresa: empresa.value,
      };

      await actualizarCliente(id, cliente);
      window.location.href = "index.html"; // Redirigir a la lista de clientes
    } else {
      console.log("Por favor, completa todos los campos correctamente.");
    }
  })
}
