<script>
  import { onMount } from 'svelte';

  let productos = [];
  let nuevoProducto = { nombre: '', precio: '' };
  let cargando = true;

  // 🔹 GET: obtener productos
  async function cargarProductos() {
    cargando = true;
    try {
      const res = await fetch('http://localhost:8000/productos'); // tu API
      productos = await res.json();
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      cargando = false;
    }
  }

  // 🔹 POST: agregar producto
  async function agregarProducto() {
    try {
      const res = await fetch('http://localhost:8000/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
      });
      if (res.ok) {
        await cargarProductos();
        nuevoProducto = { nombre: '', precio: '' };
      }
    } catch (err) {
      console.error('Error al agregar producto:', err);
    }
  }

  // 🔹 PUT: actualizar producto
  async function actualizarProducto(id, datos) {
    try {
      const res = await fetch(`http://localhost:8000/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      if (res.ok) {
        await cargarProductos();
      }
    } catch (err) {
      console.error('Error al actualizar producto:', err);
    }
  }

  // 🔹 DELETE: eliminar producto
  async function eliminarProducto(id) {
    try {
      const res = await fetch(`http://localhost:8000/productos/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await cargarProductos();
      }
    } catch (err) {
      console.error('Error al eliminar producto:', err);
    }
  }

  // Cargar productos al iniciar
  onMount(cargarProductos);
</script>

<main>
  <h1>Inventario</h1>

  {#if cargando}
    <p>Cargando...</p>
  {:else}
    <ul>
      {#each productos as p}
        <li>
          {p.nombre} - ${p.precio}
          <button on:click={() => eliminarProducto(p.id)}>Eliminar</button>
          <button on:click={() => actualizarProducto(p.id, { nombre: p.nombre, precio: p.precio + 10 })}>
            +10 al precio
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  <h2>Agregar producto</h2>
  <input placeholder="Nombre" bind:value={nuevoProducto.nombre} />
  <input placeholder="Precio" type="number" bind:value={nuevoProducto.precio} />
  <button on:click={agregarProducto}>Agregar</button>
</main>

<style>
  main {
    font-family: sans-serif;
    padding: 1rem;
  }
  input {
    margin: 0.5rem;
  }
  button {
    margin-left: 0.5rem;
  }
</style>
