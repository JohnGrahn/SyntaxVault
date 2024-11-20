// src/features/tags/tagsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';
import { Tag } from '../../types/types';

interface TagsState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  tags: [],
  loading: false,
  error: null,
};

// Fetch all tags
export const fetchTags = createAsyncThunk(
  'tags/fetchTags',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/tags');
      return response.data as Tag[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create a new tag
export const createTag = createAsyncThunk(
  'tags/createTag',
  async (tagName: string, thunkAPI) => {
    try {
      const response = await axios.post('/api/tags', { name: tagName });
      return response.data as Tag;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchTags = createAsyncThunk(
  'tags/searchTags',
  async (query: string, thunkAPI) => {
    try {
      if (query.length < 2) return [];
      const response = await axios.get(`/api/tags/search?query=${encodeURIComponent(query)}`);
      return response.data as Tag[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Tags
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action: PayloadAction<Tag[]>) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Tag
      .addCase(createTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action: PayloadAction<Tag>) => {
        state.loading = false;
        state.tags.push(action.payload);
      })
      .addCase(createTag.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search Tags
      .addCase(searchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTags.fulfilled, (state, action: PayloadAction<Tag[]>) => {
        state.loading = false;
        state.tags = action.payload; // Update tags with search results
      })
      .addCase(searchTags.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tagsSlice.reducer;