import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from './postsSlice';

export default function PostForm() {
  const dispatch = useDispatch();
  const { createStatus, createError, loadStatus } = useSelector((state) => state.posts);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');
  const isCreating = createStatus === 'loading';
  const disabled = isCreating || loadStatus !== 'succeeded';

  async function handleSubmit(event) {
    event.preventDefault();
    if (disabled || !name.trim() || !description.trim()) return;
    setSuccess('');

    try {
      await dispatch(createPost({
        name: name.trim(),
        description: description.trim(),
      })).unwrap();
      setName('');
      setDescription('');
      setSuccess('Post creado correctamente.');
    } catch {
    }
  }

  return (
    <section aria-labelledby="create-title">
      <h2 id="create-title">Crear post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="post-name">Nombre</label>
        <input
          id="post-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={120}
          disabled={disabled}
        />
        <label htmlFor="post-description">Descripción</label>
        <textarea
          id="post-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          maxLength={2000}
          rows={3}
          disabled={disabled}
        />
        <button disabled={disabled || !name.trim() || !description.trim()}>
          {isCreating ? 'Creando…' : 'Crear'}
        </button>
      </form>
      {createError && <p role="alert">{createError}</p>}
      <p role="status">{success}</p>
    </section>
  );
}
