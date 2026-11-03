import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postsApi } from '../../services/postsApi';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  () => postsApi.list(),
  {
    condition: (_, { getState }) => getState().posts.loadStatus === 'idle',
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  (post) => postsApi.create(post)
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  (id) => postsApi.remove(id)
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    loadStatus: 'idle',
    loadError: null,
    createStatus: 'idle',
    createError: null,
    deletingIds: [],
    deleteError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loadStatus = 'loading';
        state.loadError = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loadStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loadStatus = 'failed';
        state.loadError = action.error.message;
      })
      .addCase(createPost.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.error.message;
      })
      .addCase(deletePost.pending, (state, action) => {
        state.deletingIds.push(action.meta.arg);
        state.deleteError = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const deletedId = action.payload.id;
        state.items = state.items.filter((post) => post.id !== deletedId);
        state.deletingIds = state.deletingIds.filter((id) => id !== action.meta.arg);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.deletingIds = state.deletingIds.filter((id) => id !== action.meta.arg);
        state.deleteError = action.error.message;
      });
  },
});

export default postsSlice.reducer;
