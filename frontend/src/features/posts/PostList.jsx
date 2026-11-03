import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from './postsSlice';

export default function PostList({ posts }) {
  const dispatch = useDispatch();
  const { deletingIds, deleteError, items } = useSelector((state) => state.posts);

  return (
    <section aria-labelledby="list-title">
      <h2 id="list-title">Listado de posts</h2>
      {deleteError && <p role="alert">{deleteError}</p>}
      {posts.length === 0 ? (
        <p>{items.length === 0 ? 'Todavía no hay posts.' : 'No hay resultados para ese nombre.'}</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <caption>Posts disponibles</caption>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Descripción</th>
                <th scope="col">Acción</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const isDeleting = deletingIds.includes(post.id);
                return (
                  <tr key={post.id}>
                    <td>{post.name}</td>
                    <td>{post.description}</td>
                    <td>
                      <button
                        type="button"
                        disabled={isDeleting}
                        aria-label={`Eliminar ${post.name}`}
                        onClick={() => dispatch(deletePost(post.id))}
                      >
                        {isDeleting ? 'Eliminando…' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
