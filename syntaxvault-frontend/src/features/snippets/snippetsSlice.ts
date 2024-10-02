// src/features/snippets/snippetsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

interface Snippet {
  id: number;
  title: string;
  description: string;
  content: string;
  language: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface SnippetsState {
  snippets: Snippet[];
  loading: boolean;
  error: string | null;
}

const initialState: SnippetsState = {
  snippets: [],
  loading: false,
  error: null,
};

// Fetch all snippets
export const fetchSnippets = createAsyncThunk(
  'snippets/fetchSnippets',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/snippets');
      return response.data as Snippet[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Add a new snippet
export const addSnippet = createAsyncThunk(
  'snippets/addSnippet',
  async (snippetData: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>, thunkAPI) => {
    try {
      const response = await axios.post('/api/snippets', snippetData);
      return response.data as Snippet;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update a snippet
export const updateSnippet = createAsyncThunk(
  'snippets/updateSnippet',
  async ({ id, snippetData }: { id: number; snippetData: Partial<Snippet> }, thunkAPI) => {
    try {
      const response = await axios.put(`/api/snippets/${id}`, snippetData);
      return response.data as Snippet;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete a snippet
export const deleteSnippet = createAsyncThunk(
  'snippets/deleteSnippet',
  async (id: number, thunkAPI) => {
    try {
      await axios.delete(`/api/snippets/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const snippetsSlice = createSlice({
  name: 'snippets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Snippets
      .addCase(fetchSnippets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSnippets.fulfilled, (state, action: PayloadAction<Snippet[]>) => {
        state.loading = false;
        state.snippets = action.payload;
      })
      .addCase(fetchSnippets.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Snippet
      .addCase(addSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSnippet.fulfilled, (state, action: PayloadAction<Snippet>) => {
        state.loading = false;
        state.snippets.push(action.payload);
      })
      .addCase(addSnippet.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Snippet
      .addCase(updateSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSnippet.fulfilled, (state, action: PayloadAction<Snippet>) => {
        state.loading = false;
        const index = state.snippets.findIndex(snippet => snippet.id === action.payload.id);
        if (index !== -1) {
          state.snippets[index] = action.payload;
        }
      })
      .addCase(updateSnippet.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Snippet
      .addCase(deleteSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSnippet.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.snippets = state.snippets.filter(snippet => snippet.id !== action.payload);
      })
      .addCase(deleteSnippet.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default snippetsSlice.reducer;