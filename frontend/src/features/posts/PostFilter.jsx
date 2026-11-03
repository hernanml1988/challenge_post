import { useState } from 'react';

export default function PostFilter({ onSearch }) {
  const [value, setValue] = useState('');
  const [nombre, setNombre] = useState('Hernan');


  function handleSubmit(event) {
    event.preventDefault();
    onSearch(value.trim());
  }

  function clearFilter() {
    setValue('');
    onSearch('');
  }

  return (
    <form onSubmit={handleSubmit} className="filter" role="search">
      <label htmlFor="name  -filter">Filtrar por nombre</label>
      <input
        id="name-filter"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Escribe parte del nombre"
      />
      {nombre}
      <div className="actions">
        <button>Buscar</button>
        <button type="button" onClick={clearFilter}>Limpiar</button>
      </div>
    </form>
  );
}
