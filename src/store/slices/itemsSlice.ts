import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Item } from '../../types';

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (userId: string, { rejectWithValue }) => {
    try {
      const itemsCollection = collection(db, 'users', userId, 'items');
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList: Item[] = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];
      return itemsList;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addItem = createAsyncThunk(
  'items/addItem',
  async ({ userId, item }: { userId: string; item: Omit<Item, 'id'> }, { rejectWithValue }) => {
    try {
      const itemsCollection = collection(db, 'users', userId, 'items');
      const docRef = await addDoc(itemsCollection, item);
      return { id: docRef.id, ...item } as Item;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ userId, item }: { userId: string; item: Item }, { rejectWithValue }) => {
    try {
      const itemDoc = doc(db, 'users', userId, 'items', item.id);
      const { id, ...itemData } = item;
      await updateDoc(itemDoc, itemData);
      return item;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async ({ userId, itemId }: { userId: string; itemId: string }, { rejectWithValue }) => {
    try {
      const itemDoc = doc(db, 'users', userId, 'items', itemId);
      await deleteDoc(itemDoc);
      return itemId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearItems: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearItems } = itemsSlice.actions;
export default itemsSlice.reducer;