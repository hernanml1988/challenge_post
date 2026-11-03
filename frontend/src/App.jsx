import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from './features/posts/postsSlice';
import PostFilter from './features/posts/PostFilter';
import PostList from './features/posts/PostList';
import PostForm from './features/posts/PostForm';

export default function App() {
  const dispatch = useDispatch();
  const { items, loadStatus, loadError } = useSelector((state) => state.posts);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const visiblePosts = items.filter((post) =>
    post.name.toLocaleLowerCase('es').includes(filter.toLocaleLowerCase('es'))
  );

  return (
    <main>
      <h1>Administrador de posts</h1>
      <PostFilter onSearch={setFilter} />
      {(loadStatus === 'idle' || loadStatus === 'loading') && (
        <p role="status">Cargando posts…</p>
      )}
      {loadStatus === 'failed' && (
        <p role="alert">{loadError}. Recarga la página para volver a intentar.</p>
      )}
      {loadStatus === 'succeeded' && <PostList posts={visiblePosts} />}
      <PostForm />
    </main>
  );
}
