// src/features/collections/collectionsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';
import { Collection, CollectionRequest } from '../../types/types';

interface CollectionsState {
  collections: Collection[];
  publicCollections: Collection[];
  loading: boolean;
  error: string | null;
}

const initialState: CollectionsState = {
  collections: [],
  publicCollections: [],
  loading: false,
  error: null,
};

// Fetch all collections
export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/collections');
      return response.data as Collection[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Fetch public collections
export const fetchPublicCollections = createAsyncThunk(
  'collections/fetchPublicCollections',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/collections/public');
      return response.data as Collection[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Add a new collection
export const addCollection = createAsyncThunk(
  'collections/addCollection',
  async (collectionData: CollectionRequest, thunkAPI) => {
    try {
      const response = await axios.post('/api/collections', collectionData);
      return response.data as Collection;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update a collection
export const updateCollection = createAsyncThunk(
  'collections/updateCollection',
  async ({ id, collectionData }: { id: number; collectionData: CollectionRequest }, thunkAPI) => {
    try {
      const response = await axios.put(`/api/collections/${id}`, collectionData);
      return response.data as Collection;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete a collection
export const deleteCollection = createAsyncThunk(
  'collections/deleteCollection',
  async (id: number, thunkAPI) => {
    try {
      await axios.delete(`/api/collections/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Collections
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action: PayloadAction<Collection[]>) => {
        state.loading = false;
        state.collections = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Public Collections
      .addCase(fetchPublicCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicCollections.fulfilled, (state, action: PayloadAction<Collection[]>) => {
        state.loading = false;
        state.publicCollections = action.payload;
        state.error = null;
      })
      .addCase(fetchPublicCollections.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Collection
      .addCase(addCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCollection.fulfilled, (state, action: PayloadAction<Collection>) => {
        state.loading = false;
        state.collections.push(action.payload);
      })
      .addCase(addCollection.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Collection
      .addCase(updateCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCollection.fulfilled, (state, action: PayloadAction<Collection>) => {
        state.loading = false;
        const index = state.collections.findIndex(col => col.id === action.payload.id);
        if (index !== -1) {
          state.collections[index] = action.payload;
        }
      })
      .addCase(updateCollection.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Collection
      .addCase(deleteCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCollection.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.collections = state.collections.filter(col => col.id !== action.payload);
      })
      .addCase(deleteCollection.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default collectionsSlice.reducer;