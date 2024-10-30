# IndexedDB Cheatsheet

## 1. Apertura de una base de datos

Para abrir o crear una base de datos IndexedDB se debe especificar el nombre de la base de datos y su versión. El evento `onerror` maneja los errores, `onsuccess` se ejecuta cuando la base de datos se abre correctamente y `onupgradeneeded` se utiliza para actualizar la estructura de la base de datos cuando se cambia la versión.

    const dbName = "MiBaseDeDatos";
    const dbVersion = 1;

    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) => {
      console.error("Error al abrir la base de datos:", event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      console.log("Base de datos abierta con éxito");
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log("Actualizando la estructura de la base de datos");
      // Aquí se crean o modifican los object stores
    };

## 2. Creación de un Object Store

Un "Object Store" es similar a una tabla de una base de datos relacional. El código se debe ejecutar en el evento `onupgradeneeded`.
Se crea un Object Store llamado "usuarios" con una clave primaria autoincremental y se añaden índices para facilitar las búsquedas.

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("usuarios", { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("nombre", "nombre", { unique: false });
      objectStore.createIndex("email", "email", { unique: true });
    };

## 3. Operaciones CRUD

### 1. Manejo de transacciones

Las transacciones garantizan la integridad de las operaciones de base de datos y permiten agrupar múltiples operaciones.

    const transaction = db.transaction(["usuarios"], "readwrite");

    transaction.oncomplete = (event) => {
      console.log("Transacción completada");
    };

    transaction.onerror = (event) => {
      console.error("Error en la transacción:", event.target.error);
    };

    const objectStore = transaction.objectStore("usuarios");
    // Realizar operaciones en el almacén de objetos

### 2. Uso de cursores

Un cursor sirve para iterar sobre todos los registros en un object store. Esto es útil para operaciones que necesitan procesar múltiples registros.

    const objectStore = db.transaction("usuarios").objectStore("usuarios");
    objectStore.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        console.log("Usuario:", cursor.value);
        cursor.continue();
      } else {
        console.log("No hay más usuarios");
      }
    };

### 3. Uso de índices

Este ejemplo demuestra cómo se utiliza un índice para buscar registros por un campo que no es la clave primaria. En este caso, se busca un usuario por su email.

    const index = objectStore.index("email");
    const request = index.get("juan@ejemplo.com");

    request.onsuccess = (event) => {
      if (request.result) {
        console.log("Usuario encontrado por email:", request.result);
      }
    };

### 4. Agregar datos

Para añadir un nuevo registro al object store se inicia una transacción de escritura y se utiliza el método `add` para insertar los datos.

    const transaction = db.transaction(["usuarios"], "readwrite");
    const objectStore = transaction.objectStore("usuarios");
    const request = objectStore.add({ nombre: "Juan", email: "juan@ejemplo.com" });

    request.onsuccess = (event) => {
      console.log("Dato agregado con éxito");
    };

### 5. Leer datos

Para recuperar un registro específico del object store debemos utilizar su clave primaria. Se usa una transacción de solo lectura y el método `get` para obtener los datos.

    const transaction = db.transaction(["usuarios"]);
    const objectStore = transaction.objectStore("usuarios");
    const request = objectStore.get(1); // Obtener por clave

    request.onsuccess = (event) => {
      if (request.result) {
        console.log("Usuario:", request.result);
      } else {
        console.log("No se encontró el usuario");
      }
    };

### 6. Actualizar datos

Se utiliza el método `put`, que reemplazará el registro si existe o lo añadirá si no.

    const transaction = db.transaction(["usuarios"], "readwrite");
    const objectStore = transaction.objectStore("usuarios");
    const request = objectStore.put({ id: 1, nombre: "Juan Actualizado", email: "juan@ejemplo.com" });

    request.onsuccess = (event) => {
      console.log("Dato actualizado con éxito");
    };

### 7. Eliminar datos

Para eliminar un registro específico del object store se utiliza su clave primaria. Se usa el método `delete` dentro de una transacción de escritura.

    const transaction = db.transaction(["usuarios"], "readwrite");
    const objectStore = transaction.objectStore("usuarios");
    const request = objectStore.delete(1); // Eliminar por clave

    request.onsuccess = (event) => {
      console.log("Dato eliminado con éxito");
    };

### Consideraciones importantes

Se tienen que tener en cuenta las siguientes consideraciones:

- **Política del mismo origen**: IndexedDB sigue esta política, lo que significa que solo se puede acceder a una base de datos desde el mismo dominio, protocolo y puerto **[1.]**
- **Estructura NoSQL**: IndexedDB es una base de datos NoSQL basada en objetos, no una base de datos relacional **[1.]**
- **Operaciones asíncronas**: La mayoría de las operaciones en IndexedDB son asíncronas, lo que requiere el uso de callbacks o promesas **[2.]**
- **Versionado**: Es importante manejar correctamente las versiones de la base de datos para realizar actualizaciones estructurales **[3.]**
- **Manejo de errores**: Siempre es crucial implementar manejadores de errores para cada operación **[4.]**

## Webgrafía

- **[1.]** [IndexedDB | Primeros pasos con la base de datos - IONOS España](https://www.ionos.es/digitalguide/paginas-web/desarrollo-web/indexeddb/)

- **[2.]** [Trabajar con IndexedDB | Envato Tuts+](https://code.tutsplus.com/es/trabajar-con-indexeddb--net-34673t)

- **[3.]** [IndexedDB](https://es.javascript.info/indexeddb)

- **[4.]** [Trabaja con IndexedDB | Articles | web.dev](https://web.dev/articles/indexeddb?hl=es-419)
