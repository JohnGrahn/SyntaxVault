import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  username: string;
  path: string;
  snippetIds: number[];
  subfolders: Folder[];
}

interface FoldersState {
  folders: Folder[];
  rootFolders: Folder[];
  currentFolder: Folder | null;
  loading: boolean;
  error: string | null;
}

const initialState: FoldersState = {
  folders: [],
  rootFolders: [],
  currentFolder: null,
  loading: false,
  error: null,
};

export interface FolderRequest {
  name: string;
  parentId?: number;
}

// Fetch all folders
export const fetchFolders = createAsyncThunk(
  'folders/fetchFolders',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/folders');
      return response.data as Folder[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Fetch root folders
export const fetchRootFolders = createAsyncThunk(
  'folders/fetchRootFolders',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/folders/root');
      return response.data as Folder[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create folder
export const createFolder = createAsyncThunk(
  'folders/createFolder',
  async (folderData: FolderRequest, thunkAPI) => {
    try {
      const response = await axios.post('/api/folders', folderData);
      return response.data as Folder;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Update folder
export const updateFolder = createAsyncThunk(
  'folders/updateFolder',
  async ({ id, folderData }: { id: number; folderData: FolderRequest }, thunkAPI) => {
    try {
      const response = await axios.put(`/api/folders/${id}`, folderData);
      return response.data as Folder;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete folder
export const deleteFolder = createAsyncThunk(
  'folders/deleteFolder',
  async (id: number, thunkAPI) => {
    try {
      await axios.delete(`/api/folders/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Get folder by ID
export const getFolderById = createAsyncThunk(
  'folders/getFolderById',
  async (id: number, thunkAPI) => {
    try {
      const response = await axios.get(`/api/folders/${id}`);
      return response.data as Folder;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    setCurrentFolder: (state, action: PayloadAction<Folder | null>) => {
      state.currentFolder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Folders
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFolders.fulfilled, (state, action: PayloadAction<Folder[]>) => {
        state.loading = false;
        state.folders = action.payload;
      })
      .addCase(fetchFolders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Root Folders
      .addCase(fetchRootFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRootFolders.fulfilled, (state, action: PayloadAction<Folder[]>) => {
        state.loading = false;
        state.rootFolders = action.payload;
      })
      .addCase(fetchRootFolders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Folder
      .addCase(createFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state, action: PayloadAction<Folder>) => {
        state.loading = false;
        state.folders.push(action.payload);
        if (!action.payload.parentId) {
          state.rootFolders.push(action.payload);
        }
      })
      .addCase(createFolder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Folder
      .addCase(updateFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFolder.fulfilled, (state, action: PayloadAction<Folder>) => {
        state.loading = false;
        const index = state.folders.findIndex(folder => folder.id === action.payload.id);
        if (index !== -1) {
          state.folders[index] = action.payload;
        }
        const rootIndex = state.rootFolders.findIndex(folder => folder.id === action.payload.id);
        if (rootIndex !== -1) {
          if (action.payload.parentId) {
            state.rootFolders.splice(rootIndex, 1);
          } else {
            state.rootFolders[rootIndex] = action.payload;
          }
        } else if (!action.payload.parentId) {
          state.rootFolders.push(action.payload);
        }
      })
      .addCase(updateFolder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Folder
      .addCase(deleteFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFolder.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.folders = state.folders.filter(folder => folder.id !== action.payload);
        state.rootFolders = state.rootFolders.filter(folder => folder.id !== action.payload);
        if (state.currentFolder?.id === action.payload) {
          state.currentFolder = null;
        }
      })
      .addCase(deleteFolder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Folder by ID
      .addCase(getFolderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFolderById.fulfilled, (state, action: PayloadAction<Folder>) => {
        state.loading = false;
        state.currentFolder = action.payload;
      })
      .addCase(getFolderById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentFolder } = foldersSlice.actions;
export default foldersSlice.reducer; 