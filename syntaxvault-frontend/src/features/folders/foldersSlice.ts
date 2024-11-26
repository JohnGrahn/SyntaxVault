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

const buildFolderHierarchy = (folders: Folder[]): Folder[] => {
  const folderMap = new Map<number, Folder>();
  
  // First pass: create a map of all folders with clean subfolders arrays
  folders.forEach(folder => {
    folderMap.set(folder.id, { ...folder, subfolders: [] });
  });

  // Second pass: build hierarchy
  return folders
    .filter(folder => folder.parentId === null)
    .map(folder => {
      const rootFolder = folderMap.get(folder.id);
      if (!rootFolder) return folder;

      // Recursively build subfolder structure
      const buildSubfolders = (parentId: number) => {
        return folders
          .filter(f => f.parentId === parentId)
          .map(f => {
            const folder = folderMap.get(f.id);
            if (!folder) return f;
            folder.subfolders = buildSubfolders(f.id);
            return folder;
          });
      };

      rootFolder.subfolders = buildSubfolders(folder.id);
      return rootFolder;
    });
};

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
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFolders.fulfilled, (state, action: PayloadAction<Folder[]>) => {
        state.loading = false;
        state.folders = action.payload;
        state.rootFolders = buildFolderHierarchy(action.payload);
      })
      .addCase(fetchFolders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateFolder.fulfilled, (state, action: PayloadAction<Folder>) => {
        state.loading = false;
        // Update the folder in the folders array
        const index = state.folders.findIndex(folder => folder.id === action.payload.id);
        if (index !== -1) {
          state.folders[index] = action.payload;
        }
        // Rebuild hierarchy
        state.rootFolders = buildFolderHierarchy(state.folders);
        // Update current folder if needed
        if (state.currentFolder?.id === action.payload.id) {
          state.currentFolder = action.payload;
        }
      });
  },
});

export const { setCurrentFolder } = foldersSlice.actions;
export default foldersSlice.reducer; 