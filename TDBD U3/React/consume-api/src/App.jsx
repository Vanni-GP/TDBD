import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  // Manejo de inputs
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Crear o actualizar producto
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formulario.nombre || !formulario.descripcion || !formulario.precio) return;

    if (editandoId) {
      const actualizado = {
        ...formulario,
        id: editandoId,
      };
      setProductos(productos.map(p => p.id === editandoId ? actualizado : p));
      setEditandoId(null);
    } else {
      const nuevo = {
        ...formulario,
        id: Date.now(), // ID único basado en tiempo
      };
      setProductos([nuevo, ...productos]);
    }

    setFormulario({ nombre: "", descripcion: "", precio: "" });
  };

  // Editar producto
  const handleEdit = (producto) => {
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
    });
    setEditandoId(producto.id);
  };

  // Eliminar producto
  const handleDelete = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Inventario de Productos</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          placeholder="Nombre del producto"
          className="form-control mb-2"
        />
        <input
          type="text"
          name="descripcion"
          value={formulario.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="form-control mb-2"
        />
        <input
          type="number"
          name="precio"
          value={formulario.precio}
          onChange={handleChange}
          placeholder="Precio"
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-success">
          {editandoId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* Tabla de productos */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>PRODUCTO</th>
            <th>DESCRIPCIÓN</th>
            <th>PRECIO</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No hay productos registrados</td>
            </tr>
          ) : (
            productos.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.descripcion}</td>
                <td>${p.precio}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(p)}>
                    ✏️
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
