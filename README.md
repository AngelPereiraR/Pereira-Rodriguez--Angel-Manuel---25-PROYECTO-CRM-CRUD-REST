# CRUD de Clientes con IndexedDB

Este proyecto es una aplicación para gestionar una lista de clientes usando `IndexedDB` como almacenamiento local en el navegador. Permite agregar, actualizar, eliminar y listar clientes con un formulario interactivo y validaciones.

## Requisitos

- Un navegador con soporte para `IndexedDB`.
- Archivo HTML con estructura y estilos (no incluidos en esta descripción).

## Instalación y Uso

1. Clona este repositorio.
2. Abre el archivo `index.html` en un navegador.
3. Usa el formulario para agregar, ver, editar y eliminar clientes.

## Estructura de Archivos

- **API.js**: Define las funciones para interactuar con la base de datos `IndexedDB`, incluyendo la apertura de la base, y operaciones CRUD (`addUser`, `getUsers`, `updateUser`, `deleteUser`).
- **app.js**: Archivo principal que inicia el proceso de obtención y visualización de clientes en la página principal.
- **editarcliente.js**: Controla la carga y edición de un cliente seleccionado. Extrae el ID de la URL y llama a funciones para cargar los datos en el formulario y manejar su actualización.
- **funciones.js**: Contiene funciones auxiliares para el CRUD, manejo del formulario y validación de campos de entrada.
- **nuevocliente.js**: Controla el formulario de creación de un nuevo cliente y la validación en tiempo real.

## Funcionalidades

1. **Agregar Cliente**  
   Permite agregar un nuevo cliente con datos como `nombre`, `email`, `teléfono` y `empresa`. Los datos se validan antes de ser agregados a la base de datos.

2. **Listar Clientes**  
   Obtiene todos los clientes almacenados en `IndexedDB` y los muestra en una tabla en la interfaz. Si no hay clientes, muestra un mensaje adecuado.

3. **Editar Cliente**  
   Al seleccionar "Editar" en la lista de clientes, el usuario es dirigido a un formulario de edición. Aquí, los datos del cliente se cargan automáticamente y el usuario puede modificar cualquier campo.

4. **Eliminar Cliente**  
   Elimina un cliente específico de la base de datos y actualiza la lista de clientes en la interfaz.

## Descripción de Archivos

### `API.js`

- **`openDatabase`**: Abre o crea la base de datos `UsersDB` con un almacén de objetos llamado `users`.
- **`addUser`**: Agrega un nuevo usuario en el almacén de objetos.
- **`getUsers`**: Recupera todos los usuarios almacenados.
- **`updateUser`**: Actualiza un usuario en el almacén de objetos.
- **`deleteUser`**: Elimina un usuario por su `id`.

### `app.js`

- Usa `DOMContentLoaded` para cargar los clientes al iniciar la aplicación.
- Llama a `obtenerClientes` desde `funciones.js` para pintar la lista de clientes en la interfaz.

### `editarcliente.js`

- Obtiene el `id` de un cliente desde la URL.
- Llama a `cargarClienteParaEdicion` para cargar los datos en el formulario.
- Configura el envío del formulario para actualizar el cliente llamando a `manejarFormularioEdicionCliente`.

### `funciones.js`

- **CRUD de Clientes**:
  - **`agregarCliente`**: Llama a `addUser` de `API.js` para agregar un cliente.
  - **`obtenerClientes`**: Llama a `getUsers` de `API.js` y muestra los clientes en una tabla.
  - **`actualizarCliente`**: Llama a `updateUser` de `API.js` para actualizar un cliente.
  - **`eliminarCliente`**: Llama a `deleteUser` de `API.js` para eliminar un cliente por `id`.
- **Formulario y Validación**:
  - **`manejarFormularioNuevoCliente`**: Controla el formulario de creación de cliente y su validación.
  - **`validarCampo`**: Verifica cada campo usando expresiones regulares para asegurar entradas válidas (nombre, email, teléfono y empresa).
  - **`pintarClientesHTML`**: Muestra los clientes en la tabla del HTML y asigna eventos para los botones de "Eliminar".

### `nuevocliente.js`

- Importa y llama a `manejarFormularioNuevoCliente` para controlar la creación de un nuevo cliente.

## Ejemplos de Uso

### 1. Agregar un Cliente

Para agregar un nuevo cliente, completa los campos en el formulario de cliente y haz clic en **"Guardar"**.

Ejemplo:

- **Nombre**: Juan Pérez
- **Email**: juan.perez@correo.com
- **Teléfono**: 123456789
- **Empresa**: Ejemplo SA

Al enviar el formulario, el cliente se almacenará en `IndexedDB` y aparecerá en la lista de clientes.

### 2. Listar Clientes

Al cargar la aplicación, todos los clientes almacenados en `IndexedDB` se mostrarán en una tabla en la página principal. Cada fila de la tabla muestra:

- Nombre del cliente
- Teléfono
- Empresa
- Opciones para **Editar** y **Eliminar**

Ejemplo de la tabla:
| Nombre | Teléfono | Empresa | Acciones |
|--------------|------------|-------------|-----------------------------|
| Juan Pérez | 123456789 | Ejemplo SA | Editar - Eliminar |

### 3. Editar un Cliente

Para editar un cliente, haz clic en **Editar** en la fila correspondiente. Esto te llevará a una página con un formulario donde puedes modificar la información del cliente.

Ejemplo:

- Cambia el nombre **Juan Pérez** a **Juan A Pérez**.
- Haz clic en **Guardar Cambios** para actualizar los datos en la base de datos.

### 4. Eliminar un Cliente

Para eliminar un cliente, haz clic en **Eliminar** en la fila correspondiente de la tabla.

- Haz clic en **Aceptar** para eliminar al cliente de `IndexedDB`.
- La lista de clientes se actualizará automáticamente.

## Notas

- Este proyecto está diseñado para funcionar en un entorno de navegador con soporte para `IndexedDB`.
- Los datos permanecen en el almacenamiento local del navegador hasta que se borren o se elimine la caché del navegador.
