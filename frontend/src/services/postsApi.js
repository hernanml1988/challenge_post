async function request(path, options = {}) {
  const response = await fetch(`/api/posts${path}`, options);
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error ?? `Error HTTP ${response.status}`);
  }
  return body;
}

export const postsApi = {
  list: () => request(''),
  create: (post) => request('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  }),
  remove: (id) => request(`/${id}`, { method: 'DELETE' }),
};
