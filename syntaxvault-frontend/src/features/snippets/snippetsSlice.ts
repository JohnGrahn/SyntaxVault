// src/features/snippets/snippetsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';
import publicAxios from '../../api/publicAxios';
import { Tag, Snippet, SnippetInput, SnippetUpdateInput } from '../../types/types';
import { RootState } from '../../app/store';
import qs from 'qs'; // Import qs

interface SnippetsState {
  snippets: Snippet[];
  publicSnippets: Snippet[];
  loading: boolean;
  error: string | null;
}

const initialState: SnippetsState = {
  snippets: [],
  publicSnippets: [],
  loading: false,
  error: null,
};

// Modify fetchSnippets to accept filters
export const fetchSnippets = createAsyncThunk(
  'snippets/fetchSnippets',
  async (params: FetchSnippetsParams = {}, thunkAPI) => {
    try {
      let url = '/api/snippets';
      if (params.keyword || params.language || params.tags) {
        url = '/api/snippets/search';
      }
      const response = await axios.get(url, {
        params: {
          keyword: params.keyword,
          language: params.language,
          tags: params.tags,
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }), // Customize serialization
      });
      return response.data as Snippet[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Add a new snippet
export const addSnippet = createAsyncThunk(
  'snippets/addSnippet',
  async (snippetData: SnippetInput, thunkAPI) => {
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
  async ({ id, snippetData }: { id: number; snippetData: SnippetUpdateInput }, thunkAPI) => {
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

interface FetchSnippetsParams {
  keyword?: string;
  language?: string;
  tags?: string[];
}

export const fetchPublicSnippets = createAsyncThunk(
  'snippets/fetchPublicSnippets',
  async (_, thunkAPI) => {
    try {
      const response = await publicAxios.get('/api/snippets/public');
      return response.data as Snippet[];
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
        if (action.payload.isPublic) {
          state.publicSnippets.push(action.payload);
        }
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
          console.log('Updating snippet in state:', action.payload); // Debug log
          state.snippets[index] = action.payload;
        }
        
        // Update public snippets array
        const publicIndex = state.publicSnippets.findIndex(snippet => snippet.id === action.payload.id);
        if (action.payload.isPublic && publicIndex === -1) {
          state.publicSnippets.push(action.payload);
        } else if (!action.payload.isPublic && publicIndex !== -1) {
          state.publicSnippets.splice(publicIndex, 1);
        } else if (action.payload.isPublic && publicIndex !== -1) {
          state.publicSnippets[publicIndex] = action.payload;
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
      })
      
      // Fetch Public Snippets
      .addCase(fetchPublicSnippets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicSnippets.fulfilled, (state, action: PayloadAction<Snippet[]>) => {
        state.loading = false;
        state.publicSnippets = action.payload;
        state.error = null;
      })
      .addCase(fetchPublicSnippets.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default snippetsSlice.reducer;
