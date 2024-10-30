import { cargarClienteParaEdicion, manejarFormularioEdicionCliente } from "./funciones.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Obtener el ID del cliente desde la URL
  const params = new URLSearchParams(window.location.search);
  const clienteId = parseInt(params.get("id"), 10);

  if (clienteId) {
    // Cargar los datos del cliente en el formulario
    await cargarClienteParaEdicion(clienteId);
  }

  // Configurar el manejo del formulario para actualizar el cliente
  manejarFormularioEdicionCliente();
});
